'use strict';

//var Core = require('./core');
var _ = require('underscore');
var Handlebars = require('handlebars');
var TagHelper = require('./tag_helper');

var safe = function(){
  return TagHelper.safe.apply(this, arguments);
};

var render_partial = function(template, context){
  return TagHelper.render_partial.call(this, template, context);
};

module.exports = {

  t: function(key){
    return Core.i18n.t(key);
  },

  num_prefix: function(num){
    if(num > 0){return '+';}
    //if(num < 0){return "-";}
  },

  debug: function(what){
    console.log(what);
    return null;
  },

  yield: function(opts){
    var attributes = _.extend({
      'data-yield': this.view.cid
    }, opts.hash);

    var string_attributes = _.map(attributes, function(v, k){ return k+'='+v; }).join(' ');

    return new Handlebars.SafeString('<div '+string_attributes+'></div>');
  },

  active_if: function(a, b){
    return a == b ? safe('class="active"') : ''; // jshint ignore:line
  },

  active_class_if: function(a, b){
    return a == b ? safe('active') : ''; // jshint ignore:line
  },

  when: function(what, opts){
    return what ? opts.hash.then : opts.hash['else'];
  },

  selected: function(a, b){
    return a == b ? safe('selected="selected"') : '';  // jshint ignore:line
  },

  animated_number: function(model, attribute, opts){
    var start = model.previous(attribute) || 0;
    var end = model.get(attribute);
    var format = opts.hash.format ? 'data-format="'+opts.hash.format+'"' : '';
    start = Formatters[opts.hash.format || 'integer'](start);
    return safe('<span class="number_animate" data-bind="'+attribute+'" data-start="'+start+'" data-end="'+end+'" '+format+'>'+start+'</span>');
  },

  highlight: function(input){
    _.defer(function(){
      this.view.$el.animate({fontSize: '1.5em'}, 300).delay(0.3).animate({fontSize: '1em'}, 300);
    }.bind(this));
    return input;
  },

  bar_value: function(model, attribute, opts){
    var value = this.previous(model, attribute);
    var format = opts.hash.format ? 'data-format="'+opts.hash.format+'"' : '';
    value = opts.hash.format ? Formatters[opts.hash.format](value) : value;
    return safe('<span class="bar-value" '+format+'>'+value+'</span>');
  },

  previous: function(model, attribute){
    return model.previous(attribute) || (model.defaults && model.defaults[attribute]) || 0;
  },

  template: function(name, opts){
    return safe(JST[name]({
      inner: safe(opts.fn(this))
    }));
  },

  render: function(name){
    return safe(JST[name](this));
  },

  live: function(attribute){
    var model = this.model, action;

    if(!this.view.live[attribute]){
      for(var attr in this.view.live){
        action = this.view.live[attr];
        if(action.as === attribute){
          attribute = attr;
          break;
        }
      }
    }

    var value = this.view.resolve_live_value(model, attribute);

    return safe('<span data-bind="'+attribute+'">'+value+'</span>');
  },


  contains: function(arr, item, opts){
    if(_.contains(arr, item)){
      opts.fn(this);
    }else{
      opts.inverse(this);
    }
  },

  times: function(count, options){
    var buffer = '';
    _(count).times(function(item){
      buffer += options.fn(item);
    });
    return buffer;
  },

  url_for: function(name, opts){
    return Core.router.url_for(name, opts.hash || {});
  },

  link_to: function(title, route, opts){
    var url = Core.router.url_for(route, opts.hash || {});
    return safe('<a href="'+url+'">'+title+'</a>');
  },

  absolute_url: function(path, opts){
    var hostname;
    if(/localhost|127\.|192\./.test(location.hostname)){
      hostname = '188.252.173.66';
    }
    var host = opts.hash.hostname || hostname || location.hostname || '',
        port = opts.hash.port || location.port;
        port = port ? ':'+port : '';
    var url = [location.protocol, '//', host, port, '/', path].join('');
    return url;
  },

  speed: function(number){
    number = number || 300;
    return number / 1000;
  },

  /**
     * TODO !
     *
     * @method paginate
     * @param  {String} id
     * @param  {Object} options
     * @return {String}
     */
  paginate: function(id, options){
    var view = options.hash.context ? options.hash.context.view : this.view;
    var view_pager = view.pagers[id];
    if(!view_pager.pager){return '';}

    var context = view_pager.pager;
    context.id = id;
    if(options.hash.auto_hide){
      context.show = context.total_pages > 1;
    }else{
      context.show = true;
    }

    context.pages =  view_pager.pager.render();
    context.prev_disabled = !context.prev;
    context.next_disabled = !context.next;

    return safe(render_partial('paginator', context));
  },


  /**
   * Used as handlebars function. For existing view.pager creates dropdown to choose number of collection
   * items displayed per page. On item select triggers collection.fetch event to update pagination
   * (number of pages, items per page, ...)
   * @method pages_selector
   * @param  {String} id
   * @return {String}
   */
  pages_selector: function(id){
    console.log(this);
    var view = this.view;
    var view_pager = view.pagers[id];
    if(!view_pager.pager){return '';}
    var collection = view_pager.items;
    var context = {
      id: _.uniqueId('pages_selector'),
      limit: collection.children_limit,
      collection: [
        {id: 5, name: 5},
        {id: 10, name: 10},
        {id: 25, name: 25},
        //{id: 50, name: 50}
      ]
    };

    _.defer(function(){
      $('#'+context.id).on('change', function(){
        var data  = {
          page: 1,
          limit: $(this).val()
        };

        if(view.name === 'search' && !view.collection.path.length){
          collection.search_data({
            data: _.extend(data, view.tabs.search_params())
          });
        }else{
          collection.fetch_list({
            data: data
          });
        }
      });
    });

    return safe(render_partial('pages_selector', context));
  }, // END OF pages_selector (function)

  get: function(model, property_name){
    return model.get(property_name);
  },


  get_column: function(model, property_name){
    var columns = model.get('columns');
    return columns ? columns[property_name] : '';
  },


  eq: function(val1, val2, options){
    if(val1 === val2) {
      return options.fn(this);
    } else {
      return options.inverse(this);
    }
  },

  if_not_empty: function(context, options){
    if(_.isEmpty(context)){
      return options.inverse(this);
    } else {
      return options.fn(this);
    }
  },

  uid: function(regenerate){
    regenerate && (this._last_uid = _.uniqueId('uid_'));
    return this._last_uid;
  },

  input: function(attribute, options){
    return (this.object ? this : TagHelper).input(attribute, options.hash);
  },

  /**
   * Wrapper around TagHelper form_for function to make it usable on templates as Handlebars helper.
   *
   * @method form_for
   * @param  {[type]} object
   * @param  {[type]} options
   * @return {[type]}
   */
  form_for: function(object, options){
    return TagHelper.form_for(object, _.omit(options.hash, 'as'), options.fn);
  },

  /**
   * Wrapper around TagHelper fields_for function to make it usable on templates as Handlebars helper.
   *
   * @method fields_for
   * @param  {[type]}   object
   * @param  {[type]}   options
   * @return {[type]}
   */
  fields_for: function(object, options){
    return TagHelper.fields_for(object, options.hash, options.fn);
  }

};
