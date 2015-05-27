
var React = require('react');
var Router = require('react-router');
var Route = Router.Route;
var DefaultRoute = Router.DefaultRoute;

var Master = require('./master.jsx');
var Manage = require('./manage.jsx');
var Pair = require('./pair.jsx');

var AppRoutes = (
  <Route name="root" path="/" handler={Master}>
    <Route name="manage" handler={Manage} />
    <Route name="pair" handler={Pair} />
    <DefaultRoute handler={Manage}/>
  </Route>
);

module.exports = AppRoutes;
