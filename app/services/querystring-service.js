import Ember from 'ember';

export default Ember.Service.extend(Ember.Evented,{
    getParameter(queryString, paramName){
        //Parse out the hash values of the URL to get the token
        var hash_array = queryString.substring(1).split('&');

        for (var i = 0; i < hash_array.length; i++) {
            var split = hash_array[i].split('=');
            if(split[0]=== paramName){
                return hash_array[i].replace(`${paramName}=`,'');
            }
        }

        return null;
    }
});
