(function () {
  var React = require('react');
  var Router = require('react-router');
  var injectTapEventPlugin = require('react-tap-event-plugin');
  var AppRoutes = require('./app-routes.jsx');

  //Needed for React Developer Tools
  window.React = React;

  //Needed for onTouchTap
  injectTapEventPlugin();

  var clients = [
    {name: 'alv', code: '49ef9def28844cbfbe0a6c7fdabc981e'}
  ];

  Router.create({
    routes: AppRoutes,
    scrollBehavior: Router.ScrollToTopBehavior
  }).run(function (Handler) {
    React.render(<Handler clients={clients}/>, document.body);
  });
  document.addEventListener('deviceready', function () {
    React.render(<Main />, document.body);
  }, false);
})();
