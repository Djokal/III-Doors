game.PlayScreen = me.ScreenObject.extend({
    /**
     *  action to perform on state change
     */
    onResetEvent: function() {
        // reset the score
        game.data.score = 0;
    // load a level
    me.levelDirector.loadLevel("intro");
  //  me.Viewport.follow(game.PlayerEntity.pos, me.game.Viewport.AXIS.VERTICAL);
        // add our HUD to the game world
        this.HUD = new game.HUD.Container();
        me.game.world.addChild(this.HUD);
        game.data.doors=[
            game.shuffle([2,5,1]),
            game.shuffle([2,3,5]),
            game.shuffle([4,1,0]),
            game.shuffle([0,4,6]),
            game.shuffle([5,0,1]),
            game.shuffle([3,4,2]),
        ];
        game.data.finalroom=3;
        game.data.prefinalroom=[5,1];

        game.data.score = 0;
        game.data.currentRoom=0;
        game.data.currentDoor=undefined;
        game.data.trynum= 0;
        game.data.playerHealth=3;
        game.data.isHit=false;
    },

    /**
     *  action to perform when leaving this screen (state change)
     */
    onDestroyEvent: function() {
        // remove the HUD from the game world
        me.game.world.removeChild(this.HUD);
    }
});
