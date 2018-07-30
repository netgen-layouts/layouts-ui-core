module.exports = function(Handlebars) {

this["JST"] = this["JST"] || {};

this["JST"]["form_modal"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda;

  return "<div class=\"modal-dialog\">\n  <div class=\"modal-content\">\n    <div class=\"in\">\n      <div class=\"modal-header\">\n        <h4 class=\"modal-title\">"
    + container.escapeExpression(alias1((depth0 != null ? Handlebars.r(depth0,'title') : depth0), depth0))
    + "</h4>\n      </div>\n\n      <div class=\"modal-body\">\n        "
    + ((stack1 = alias1(((stack1 = (depth0 != null ? Handlebars.r(depth0,'model') : depth0)) != null ? Handlebars.r(stack1,'form') : stack1), depth0)) != null ? stack1 : "")
    + "\n      </div>\n\n      <div class=\"modal-footer\">\n        <button type=\"button\" class=\"btn btn-default\" data-dismiss=\"modal\">Cancel</button>\n        <button type=\"button\" class=\"btn btn-primary action_apply green\">OK</button>\n      </div>\n  </div>\n</div>\n";
},"useData":true});

this["JST"]["modal_form"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1;

  return ((stack1 = container.lambda((depth0 != null ? Handlebars.r(depth0,'body') : depth0), depth0)) != null ? stack1 : "")
    + "\n";
},"useData":true});

this["JST"]["modal"] = Handlebars.template({"1":function(container,depth0,helpers,partials,data) {
    return "          <button type=\"button\" class=\"btn btn-link action_cancel\" data-dismiss=\"modal\">"
    + container.escapeExpression(container.lambda((depth0 != null ? Handlebars.r(depth0,'cancel_text') : depth0), depth0))
    + "</button>\n";
},"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    var stack1, alias1=container.lambda, alias2=container.escapeExpression;

  return "<div class=\"modal-dialog\">\n  <div class=\"modal-content\">\n    <div class=\"in\">\n      <div class=\"modal-header\">\n        <h1 class=\"modal-title\">"
    + alias2(alias1((depth0 != null ? Handlebars.r(depth0,'title') : depth0), depth0))
    + "</h1>\n      </div>\n\n      <div class=\"modal-body\">\n        "
    + ((stack1 = alias1((depth0 != null ? Handlebars.r(depth0,'body') : depth0), depth0)) != null ? stack1 : "")
    + "\n      </div>\n\n      <div class=\"modal-footer\">\n"
    + ((stack1 = Handlebars.r(helpers,'unless').call(depth0 != null ? depth0 : (container.nullContext || {}),(depth0 != null ? Handlebars.r(depth0,'cancel_disabled') : depth0),{"name":"unless","hash":{},"fn":container.program(1, data, 0),"inverse":container.noop,"data":data})) != null ? stack1 : "")
    + "\n        <button type=\"button\" class=\"btn btn-primary action_apply green\">"
    + alias2(alias1((depth0 != null ? Handlebars.r(depth0,'apply_text') : depth0), depth0))
    + "</button>\n      </div>\n  </div>\n</div>\n";
},"useData":true});

this["JST"]["snackbar"] = Handlebars.template({"compiler":[7,">= 4.0.0"],"main":function(container,depth0,helpers,partials,data) {
    return "<div class=\"snackbar-box\">\n  <p class=\"snackbar-message\">"
    + container.escapeExpression(container.lambda((depth0 != null ? Handlebars.r(depth0,'message') : depth0), depth0))
    + "</p>\n</div>\n";
},"useData":true});

return this["JST"];

};