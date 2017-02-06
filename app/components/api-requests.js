import Ember from 'ember';

export default Ember.Component.extend({
    requestService: Ember.inject.service(),
    shareService: Ember.inject.service(),
    storageService: Ember.inject.service(),
    requests:[],
    selectedTabIndex: 0,
    affected: [],
    sizes: [],
    loadRequest(self){
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
            let request = self.get("requestService").get("lastNewRequest");
            let foundExisting = false;
            self.requests.forEach((item, index)=>{
                if(item.operation.operationId === request.operationId){
                    self.set('selectedTabIndex', index);
                    foundExisting = true;
                }
            });

            if(!foundExisting){
                self.loadRequest(self);
            }

        });

        this.get("requestService").on('forceNewRequest', function(){
            self.loadRequest(self);
        });

        if(this.get("requestService").get("lastNewRequest") != null){
            this.loadRequest(this);
        }

        this.get("shareService");

    },
    actions:{
        saveRequests(){
            console.log("saving requests");
            this.get("storageService").localStorageSet('apiexplorer.requests', JSON.stringify(this.get('requests')));

        },
        closeTab(index){
            this.requests.removeAt(index);

            this.get("storageService").localStorageSet('apiexplorer.requests', JSON.stringify(this.get('requests')));
            this.set('selectedTabIndex', this.requests.length-1);
        },
        selectTab(index){
            this.set('selectedTabIndex', index);
        },
        closeAllTabs(){
            this.requests.clear();

            this.get("storageService").localStorageSet('apiexplorer.requests', JSON.stringify(this.get('requests')));
            this.set('selectedTabIndex', 0);
        }
    },
    mouseEnter() {
        let tabBar = document.querySelector('.nav.nav-tabs');
        let tabs = tabBar.querySelectorAll('[id*="requestTab"]');
        for (let len = tabs.length, i = 0; i < len; ++i) {
            let tab = tabs[i];
            if (this.affected.indexOf(tab) === -1) {
                this.affected.push(tab);
                this.sizes.push(tab.style.maxWidth);
                tab.style.maxWidth = tab.offsetWidth + 'px';
            }
        }
    },
    mouseLeave() {
        while (this.affected.length) {
            this.affected.pop().style.maxWidth = this.sizes.pop();
        }
    }
});
