'use strict';

var Core = require('core_boot');

var Modal = require('./views/modal');
new Modal({
  title: 'Modal title'
}).open();
