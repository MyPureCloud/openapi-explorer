import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented,{
    lastNewRequest: null,
    newRequest(operation){
        this.set('lastNewRequest', operation);
        this.trigger('newRequest');
    },
    forceNewRequest(operation){
        this.set('lastNewRequest', operation);
        this.trigger('forceNewRequest');
    }
});
