
/* Game namespace */
var game = {

    // an object where to store game information
    data : {
        // score
        score : 0,
        doors:[],
        currentRoom:0,
        currentDoor:undefined,
        trynum: 0,
        mainPlayer:undefined,
        playerHealth:3,
        isHit:false,
    },


    // Run on page load.
    "onload" : function () {
    // Initialize the video.
    if (!me.video.init("screen",  me.video.CANVAS, 640, 480, true, 'auto')) {
        alert("Your browser does not support HTML5 canvas.");
        return;
    }

    // add "#debug" to the URL to enable the debug Panel
    if (document.location.hash === "#debug") {
        window.onReady(function () {
            me.plugin.register.defer(this, me.debug.Panel, "debug", me.input.KEY.V);
        });
    }

    // Initialize the audio.
    me.audio.init("mp3,ogg");

    // Set a callback to run when loading is complete.
    me.loader.onload = this.loaded.bind(this);

    // Load the resources.
    me.loader.preload(game.resources);

    // Initialize melonJS and display a loading screen.
    me.state.change(me.state.LOADING);
},

    // Run on game resources loaded.
    "loaded" : function () {
        
        me.input.bindKey(me.input.KEY.Q, "left");
        me.input.bindKey(me.input.KEY.D, "right");
        me.input.bindKey(me.input.KEY.Z, "up");
        me.input.bindKey(me.input.KEY.S, "down");
        me.sys.gravity=null;
        me.state.set(me.state.MENU, new game.TitleScreen());
  // set the "Play/Ingame" Screen Object
        me.state.set(me.state.PLAY, new game.PlayScreen());
  // set a global fading transition for the screen
        me.state.transition("fade", "#000000", 300);
    // Run on game resources loaded.

        // add our player entity in the entity pool
        me.pool.register("treasureEntity", game.treasureEntity);
        me.pool.register("holeEntity", game.holeEntity);
        me.pool.register("doorEntity", game.doorEntity,true);
        me.pool.register("mainPlayer", game.PlayerEntity);
        me.pool.register("finalBossEntity", game.finalBossEntity);
        me.pool.register("arrow", game.Arrow);

        me.pool.register("fireEntity", game.fireEntity);

        // Start the game.
        me.state.change(me.state.MENU);
    },

    "shuffle" : function (array) {
          var currentIndex = array.length, temporaryValue, randomIndex ;

          // While there remain elements to shuffle...
          while (0 !== currentIndex) {

            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = array[currentIndex];
            array[currentIndex] = array[randomIndex];
            array[randomIndex] = temporaryValue;
      }

      return array;
    }
};
