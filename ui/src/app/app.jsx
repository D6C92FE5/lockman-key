(function () {
  var React = require('react');
  var Router = require('react-router');
  var injectTapEventPlugin = require('react-tap-event-plugin');
  var AppRoutes = require('./app-routes.jsx');

  //Needed for React Developer Tools
  window.React = React;

  //Needed for onTouchTap
  injectTapEventPlugin();

  document.addEventListener('deviceready', function () {
    Router.create({
      routes: AppRoutes,
      scrollBehavior: Router.ScrollToTopBehavior
    }).run(function (Handler) {
      React.render(<Handler />, document.body);
    });
  }, false);
})();
