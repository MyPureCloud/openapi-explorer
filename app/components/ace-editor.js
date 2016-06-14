import Ember from 'ember';

export default Ember.Component.extend({
    didInsertElement: function() {
      this.editor = window.ace.edit(this.get('element'));
      this.get('aceInit')(this.editor);
      this.editor.getSession().setValue(this.get('value'));

      this.editor.getSession().setFoldStyle("markbegin"); // markbegin is the default

      //this.editor.setTheme("ace/theme/twilight");
      this.editor.getSession().setMode("ace/mode/json");

      this.editor.on('change', function(){
        this.set('value', this.editor.getSession().getValue());
      }.bind(this));
    },
    didReceiveAttrs() {
      this._super(...arguments);

    }
});
