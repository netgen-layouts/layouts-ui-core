'use strict';

function normalize_path(path) {
  return path.replace(/\/+/g, '/');
}

module.exports =  {
  bm_base_path: '/bm',
  bm_base_app_path: '/app/',
  bm_base_api_path: '/api/v1/',

  cb_base_path: '/cb',
  cb_base_api_path: '/api/v1/',

  bm_api_url: function(path) {
    return normalize_path(this.bm_base_path + this.bm_base_api_path + path);
  },

  bm_app_url: function(path) {
    return normalize_path(this.bm_base_path + this.bm_base_app_path + path);
  },

  cb_api_url: function(path) {
    return normalize_path(this.cb_base_path + this.cb_base_api_path + path);
  }
};
