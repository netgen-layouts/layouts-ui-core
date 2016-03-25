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
  g: {},
  show_error: function(options){
    new Core.Modal(options).open();
  }
};

_.extend(Core, Backbone.Events);

module.exports = Core;
