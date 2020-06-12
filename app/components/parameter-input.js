import Ember from 'ember';

export default Ember.Component.extend({
    parameter: {},

    didReceiveAttrs() {
        this._super(...arguments);

        try{
            let parameter = this.get("parameter");
            if(parameter.value == null){
                this.set("parameter.value", parameter.default);
            }
        }catch(ex){
            console.error(ex);
        }

    },

    inputType: Ember.computed('parameter', function() {
        let parameter = this.get("parameter");

        if(["int32","int64","float","double"].indexOf(parameter.format) > -1 ){
            return "number";
        }else if (parameter.type === "boolean"){
            return "select";
        }else if (parameter.type === "date"){
            return "date";
        }else if (parameter.type === "date-time"){
            return "datetime";
        }else if (parameter.type === "password"){
            return "password";
        }else{
            return "";
        }

    }),

    actions: {
        selectBooleanParameter(value) {
            this.set("parameter.value", value);
        }
    },
});
