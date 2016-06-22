import Ember from 'ember';

export default Ember.Component.extend({
    requestService: Ember.inject.service(),
    shareService: Ember.inject.service(),
    storageService: Ember.inject.service(),
    requests:[],
    selectedTabIndex: 0,

    loadRequest(){
        let request = this.get("requestService").get("lastNewRequest");

        let requestParams = {
            operation : request,
            tabClass: " "
        };

        this.requests.pushObject(requestParams);
        this.get("storageService").localStorageSet('apiexplorer.requests', JSON.stringify(this.get('requests')));

        this.set('selectedTabIndex', this.requests.length-1);
    },

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
            that.loadRequest().bind(that);
        });

        if(this.get("requestService").get("lastNewRequest") != null){
            this.loadRequest();
        }

        this.get("shareService");

    },
    actions:{
        closeTab(index){
            this.requests.removeAt(index);

            this.get("storageService").localStorageSet('apiexplorer.requests', JSON.stringify(this.get('requests')));
            this.set('selectedTabIndex', this.requests.length-1);
        }
    }
});
