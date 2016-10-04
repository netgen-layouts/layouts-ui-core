'use strict';

var Core = require('./core_base');
require('./extended/model');
require('./extended/view');
require('./extended/collection');
require('./views/modal');
require('./views/form_modal');
require('./templates_loader');


// window.Core = Core;
// console.log(window.Core);
module.exports = Core;
