game.TitleScreen = me.ScreenObject.extend({
 
  /**   
   *  action to perform on state change
   */
  onResetEvent : function() {
     
    // title screen
    me.game.world.addChild(
        new me.Sprite (0,0,me.loader.getImage('title_screen')),1);
    // add a new renderable component with the scrolling text
     
    // change to play state on press Enter or click/tap
    me.input.bindKey(me.input.KEY.ENTER, "enter", true);
    me.input.bindPointer(me.input.mouse.LEFT, me.input.KEY.ENTER);
    this.handler = me.event.subscribe(me.event.KEYDOWN, function (action, keyCode, edge) {
      if (action === "enter") {
        
        me.state.change(me.state.PLAY);
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