'use strict';

var Core = require('core');
require('bootstrap'); // we need this for modal
var View = require('../extended/view');

module.exports = Core.Modal = View.extend({

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
    var self = this;
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
    console.log('OPEEEEEEEEEEEN');
    if(this.is_open){ return this; }
    this.render().insert().$el.modal({});
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
