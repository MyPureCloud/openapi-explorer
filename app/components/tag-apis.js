import Ember from 'ember';

export default Ember.Component.extend({
    apiService: Ember.inject.service('apiService'),
    name:null,
    description: null,
    methods: null,

    didReceiveAttrs() {
      this._super(...arguments);

      let tagName = this.get('name');
      let apis = this.get('apiService').get('methodsByTag')[tagName];

      this.set('methods', apis);

    },



});
