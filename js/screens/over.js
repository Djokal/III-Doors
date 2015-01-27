game.OverScreen = me.ScreenObject.extend({
 
  /**   
   *  action to perform on state change
   */
  onResetEvent : function() {
     
    // title screen
    me.game.world.addChild(
        new me.Sprite (0,0,me.loader.getImage('over')),1);
    // add a new renderable component with the scrolling text
     
    // change to play state on press Enter or click/tap
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