/**
 * a HUD container and child items
 */

game.HUD = game.HUD || {};


game.HUD.Container = me.Container.extend({

    init: function() {
        // call the constructor
        this._super(me.Container, 'init');

        // persistent across level change
        this.isPersistent = true;

        // make sure we use screen coordinates
        this.floating = true;

        // make sure our object is always draw first
        this.z = Infinity;

        // give a name
        this.name = "HUD";

        this.addChild(new game.HUD.ScoreItem(5, 5));
    }
});


    game.HUD.playerHealth = me.AnimationSheet.extend({
        init: function() {
            this._super(me.AnimationSheet, "init", [10,10, {
                image: me.loader.getImage('health'),
                spritewidth: 80,
                spriteheight: 20
            }]);
            this.addAnimation('3', [0]);
            this.addAnimation('2', [1]);
            this.addAnimation('1', [2]);
            this.addAnimation('0', [2]);
            this.setCurrentAnimation('3');
            this.z = 1;
        }
    });

/**
 * a basic HUD item to display score
 */
game.HUD.ScoreItem = me.Renderable.extend({
    /**
     * constructor
     */
    init: function(x, y) {

        // call the parent constructor
        // (size does not matter here)
        this._super(me.Renderable, 'init', [x, y, 10, 10]);

        // local copy of the global score
        this.score = -1;
    },

    /**
     * update function
     */
    update : function () {
        // we don't do anything fancy here, so just
        // return true if the score has been updated
        if (this.score !== game.data.score) {
            this.score = game.data.score;
            return true;
        }
        return false;
    },

    /**
     * draw the score
     */
    draw : function (context) {
        // draw it baby !
    }

});


