import Ember from 'ember';

export default Ember.Component.extend({
    didInsertElement: function() {
        if(window && window.ace && window.ace.edit){
            let currentValue = this.get('value');

            if(typeof currentValue === "undefined" || currentValue === null){
                this.set('value', "{}");
                currentValue ="{}";
            }



            this.editor = window.ace.edit(this.get('element'));
            this.get('aceInit')(this.editor);

            if(typeof currentValue !== "object"){
                this.editor.getSession().setValue(currentValue);
            }

            this.editor.getSession().setFoldStyle("markbegin"); // markbegin is the default

            //this.editor.setTheme("ace/theme/twilight");
            this.editor.getSession().setMode("ace/mode/json");

            this.editor.on('change', function(){
                this.set('value', this.editor.getSession().getValue());
            }.bind(this));
        }

    },
    didReceiveAttrs() {
        this._super(...arguments);

    }
});
