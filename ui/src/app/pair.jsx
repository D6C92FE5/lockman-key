
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
    /*
    cordova.call('list', function (message) {
        that.setState(JSON.parse(message));
    });
    */
    that.setState({onlineClients: [
      {name: 'alv', code: '49ef9def28844cbfbe0a6c7fdabc981e'},
      {name: 'test-pc', code: '8817b8c17680471799eac4bc370e9943'},
      {name: '测试', code: 'c59f20f29f6e4479a187a7234679c6b9'}
    ]});
  },
  render: function() {
    var props = this.props;
    var clients = _.map(this.state.onlineClients, function (onlineClient) {
      var paired = _.findIndex(props.clients, function (client) {
        return onlineClient.code == client.code;
      }) != -1;
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
    var paired = this.props.paired;
    return (
      <MUI.Paper className="pair-item" zDepth={1}>
        <div className="pair-item-name">{client.name}</div>
        <div className="pair-item-code">{client.code}</div>
        <div className="pair-item-control">
          {!paired && <MUI.RaisedButton label="配对" secondary={true} onTouchTap={this.handlePair} />}
          {paired && <MUI.RaisedButton label="断开" primary={true} onTouchTap={this.handleUnpair} />}
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
