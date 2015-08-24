define(['underscore', 'backbone', 'model'], function(_, Backbone, Model){
  'use strict';


  var hashCode = function(str) {
    var hash = 0, i, chr, len;
    if (str.length == 0) return hash;
    for (i = 0, len = str.length; i < len; i++) {
      chr   = str.charCodeAt(i);
      hash  = ((hash << 5) - hash) + chr;
      hash |= 0; // Convert to 32bit integer
    }
    return hash;
  };

  return Backbone.Collection.extend({

    initialize: function(){
      Backbone.Collection.prototype.initialize.apply(this, arguments);
      this.cid = _.uniqueId('collection');
      this.on('sync', this.create_index);
      return this;
    },

    model: Model,

    index: {},

    parse: function(resp){
      return ('values' in resp) ? resp.values : resp;
    },

    fetch_once: function(){
      if(this.cached && this.length){return null;}
      return Backbone.Collection.prototype.fetch.apply(this, arguments);
    },

    //selected: [],

    selected: function(){
      return this.filter(function(item){
        return item.get('selected');
      });
    },

    selected_ids: function(){
      return _.pluck(this.selected(), 'id');
    },

    create_index: function(){
      //if(!(this.via === 'read' && this.indexes)){return;}
      this.index = {};
      var compiled, index_name;
      this.each(function(item){
        _.each(this.indexes, function(keys){
          index_name = keys.join('_');
          this.index[index_name] = this.index[index_name] || {};
          compiled = _.map(keys, function(attr){
            return item.get(attr);
          }).join(',');
          this.index[index_name][compiled] = this.index[index_name][compiled] || [];
          this.index[index_name][compiled].push(item);
        }, this);
      }, this);
    },


    update: function(obj, opts){
      this.each(function(m){
        m.set(obj, opts);
      });
    },


    deep_clone: function(){
      return new this.constructor(this.toJSON());
    },

    get_by_ids: function(){
      var ids = _.chain(arguments).toArray().flatten().value();
      var out = [], item;
      _.each(ids, function(id){
        item = this.get(id);
        item && out.push(item);
      }, this);
      return out;
    },

    where: function(filter, first){
      var index_name = _.keys(filter).join('_'), result;
      if(this.index[index_name]){
        result = this.index[index_name][_.values(filter).join(',')] || [];
        return first ? result[0] : result;
      }else{
        return Backbone.Collection.prototype.where.apply(this, arguments);
      }
    },

    search : function(query, field){
      if(query === ''){return this;}

      var pattern = new RegExp(query,'gi');
      return _(this.filter(function(data) {
        return pattern.test(data.get(field));
      }));

    },


    roots: function(){
      return this.by_depth(0)[0];
    },

    by_depth: function(){
      return this.__by_depth || (this.__by_depth = this.groupBy(function(child){return child.get('depth'); }));
    },


    structured: function(callback, ids, items, context){
      var children,
          structured = {},
          arr = items || this.roots(),
          category,
          _l = arr.length;

      for(var i=0; i<_l; i++){
        category = arr[i];
        if(!ids || _.contains(ids, category.id)){
          structured[category.id] = structured[category.id] || {
            category: category,
            children: {}
          };

          callback.call(context, structured[category.id], category.id);

          children = category.get('children');
          if(children.length){
            structured[category.id].children = this.structured(callback, ids, children, context);
          }
        }
      }

      return structured;
    },


    snapshot: function(){
      this.state = this.toJSON();
      this.trigger('snapshot');
      return this;
    },


    revert: function(){
      this.reset(this.state);
      this.trigger('revert');
      return this;
    },

    is_state_dirty: function(){
      console.debug( hashCode(JSON.stringify(this.serialize_state)), hashCode(JSON.stringify(this.serialize())) )
      return hashCode(JSON.stringify(this.serialize_state)) !== hashCode(JSON.stringify(this.serialize()))
    },


    tree: function(callback, items){
      var children;
      _.each(items || this.roots(), function(category){
        callback(category);
        children = category.get('children');
        if(children.length){
          this.tree(callback, children);
        }
      }, this);

    }

  });















});
