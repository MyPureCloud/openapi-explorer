import Ember from "ember";
import config from "../config/environment";

export default Ember.Service.extend(Ember.Evented, {
  authHeader: null,
  currentAccount: null,
  parseHash(hash) {
    let that = this;
    if (config.authHeader != null && config.authHeader !== "") {
      return "bearer " + config.authHeader;
    }

    let tokenType = null;
    let token = null;

    if (hash) {
      //Parse out the hash values of the URL to get the token
      var hash_array = hash.substring(1).split("&");

      var hash_key_val = new Array(hash_array.length);
      for (var i = 0; i < hash_array.length; i++) {
        hash_key_val[i] = hash_array[i].split("=");
      }

      hash_key_val.forEach(function (pair) {
        if (pair[0] === "access_token") {
          token = pair[1];
        }

        if (pair[0] === "token_type") {
          // Store token
          tokenType = pair[1];
        }

        if (pair[0] === "account") {
          that.set("currentAccount", JSON.parse(decodeURIComponent(pair[1]))); //Grab account info from URI
        }
      });

      if (tokenType != null && token != null) {
        return tokenType + " " + token;
      }
    }
  },

  init() {
    this.set("authHeader", this.parseHash(window.location.hash));
  },
});
