module.exports = {
  interpolate: function (s,d){
    console.log(s, d);
   for(var p in d){
    if(d[p]){
      s=s.replace(new RegExp(':'+p,'g'), d[p]);
    }
   }
   return s;
  },

  clean_route: function(route) {
    return route.replace(/\(|\)/g, '').replace(/\/\:\w+/g, '').replace(/\/(?:null|undefined)/g, ''); // TODO: test this line
  }
}
