game.OverScreen = me.ScreenObject.extend({
 
  /**   
   *  action to perform on state change
   */
  onResetEvent : function() {
     
    me.game.world.addChild(
        new me.Sprite (0,0,me.loader.getImage('over')),1);

    // change to play state on press Enter or click/tap
    me.input.bindKey(me.input.KEY.ENTER, "enter", true);
    me.input.bindPointer(me.input.mouse.LEFT, me.input.KEY.ENTER);
    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
      if (action === "enter") {
        me.input.unbindKey(me.input.KEY.X, "shoot");
        me.state.change(me.state.MENU);
      }
    });
  },
 
  /**   
   *  action to perform when leaving this screen (state change)
   */
  onDestroyEvent : function() {
    me.input.unbindKey(me.input.KEY.ENTER);
    me.input.unbindPointer(me.input.mouse.LEFT);
    me.event.unsubscribe(this.handler);
   }
});