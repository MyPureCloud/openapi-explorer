import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented,{
    authHeader:null,
    init(){
        let tokenType = null;
        let token = null;

        if(window.location.hash)
		{
	        //Parse out the hash values of the URL to get the token
	        var hash_array = location.hash.substring(1).split('&');
	        var hash_key_val = new Array(hash_array.length);
	        for (var i = 0; i < hash_array.length; i++) {
	            hash_key_val[i] = hash_array[i].split('=');
	        }

	        hash_key_val.forEach(function (pair) {
	            if (pair[0] === "access_token") {

	                // Store token
	                token = pair[1];

	                // Clear hash from URL
	                //location.hash = '';
	            }

                if (pair[0] === "token_type") {
	                // Store token
	                tokenType = pair[1];
	            }
	        });

            if(tokenType != null & token!= null){
                this.set("authHeader", tokenType + " " + token);
            }
        }
    }
});
