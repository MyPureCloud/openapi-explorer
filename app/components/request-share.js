import Ember from 'ember';

export default Ember.Component.extend({
    shareService: Ember.inject.service(),
    operation: null,
    requestBody: null,
    shareLink:null,
    actions:{
        share(){
            let link = this.get("shareService").getSharableLink(this.get("operation"), this.get("requestBody"));

            this.set("shareLink", link);
        }
    },
    init(){
        this._super(...arguments);
        this.get("shareService");
    }
});
