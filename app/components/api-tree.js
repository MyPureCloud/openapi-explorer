import Ember from 'ember';
var  computed = Ember.computed;

export default Ember.Component.extend({
    apiService: Ember.inject.service('apiService'),
    tags: computed('apiService.api', function() {
        if (this.get('apiService').get('api').tags == null){
            return [];
        }

        let definedTags = this.get('apiService').get('api').tags;
        let actualTags = Object.keys(this.get('apiService').get('methodsByTag'));

        let tags = [];

        for(let x= 0; x< definedTags.length; x++){
            let tag = definedTags[x];
            if(actualTags.indexOf(tag.name) > -1){
                tags.push(tag);
            }
        }

        return tags;
    }),
});
