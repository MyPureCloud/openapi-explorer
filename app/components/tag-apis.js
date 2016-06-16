import Ember from 'ember';
var  computed = Ember.computed;

export default Ember.Component.extend({
    apiService: Ember.inject.service('apiService'),
    name:null,
    safeName: computed('name', function(){
        return this.get('name').replace(/ /g,"");
    }),
    description: null,
    filter: null,
    documentation: null,
    groupMethods(tagName, filteredMethods){
        var groupMethods = {
            methods: [],
            folders: []
        };

        let folders = {};

        for(let x=0; x< filteredMethods.length; x++){
            let method = filteredMethods[x];

            let path = method.uri;

            //this part is pretty specific to our API, might not work for all
            // our path starts with /api/v1/<tag> which we remove
            // we also remove any url params.
            // There is a good chance this is a noop for most use cases
            path = path.replace(/\/api\/v\d\/?/, '');
            path = path.replace(tagName + '/', '');
            path = path.replace(/\/\{\w+\}/g, '');

            let paths = path.split('/');

            if(paths.length === 1){
                groupMethods.methods.push(method);
            }else{
                let folder = paths[1];
                if(folders[folder] == null){
                    folders[folder] = [];
                }

                folders[folder].push(method);
            }

        }

        for(var key in folders){
            groupMethods.folders.push({
                key: key,
                value: folders[key]
            });
        }

        console.log(groupMethods);
        return groupMethods;
    },
    methods: computed('filter', function() {
         let tagName = this.get('name');
        let apis = this.get('apiService').filteredMethodsByTag(tagName, this.get("filter"));
        apis = this.groupMethods(tagName, apis);
        return apis;
    }),

    hasMethods: computed('filter', function() {
         let tagName = this.get('name');
        let apis = this.get('apiService').filteredMethodsByTag(tagName, this.get("filter"));
        return apis.length >0;
    }),

    didReceiveAttrs() {
      this._super(...arguments);

      let tagName = this.get('name');
      let apis = this.get('apiService').filteredMethodsByTag(tagName, this.get("filter"));
  
      this.set('hasMethods', apis.length > 0);
    // this.set('methods', apis);
      this.get("name");

  }
});
