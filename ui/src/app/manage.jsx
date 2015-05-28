
var _ = require('lodash');
var React = require('react');
var MUI = require('material-ui');
var cordova = require('./cordova-bridge');

var Main = React.createClass({
  render: function() {
    clients = _.map(this.props.clients, function (client) {
      return <Main.Item key={client.code} client={client} />;
    });
    return (
      <div>
        <h1>登录状态管理</h1>
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
      <MUI.Paper className="manage-item" zDepth={1}>
        <div className="manage-item-title">
          <span className="manage-item-name">{client.name}</span>
          <span className="manage-item-code">({client.code.slice(0, 6)})</span>
        </div>
        <div className="manage-item-control">
          <MUI.RaisedButton label="当前状态" onTouchTap={this.handleStatus}/>
          <MUI.RaisedButton label="锁定" primary={true} onTouchTap={this.handleLock} />
          <MUI.RaisedButton label="解锁" secondary={true} onTouchTap={this.handleUnlock} />
        </div>
      </MUI.Paper>
    );
  },
  handleStatus: function () {
    cordova.call('status', this.props.client.code, function (message) {
      alert(JSON.parse(message).status === 'locked' ? '已锁定' : '已解锁');
    });
  },
  handleLock: function () {
    cordova.call('lock', this.props.client.code, function (message) {
      var error = JSON.parse(message).error;
      if (error) {
        alert(error);
      }
      //alert(JSON.parse(message).message);
    });
  },
  handleUnlock: function () {
    cordova.call('unlock', this.props.client.code, function (message) {
      var error = JSON.parse(message).error;
      if (error) {
        alert(error);
      }
      //alert(JSON.parse(message).message);
    });
  }
});

module.exports = Main;
