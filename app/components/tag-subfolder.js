import Ember from 'ember';

export default Ember.Component.extend({
    folders:null,
    isOpen: false,
    actions:{
        toggleOpen(){
            this.toggleProperty('isOpen');
        }
    }
});
