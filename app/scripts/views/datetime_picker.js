'use strict';

var Core = require('../core_base');
var View = require('../extended/view');
var $ = Core.$;
var moment = require('moment');
require('eonasdan-bootstrap-datetimepicker');
require("moment/min/locales.min");

var languages = window.navigator.languages.slice();
languages.push('en-GB');

module.exports = Core.DateTimePicker = View.extend({
  extend_with: ['options'],

  events: {
    'click .js-clear-input': 'clearInput',
    'dp.change .datetime': 'dateTimeChange',
  },

  defaultOptions: {
    sideBySide: true,
    // format: 'Y-MM-DDTHH:mm',
    allowInputToggle: true,
    locale: languages,
    format: 'llll',
    icons: {
        time: 'material-icons material-icon-time',
        date: 'material-icons material-icon-calendar',
        up: 'material-icons material-icon-up',
        down: 'material-icons material-icon-down',
        previous: 'material-icons material-icon-left',
        next: 'material-icons material-icon-right',
        today: 'material-icons material-icon-today',
        clear: 'material-icons material-icon-trash',
        close: 'material-icons material-icon-close',
      },
  },

  initialize: function(options){
    View.prototype.initialize.apply(this, arguments);
    options || (options = {});

    this.$dateEl = this.$('.datetime');
    this.$dateFormated = this.$('.datetime-formated');

    this.$dateEl.datetimepicker($.extend({}, this.defaultOptions, this.options));
    this.datePicker = this.$dateEl.data('DateTimePicker');

    this.$dateFormated.val() && this.setPluginDate(this.$dateFormated.val());
    this.toggleClearBtn();

    return this;
  },

  setPluginDate: function(date){
    var dateValues = date.split(/-|T|:/);
    this.datePicker.date(new Date(date));
  },

  clearInput: function(e) {
    e.preventDefault();
    this.datePicker.clear();
  },

  dateTimeChange: function(){
    const newFormatedDate = this.datePicker.date() ? moment(this.datePicker.date()).format('Y-MM-DDTHH:mm') : '';
    this.$dateFormated.val(newFormatedDate);
    this.toggleClearBtn();
  },

  toggleClearBtn: function(){
    this.datePicker.date() ? this.$el.addClass('date-entered') : this.$el.removeClass('date-entered');
  },

});
