'use strict';

var Core = require('core');
require('bootstrap'); // we need this for modal
var View = require('../extended/view');

module.exports = Core.Modal = View.extend({
  extend_with: ['modal_options'],

  template: 'modal',

  className: 'mymodal modal fade',

  events: {
    'click .action_apply':  '$apply',
    'click .action_cancel':  '$cancel',
    'submit form': '$submit'
  },

  initialize: function(options){
    View.prototype.initialize.apply(this, arguments);
    this.context.title = options.title;
    this.context.cancel_disabled = options.cancel_disabled || false;
    this.context.apply_text = options.apply_text || 'OK';
    this.context.cancel_text = options.cancel_text || 'Cancel';
    var self = this;
    this.$el.attr('tabindex', -1);
    this.$el.on('hidden.bs.modal', function(){
      self.remove();
      self.trigger('close');
    });
    return this;
  },

  insert: function(){
    this.$el.appendTo(document.body);
    return this;
  },

  open: function(){
    if(this.is_open){ return this; }
    this.render().insert().$el.modal(this.modal_options);
    this.trigger('open');
    this.is_open = true;
    return this;
  },

  close: function(){
    this.$el.modal('hide');
    this.is_open = false;
    this.trigger('close');
  },


  $submit: function(e){
    e.preventDefault();
    this.$apply();
    return this;
  },

  $apply: function(e){
    e && e.preventDefault();
    this.trigger('apply');
    this.close();
    return this;
  },

  $cancel: function(e){
    e && e.preventDefault();
    this.trigger('cancel');
    this.close();
    return this;
  }



});
