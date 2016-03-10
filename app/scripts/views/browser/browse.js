define([
  'underscore',
  'app',
  'view',
  'views/modal',
  'collections/menu_items',
  'collections/items',
  './root_items',
  './tree',
  './list_root',
  './list',
  './preview',
  './breadcrumb'],
  function(_, App, View, Modal, MenuItems, Items, RootItemsView, TreeView, ListRootView, ListView, PreviewView, BreadcrumbView){

  'use strict';

  return Modal.extend({

    extend_with: ['browser'],

    template: 'browser/browse',

    prevent_auto_render: true,

    events:{
      'click .btn-preview': '$toggle_preview'
    },

    initialize: function(options){
      Modal.prototype.initialize.apply(this, arguments);

      this.browser = options.browser;

      this.menu_items = new MenuItems();
      this.menu_items.save_default_columns();
      this.menu_items.fetch();

      this.root_items = App.g.tree_config.root_items;
      this.listenToOnce(this.collection, 'sync', this.render_root_items);

      this.listenTo(this.collection, 'sync', function(){
        this.$('#browser-tabs').tabs();
        this.set_preview_height();
        this.render_tree();
        var model = this.root_items.selected_model();
        this.render_list_view(model);
        this.render_breadcrumb(model);
      });


      return this;
    },

    render_root_items: function(){
      this.root_items_view = new RootItemsView({
        collection: this.root_items,
        browse: this,
        'el': '.root-items'
      }).render();

      return this;
    },

    render_tree: function(){
      this.tree_view = new TreeView({
        collection: this.collection,
        browse: this,
        el: '.tree'
      }).render();

      return this;
    },

    render_subtree: function(el, items){
      var collection = items;

      this.tree_view = new TreeView({
        collection: collection,
        browse: this,
        el: el || '.tree'
      }).render();

      return this;
    },

    render_list_root: function(model){
      model.browser = this.browser;

      this.list_root_view = new ListRootView({
        model: model,
        el: '.right-panel .list-root',
        browse: this
      }).render();

    },

    render_list_view: function(model){
      var items = new Items();
      items.browser = this.browser;

      this.list_view = new ListView({
        collection: items,
        el: '.right-panel .list',
        browser: this.browser,
        browse: this
      });

      this.list_view.on('render', function(){
        this.render_list_root(this.root_model || model);
        this.root_model = null;
      }.bind(this));

      items.fetch_list_model_id(model.id);
    },

    render_preview: function(model){
      this.preview = new PreviewView({
        context: {
          html: model.get('html') || '<h3>' + model.get('name') + '</h3>'
        },
        'el': '.preview'
      }).render();
    },

    render_breadcrumb: function(collection){
      this.breadcrumb = new BreadcrumbView({
        collection: collection.path,
        'el': '.breadcrumb',
        browse: this
      }).render();
    },


    set_preview_height: function(){
      var $panel = this.$('.col-md-2 .panel');
      $panel.height($panel.closest('.row').height() - 22);
    },

    $toggle_preview: function(){
      this.$('.preview-panel').toggle();
      this.$('.list-panel')
        .toggleClass('col-md-7')
        .toggleClass('col-md-9');
    }

  });

});
