import Ember from 'ember';

export default Ember.Component.extend({
    requestService: Ember.inject.service(),
    doubleClick() {
        let method = this.get("method");
        let requestService = this.get('requestService');
        requestService.forceNewRequest(method);
        return true;
    },
    actions:{
        selectMethod(){
            let method = this.get("method");
            let requestService = this.get('requestService');
            requestService.newRequest(method);
        }
    }
});
