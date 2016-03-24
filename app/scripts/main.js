'use strict';

var Core = require('core_boot');

console.log(Core);

var Modal = require('./views/modal');
new Modal({
  title: 'Modal title'
}).open();
