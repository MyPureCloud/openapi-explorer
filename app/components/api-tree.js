/* global $ */
import Ember from 'ember';
var  computed = Ember.computed;

export default Ember.Component.extend({
    apiService: Ember.inject.service('apiService'),

    filter:null,

    _filter:null, // bound to text input
    // debounce setting the filter binding to allow for smooth typing
    debounceFilter: Ember.observer('_filter', function () {
        Ember.run.debounce(this, this.setFilter, 150);
    }),

    setFilter() {
        this.set('filter', this.get('_filter'));
    },

    querystringService: Ember.inject.service(),
    init(){
        this._super(...arguments);

        let filter = this.get("querystringService").getParameter(window.location.search, "filter");
        if(filter){
            this.set("_filter", filter);
        }

    },
    didInsertElement(){
        this._super(...arguments);
        if(this.get('_filter')){
            $('.panel-title a').removeClass("collapsed");
            $(".panel-collapse").addClass("in");
        }

    },
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

        tags.sort((a,b)=>{
            return a.name.localeCompare(b.name);
        });

        return tags;
    }),
    hasMethods: computed('filter', function() {
        return !this.get('apiService').areAllMethodsFilteredOut(this.get("filter"));

    })
});
