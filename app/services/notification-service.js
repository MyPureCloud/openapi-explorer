/* global $ */
import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented, {
    authService: Ember.inject.service(),
    topics: {},
    topicsLoaded: false,
    hasResponse: false,
    hideRequest: false,
    topicsUrl: '',
    getTopicForResource: function(apiUri) {
      let tps = this.get("topics");
      return tps.get(apiUri);
    },
    urlHasTopic: function(apiUri) {
      let tps = this.get("topics");
      return tps.has(apiUri);
    },
    loadNotifications: function() {
      this.set("hasResponse", false);
      this.set("hideRequest", false);

      let url = this.get('topicUrl');
      if(!url) {
        console.error('Unable to get available topics Url');
        return;
      }

      let requestParams = {
        method: 'get',
        url: url,
        timeout: 16000,
        headers:{
        }
      };

      requestParams.headers['content-type'] = 'application/json';
      requestParams.headers['Authorization'] = this.get("authService").authHeader;
      let that = this;

      function handleResponse(xhResponse){
        let responseData = xhResponse.responseJSON;
        if(!responseData.entities) {
          return;
        }
        let urlMap = new Map();
        for(let i in responseData.entities) {
          try {
            let topic = responseData.entities[i];
            if(!topic.publicApiTemplateUriPaths) {
              continue;
            }
            for(let j = 0; j < topic.publicApiTemplateUriPaths.length; j++) {
              let topicUrl = topic.publicApiTemplateUriPaths[j];
              if (!topicUrl.includes('No related public API resource')) {
                urlMap.set(topicUrl, topic.id);
              }
            }
          } catch(err) {
            console.error('Failed to load topics: ' + err);
            return;
          }
        }
        that.set("topics", urlMap);
        that.set("topicsLoaded", (urlMap.size > 0));
        console.log("loaded " + urlMap.size + " topics");
      }
      $.ajax(requestParams).then(function( data, textStatus, jqXHR  ) {
        that.set("hasResponse", true);
        that.set("hideRequest", true);
        that.set("response", handleResponse(jqXHR));
      }).catch(function(jqXHR){
        console.log(jqXHR);
        that.set("hasResponse", true);
        that.set("hideRequest", true);
        console.error("Error getting available topics: " + jqXHR.response.status + " " + jqXHR.responseText);
      });
    },
    init() {
      this._super(...arguments);
      let searchSplit = window.location.search.split('//')[1];
      let host = searchSplit.split('/')[0];
      let url = 'https://' + host + '/api/v2/notifications/availabletopics?expand=publicApiTemplateUriPaths';
      this.set("topicUrl", url);
    },
});
