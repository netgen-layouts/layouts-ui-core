'use strict';

var Core = require('./core_namespace');

var Env = require('./environments/development');
var jQuery = require('./extended/jquery_override');
var _ = require('underscore');
var Backbone = require('./extended/backbone_override');

Backbone.$ = jQuery;
Backbone.LocalStorage = require('backbone.localstorage');




var CoreExtend = {
  env: Env,
  _: _,
  $: jQuery,
  Backbone: Backbone,
  g: {},
  default_context: function(){}
};

_.extend(Core, CoreExtend,  Backbone.Events);

module.exports = Core;
