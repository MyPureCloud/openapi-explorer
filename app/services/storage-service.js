import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented,{
    apiService: Ember.inject.service(),
    localStorageSet(key, value){
        try{
            if (typeof window.localStorage !== 'undefined') {
                window.localStorage[this.get("apiService").api.host + "-" + key] = value;
            }
        }catch(ex){

        }
    },
    localStorageGet(key){
        try{
            if (typeof window.localStorage !== 'undefined') {
                return window.localStorage[this.get("apiService").api.host + "-" +key];
            }
        }catch(ex){

        }

        return null;
    }
});
