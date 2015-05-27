
var _ = require('lodash');
var React = require('react');
var Router = require('react-router');
var MUI = require('material-ui');
var ThemeManager = require('material-ui/lib/styles/theme-manager')();
var Colors = require('material-ui/lib/styles/colors');

var Master = React.createClass({
  mixins: [Router.Navigation],
  childContextTypes: {
    muiTheme: React.PropTypes.object
  },
  getChildContext: function() {
    return {
      muiTheme: ThemeManager.getCurrentTheme()
    };
  },
  getInitialState: function () {
    var clients = window.JSON.parse(window.localStorage.getItem('clients') || '[]');
    clients = [{name: 'alv', code: '49ef9def28844cbfbe0a6c7fdabc981e'}];
    return {
      clients: clients,
      message: []
    };
  },
  render: function() {
    var menuItems = [
      { route: 'manage', text: '登录状态管理' },
      { route: 'pair', text: '配对' },
      { route: 'about', text: '关于' }
    ];
    var navHeader = <div className="nav-header">Lockman Key</div>;
    return (
      <div>
        <MUI.AppBar title="Lockman Key" onLeftIconButtonTouchTap={this.toggleNav} />
        <MUI.LeftNav ref="nav" docked={false} header={navHeader} menuItems={menuItems}
                     onChange={this.handleNavChange} />
        <div className="content">
          <Router.RouteHandler
            clients={this.state.clients}
            onClientAppend={this.handleClientAppend}
            onClientRemove={this.handleClientRemove}
          />
        </div>
      </div>
    );
  },
  toggleNav: function () {
    this.refs.nav.toggle();
  },
  handleNavChange: function (e, selectedIndex, menuItem) {
    this.transitionTo(menuItem.route);
  },
  handleClientsRefresh: function () {
    window.localStorage.setItem('clients', window.JSON.stringify(this.state.clients));
    this.forceUpdate();
  },
  handleClientAppend: function (client) {
    this.state.clients.push(client);
    this.handleClientsRefresh();
  },
  handleClientRemove: function (clientCode) {
    var clients = this.state.clients;
    var index = _.findIndex(clients, function (client) {
      return client.code == clientCode;
    });
    clients.splice(index, 1);
    this.handleClientsRefresh();
  }
});

module.exports = Master;
