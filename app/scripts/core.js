'use strict';

var Env = require('./environments/development');
var JQuery = require('./extended/jquery_override');
window.$ = window.jQuery = JQuery;
var _ = require('underscore');
var Backbone = require('./extended/backbone_override');

Backbone.LocalStorage = require('backbone.localstorage');

var Core = {
  env: Env,
  _: _,
  Backbone: Backbone,
  g: {}
};

_.extend(Core, Backbone.Events);

module.exports = Core;
