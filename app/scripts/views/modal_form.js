'use strict';

var Core = require('../core_base');
var $ = Core.$;
var _ = require('underscore');
var Modal = require('./modal');

module.exports = Core.ModalForm = Modal.extend({
  extend_with: ['url', 'on_success', 'on_error'],

  template: 'modal_form',
  ENTER_KEY: 13,

  prevent_auto_render: true,

  initialize: function(options){
    Modal.prototype.initialize.apply(this, arguments);
    this.modal_options = $.extend({
      backdrop: 'static'
    }, options.modal_options);

    this.listenTo(Core.router, 'route', this.close);

    this.on('save:success', function(){
      this.on_success.apply(this, arguments);
    });

    this.on('save:error', function(){
      this.on_error.apply(this, arguments);
    });

    this.on('apply', this.on_apply);
    return this;
  },

  events: {
    'submit form': '$submit',
    'keypress input': '$enter',
  },

  on_success: function(resp){
    this.close();
    this.model.fetch();
  },

  on_error: function(xhr){
    this.context.body = xhr.responseText;
    this.render();
  },

  open: function(){
    $.get(this.url).done(function(resp){
      this.context.body = resp;
      Modal.prototype.open.apply(this, arguments);
    }.bind(this));
    return this;
  },

  $enter: function(e) {
    if (e.which === this.ENTER_KEY) {
      this.$submit(e);
    }
    return this;
  },

  $submit: function(e){
    e.preventDefault();
    return this.$('form')
        .ajax_submit()
        .done(function(){
          this.trigger.apply(this, ['save:success'].concat(_.toArray(arguments)) );
        }.bind(this))
        .fail(function(){
          this.trigger.apply(this, ['save:error'].concat(_.toArray(arguments)) );
        }.bind(this))
  },

  $apply: function(e){
    this.$submit.apply(this, arguments);
  }

});
