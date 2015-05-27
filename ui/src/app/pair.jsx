
var _ = require('lodash');
var React = require('react');
var MUI = require('material-ui');
var cordova = require('./cordova-bridge');

var Main = React.createClass({
  getInitialState: function () {
    return {
      onlineClients: []
    };
  },
  componentWillMount: function () {
    var that = this;
    cordova.call('list', function (message) {
        that.setState(JSON.parse(message));
    });
  },
  render: function() {
    var props = this.props;
    var clients = _.map(this.state.onlineClients, function (onlineClient) {
      var paired = _.findIndex(props.clients, function (client) {
        return onlineClient.code = client.code;
      });
      return <Main.Item
        key={onlineClient.code}
        client={onlineClient}
        paired={paired}
        onClientAppend={props.onClientAppend}
        onClientRemove={props.onClientRemove}
      />;
    });
    return (
      <div>
        <h1>配对管理</h1>
        <div>
          {clients}
        </div>
      </div>
    );
  }
});

Main.Item = React.createClass({
  render: function () {
    var client = this.props.client;
    return (
      <MUI.Paper className="pair-item" zDepth={1}>
        <div className="pair-item-name">{client.name}</div>
        <div className="pair-item-code">{client.code}</div>
        <div className="pair-item-control">
          <MUI.RaisedButton label="配对" secondary={true} onTouchTap={this.handlePair} />
          {false && <MUI.RaisedButton label="断开" primary={true} onTouchTap={this.handleUnpair} />}
        </div>
      </MUI.Paper>
    );
  },
  handlePair: function () {
    var props = this.props;
    cordova.call('pair', this.props.client.code, function () {
      if (true) {  // FIXME
        props.onClientAppend(props.client);
      }
    });
  },
  handleUnpair: function () {
    var props = this.props;
    props.onClientRemove(props.client.code);
  }
});

module.exports = Main;
