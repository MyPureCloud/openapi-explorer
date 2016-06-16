import Ember from 'ember';

export default Ember.Component.extend({
    requestService: Ember.inject.service(),
    shareService: Ember.inject.service(),
    storageService: Ember.inject.service(),
    requests:[],
    selectedTabIndex: 0,


    init(){

        let that = this;
        this.get('requests');

        let savedRequests = this.get("storageService").localStorageGet('apiexplorer.requests');
        try{
            if(savedRequests){
                this.set('requests', JSON.parse(savedRequests));
            }

        }catch(err){}

        this._super(...arguments);
        this.get("requestService").on('newRequest', function(){
            let request = that.get("requestService").get("lastNewRequest");

            let requestParams = {
                operation : request,
                tabClass: " "
            };

            that.requests.pushObject(requestParams);
            this.get("storageService").localStorageSet('apiexplorer.requests', JSON.stringify(that.get('requests')));

            that.set('selectedTabIndex', that.requests.length-1);
        });

        this.get("shareService");

    },
    actions:{
        closeTab(index){
            this.requests.removeAt(index);

            this.get("storageService").localStorageSet('apiexplorer.requests', JSON.stringify(that.get('requests')));
            this.set('selectedTabIndex', this.requests.length-1);
        }
    }
});
