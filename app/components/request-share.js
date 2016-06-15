import Ember from 'ember';
var  computed = Ember.computed;

export default Ember.Component.extend({
    shareService: Ember.inject.service(),
    shareTypes : Ember.String.w('Link cURL'),
    selectedShareType: 'Link',
    sharableLink: computed('shareService.sharableLink', function() {
        return this.get('shareService').get('sharableLink');
    }),

    sharableCurl: computed('shareService.sharableCurl', function() {
        return this.get('shareService').get('sharableCurl');
    }),

     actions: {
       selectShareType(type) {
         this.set('selectedShareType', type);
       }
     }
});
