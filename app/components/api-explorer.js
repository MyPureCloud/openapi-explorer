import Ember from 'ember';
var  computed = Ember.computed;

export default Ember.Component.extend({
    apiService: Ember.inject.service('apiService'),
    isSchemaLoaded: computed('apiService.api', function() {
        let loaded = this.get('apiService').get('api').paths != null;
        return loaded;
    }),
});
