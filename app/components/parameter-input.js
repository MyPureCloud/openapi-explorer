import Ember from 'ember';

export default Ember.Component.extend({
    parameter: {},

    didReceiveAttrs() {
        this._super(...arguments);
        let parameter = this.get("parameter");
        if(parameter.value == null){
            parameter.value = parameter.default;
        }
    },

    inputType: Ember.computed('parameter', function() {
        let parameter = this.get("parameter");

        console.log(parameter);

        if(["int32","int64","float","double"].indexOf(parameter.format) > -1 ){
            return "number";
        }else if (parameter.type === "boolean"){
            return "checkbox";
        }else if (parameter.type === "date"){
            return "date";
        }else if (parameter.type === "date-time"){
            return "datetime";
        }else if (parameter.type === "password"){
            return "password";
        }else{
            return "";
        }

    })
});
