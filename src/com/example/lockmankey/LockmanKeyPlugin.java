package com.example.lockmankey;

import android.annotation.TargetApi;
import android.content.Context;
import android.os.Build;
import android.security.KeyPairGeneratorSpec;
import android.util.Log;
import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import javax.net.ssl.KeyManagerFactory;
import javax.net.ssl.SSLContext;
import javax.net.ssl.SSLSocket;
import javax.net.ssl.SSLSocketFactory;
import javax.security.auth.x500.X500Principal;
import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.math.BigInteger;
import java.net.Socket;
import java.security.KeyPairGenerator;
import java.security.KeyStore;
import java.util.Calendar;
import java.util.Date;


public class LockmanKeyPlugin extends CordovaPlugin {

    String ksAlias = "LockmanKey";
    String host = "192.168.11.10";
    int port = 8889;

    @TargetApi(Build.VERSION_CODES.JELLY_BEAN_MR2)
    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);

        try {
            KeyStore ks = KeyStore.getInstance("AndroidKeyStore");
            ks.load(null);
            if (!ks.containsAlias(ksAlias)) {
                Context context = cordova.getActivity().getApplicationContext();
                Calendar cal = Calendar.getInstance();
                Date now = cal.getTime();
                cal.add(Calendar.YEAR, 1);
                Date end = cal.getTime();

                KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA", "AndroidKeyStore");
                kpg.initialize(new KeyPairGeneratorSpec.Builder(context)
                        .setAlias(ksAlias)
                        .setStartDate(now)
                        .setEndDate(end)
                        .setSerialNumber(BigInteger.valueOf(1))
                        .setSubject(new X500Principal("CN=test1"))
                        .build());
                kpg.generateKeyPair();
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
    }

    @Override
    public boolean execute(String action, JSONArray data, final CallbackContext callbackContext) throws JSONException {

        if (action.equals("greet")) {
            String name = data.getString(0);
            String message = "Hello, " + name;
            callbackContext.success(message);
            return true;

        } else if (action.equals("list")) {
            new ListClients(host, port, callbackContext).start();
            return true;

        }  else if (action.equals("pair") || action.equals("status") ||
                    action.equals("lock") || action.equals("unlock")) {
            new ManageClient(data.getString(0), action, host, port, callbackContext).start();
            return true;

        } else {
            return false;
        }
    }

}

class SocketTarget extends Thread {

    protected String host;
    protected int port;
    protected CallbackContext callback;

    public SocketTarget(String host, int port, CallbackContext callback) {
        this.host = host;
        this.port = port;
        this.callback = callback;
    }

}

class ListClients extends SocketTarget {

    public ListClients(String host, int port, CallbackContext callback) {
        super(host, port, callback);
    }

    public void run() {
        try {
            Socket socket = new Socket(host, port);
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));
            BufferedReader reader = new BufferedReader(new InputStreamReader(socket.getInputStream()));

            JSONObject json = new JSONObject();
            json.put("command", "list");
            writer.write(json.toString() + "\n");
            writer.flush();

            String message = reader.readLine();
            Log.d("!!!!", message);
            callback.success(message);

            writer.close();
            reader.close();
            socket.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}

class ManageClient extends SocketTarget {

    private String deviceCode;
    private String command;

    public ManageClient(String deviceCode, String command,
                        String host, int port, CallbackContext callback) {
        super(host, port, callback);
        this.deviceCode = deviceCode;
        this.command = command;
    }

    public void run() {
        try {
            KeyStore ks = KeyStore.getInstance("AndroidKeyStore");
            ks.load(null);
            KeyManagerFactory kmf = KeyManagerFactory.getInstance(KeyManagerFactory.getDefaultAlgorithm());
            kmf.init(ks, null);

            SSLContext sslContext = SSLContext.getInstance("TLS");
            sslContext.init(kmf.getKeyManagers(), null, null);
            SSLSocketFactory sf = sslContext.getSocketFactory();

            Socket socket = new Socket(host, port);
            BufferedWriter writer = new BufferedWriter(new OutputStreamWriter(socket.getOutputStream()));

            JSONObject json = new JSONObject();
            json.put("command", "link");
            json.put("target", deviceCode);
            writer.write(json.toString() + "\n");
            writer.flush();

            SSLSocket sSocket = (SSLSocket)sf.createSocket(
                    socket, socket.getInetAddress().getHostAddress(),
                    socket.getPort(), true);
            sSocket.setUseClientMode(false);
            sSocket.setEnabledProtocols(sSocket.getSupportedProtocols());
            sSocket.setEnabledCipherSuites(sSocket.getSupportedCipherSuites());
            sSocket.startHandshake();

            writer = new BufferedWriter(new OutputStreamWriter(sSocket.getOutputStream()));
            BufferedReader reader = new BufferedReader(new InputStreamReader(sSocket.getInputStream()));

            json = new JSONObject();
            json.put("command", command);
            writer.write(json.toString() + "\n");
            writer.flush();

            String message = reader.readLine();
            Log.d("!!!!", message);
            callback.success(message);

            writer.close();
            reader.close();
            socket.close();
        } catch (Exception e) {
            e.printStackTrace();
        }
    }
}
