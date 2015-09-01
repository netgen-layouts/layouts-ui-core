define(['underscore', './base', 'app'], function(_, Base, App){
  'use strict';

  return Base.extend({

    form_namespace: 'group',

    events: {
      // 'mouseenter': '$mouseenter',
      // 'mouseleave': '$mouseleave'
    },

    initialize: function(){
      Base.prototype.initialize.apply(this, arguments);
      this.on('render', this.after_render);
      this.listenTo(this.model, 'save:success', this.after_save);
      return this;
    },

    $mouseenter: function(){
      $(document.body).addClass('group_edit');
      this.$el.addClass('xray');
      return this;
    },

    $mouseleave: function(){
      $(document.body).removeClass('group_edit');
      this.$el.removeClass('xray');
      return this;
    },

    after_save: function(){
      this.update_positions();
      return this;
    },

    after_render: function(){
      App.blocks.load_group_blocks(this);
    },

    render: function(){
      if(!this.model.id){ return this; }
      $.get(this.model.html_url())
        .done(function(resp){
          this.$el.html(resp);
          this.render2();
        }.bind(this));
      return this;
    },

    render2: function(){
      this.$el.attr('data-block', '');
      this.$el.attr('data-type', this.model.get('template').get('kind'));
      this.$el.prepend(JST['block_actions'](this.context)); // jshint ignore:line
      this.trigger_render();
    }

  });
});
