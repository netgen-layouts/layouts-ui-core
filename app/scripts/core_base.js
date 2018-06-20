'use strict';

var Core = require('./core_namespace');
var utils = require('./extended/utils');

var Env = require('./environments/default');
var jQuery = require('./extended/jquery_override');
var _ = require('underscore');
var Backbone = require('./extended/backbone_override');

Backbone.$ = jQuery;
Backbone.LocalStorage = require('backbone.localstorage');

var CoreExtend = {
  env: Env,
  utils: utils,
  _: _,
  $: jQuery,
  Backbone: Backbone,
  g: {},
  default_context: function(){}
};

_.extend(Core, CoreExtend,  Backbone.Events);

module.exports = Core;
