import Ember from 'ember';

export default Ember.Component.extend({
    requestService: Ember.inject.service(),
    shareService: Ember.inject.service(),
    storageService: Ember.inject.service(),
    requests:[],
    selectedTabIndex: 0,

    loadRequest(self){
        console.log("selectedTab " + self.get('selectedTabIndex'));
        let request = self.get("requestService").get("lastNewRequest");

        let requestParams = {
            operation : request,
            tabClass: " "
        };

        self.requests.pushObject(requestParams);
        self.get("storageService").localStorageSet('apiexplorer.requests', JSON.stringify(self.get('requests')));

        self.set('selectedTabIndex', self.requests.length-1);
            console.log("new selectedTab " + self.get('selectedTabIndex'));
    },

    init(){

        let self = this;
        this.get('requests');

        let savedRequests = this.get("storageService").localStorageGet('apiexplorer.requests');
        try{
            if(savedRequests){
                this.set('requests', JSON.parse(savedRequests));
            }

        }catch(err){}

        this._super(...arguments);
        this.get("requestService").on('newRequest', function(){
            self.loadRequest(self);
        });

        if(this.get("requestService").get("lastNewRequest") != null){
            this.loadRequest(this);
        }

        this.get("shareService");

    },
    actions:{
        closeTab(index){
            this.requests.removeAt(index);

            this.get("storageService").localStorageSet('apiexplorer.requests', JSON.stringify(this.get('requests')));
            this.set('selectedTabIndex', this.requests.length-1);
        },
        selectTab(index){
            this.set('selectedTabIndex', index);
        }
    }
});
