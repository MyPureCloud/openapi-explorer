import Ember from 'ember';
var  computed = Ember.computed;

export default Ember.Component.extend({
    apiService: Ember.inject.service('apiService'),
    info: computed('apiService.api', function() {
        return this.get('apiService').get('api').info;
    }),
    externalDocs: computed('apiService.api', function() {
        return this.get('apiService').get('api').externalDocs;
    }),
    showApiDetails: false,
    actions: {
        toggle: function() {
            this.toggleProperty('showApiDetails');
        }
    }
});
