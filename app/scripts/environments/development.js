'use strict';


function normalize_path(path) {
  return path.replace(/\/+/g, '/');
}

module.exports =  {
  name: 'development',

  bm_base_path: '/bm',
  cb_base_path: '/cb',

  bm_api_url: function(path) {
    return normalize_path(this.bm_base_path + '/api/v1/' + path);
  },

  bm_app_url: function(path) {
    return normalize_path(this.bm_base_path + '/app/'+path);
  },

  cb_api_url: function(path) {
    return normalize_path(this.cb_base_path + '/api/v1/'+path);
  }

};
