import Ember from 'ember';
var  computed = Ember.computed;

export default Ember.Component.extend({
    apiService: Ember.inject.service('apiService'),
    name:null,
    safeName: computed('name', function(){
        return this.get('name').replace(/ /g,"");
    }),
    description: null,
    filter: null,

    methods: computed('filter', function() {
         let tagName = this.get('name');
        let apis = this.get('apiService').filteredMethodsByTag(tagName, this.get("filter"));
        return apis;
    }),

    hasMethods: computed('filter', function() {
         let tagName = this.get('name');
        let apis = this.get('apiService').filteredMethodsByTag(tagName, this.get("filter"));
        return apis.length >0;
    }),

    didReceiveAttrs() {
      this._super(...arguments);

      let tagName = this.get('name');
      let apis = this.get('apiService').filteredMethodsByTag(tagName, this.get("filter"));
      this.set('hasMethods', apis.length > 0);
    // this.set('methods', apis);
      this.get("name");

    }



});
