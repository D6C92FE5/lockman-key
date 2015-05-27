
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
          <span className="manage-item-code">({client.code})</span>
        </div>
        <div className="manage-item-control">
          <MUI.RaisedButton label="当前状态" onTouchTap={this.handleStatus}/>
          <MUI.RaisedButton label="解锁" secondary={true} onTouchTap={this.handleLock} />
          <MUI.RaisedButton label="锁定" primary={true} onTouchTap={this.handleUnlock} />
        </div>
      </MUI.Paper>
    );
  },
  handleStatus: function () {
    cordova.call('status', this.props.client.code, alert);
  },
  handleLock: function () {
    cordova.call('lock', this.props.client.code, alert);
  },
  handleUnlock: function () {
    cordova.call('unlock', this.props.client.code, alert);
  }
});

module.exports = Main;
