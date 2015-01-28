 var Cooldown = 
 {
    "timer" : 0
};
/**
 * Door Entity
 */
game.doorEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        settings.image="door";
        this.id=settings.id;
        this._super(me.Entity, 'init', [x, y , settings]);

        this.renderable.addAnimation("closed",  [0]);
        this.renderable.addAnimation("opened",  [3]);
        this.renderable.addAnimation("open",  [0,1,2,3]);
        this.renderable.addAnimation("close",  [3,2,1,0]);
        this.renderable.setCurrentAnimation("closed");
        this.z=4;
        this.body.removeShape(this.body.getShape());
        this.body.addShape( new me.Rect( this.body.pos.x, this.body.pos.y, 80, 10 ) );
        
        this.anchorPoint.set(0.5, 0);
    },

    /**
     * update the entity
     */
    update : function (dt) {

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);

       // this.renderable.setCurrentAnimation("close");
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // Make all other objects solid

        this.body.setCollisionMask(me.collision.types.ENEMY_OBJECT);
        return false;
    }
});


/**
 * Player Entity
 */
game.PlayerEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        settings.image="player";
        game.data.mainPlayer=this;
        this._super(me.Entity, 'init', [x, y , settings]);
        this.renderable.addAnimation("down",  [0,1,2]);
        this.renderable.addAnimation("left",  [3,4,5]);
        this.renderable.addAnimation("right",  [6,7,8]);
        this.renderable.addAnimation("up",  [9,10,11]);
        this.renderable.addAnimation("hidden", [12]);
        me.game.viewport.follow(this.pos, me.game.viewport.AXIS.BOTH);
        this.body.collisionType = me.collision.types.PLAYER_OBJECT;
        this.body.setVelocity(3, 3);
        self=this;
        self.canShoot=true;
    },

    /**
     * update the entity
     */
    update : function (dt) {
        if (me.input.isKeyPressed('shoot')&&self.canShoot==true)
        {

            var arrow=me.pool.pull("arrow");

            me.game.world.addChild(arrow,20);
            self.canShoot=false;

            Cooldown.timer = 500;
            cd = new me.Tween(Cooldown)

                .to({"timer" : 0}, Cooldown.timer)

                .onUpdate(function onUpdate(value) 
                {

                })

                .onComplete(function onComplete() 
                {   
                    self.canShoot=true;
                })
                .start();
        }


        if (me.input.isKeyPressed('left'))
        {
            this.body.vel.y=0;
            this.body.vel.x -= this.body.accel.x * me.timer.tick;
            
            if (!this.renderable.isCurrentAnimation("left")) {
                this.renderable.setCurrentAnimation("left");
            }
        }
        else if (me.input.isKeyPressed('right'))
        {
            this.body.vel.y=0;
            this.body.vel.x += this.body.accel.x * me.timer.tick;

            if (!this.renderable.isCurrentAnimation("right")) {
                this.renderable.setCurrentAnimation("right");
            }
        }
        else if (me.input.isKeyPressed('up'))
        {
            this.body.vel.x=0;
            this.body.vel.y -= this.body.accel.y * me.timer.tick;

            if (!this.renderable.isCurrentAnimation("up")) {
                this.renderable.setCurrentAnimation("up");
            }
        }
        else if (me.input.isKeyPressed('down'))
        {
            this.body.vel.x=0;
            this.body.vel.y += this.body.accel.y * me.timer.tick;

            if (!this.renderable.isCurrentAnimation("down")) {
                this.renderable.setCurrentAnimation("down");
            }
        }
        else
        {
            this.body.vel.x = 0;
            this.body.vel.y = 0;
            return false;
        }



        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated
        
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        switch (response.b.body.collisionType) {
            case me.collision.types.WORLD_SHAPE:

                break;

            case me.collision.types.ENEMY_OBJECT:
                if(response.b.renderable.isCurrentAnimation("closed"))
                {
                        game.data.currentDoor=response.b.id;
                        response.b.renderable.setCurrentAnimation('open',function complete(response){
                             var nextRoom=game.data.doors[game.data.currentRoom][game.data.currentDoor];
                       
                            this.setCurrentAnimation('opened');
                           // game.data.trynum=game.data.trynum+1;
/*                            if(game.data.trynum==7)
                            {
                                 me.levelDirector.loadLevel("room6");
                            }
                            else
                            {*/
                            game.data.currentRoom=nextRoom;
                            if( game.data.currentRoom==6)
                            {
                                me.input.bindKey(me.input.KEY.X, "shoot");
                            }
                                me.levelDirector.loadLevel("room"+nextRoom);
                           //}

                        });
                }
    
                return false;
                break;

            default:
                // Do not respond to other objects (e.g. coins)
                return false;
        }

        // Make the object solid
        return true;
    }
});




/**
 * Treasure Entity
 */
game.treasureEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        settings.image="treasure";
        this._super(me.Entity, 'init', [x, y , settings]);
        this.collidable=true;
    },

    /**
     * update the entity
     */
    update : function (dt) {

        // return true if we moved or if the renderable was updated
        return false;

       // this.renderable.setCurrentAnimation("close");
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        // Make all other objects solid
        if(this.collidable==true)
        {
           var hole = me.game.world.getChildByName("holeEntity")[0];
           hole.startAnim();
        }
       // this.body.setCollisionMask(me.collision.types.ENEMY_OBJECT);
        this.collidable=false;
       // this.renderable.addAnimation("open",  [0,1,2,3]);
        return false;
    }
});




/**
 * Door Entity
 */
game.holeEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        // call the constructor
        settings.image="teleport";
        this.z=80;
        this._super(me.Entity, 'init', [x, y , settings]);

        this.renderable.addAnimation("open",  [0,1,2,3,4,5,6,7,8,9]);
        this.renderable.addAnimation("empty",  [11]);
        this.renderable.setCurrentAnimation("empty");
        this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT);
    },
    startAnim:function()
    {
        this.renderable.setCurrentAnimation('open',function complete(){
            me.levelDirector.loadLevel("room0");
        });
        me.game.world.removeChild(me.game.world.getChildByName("mainPlayer")[0]);
    },
    /**
     * update the entity
     */
    update : function (dt) {

        // return true if we moved or if the renderable was updated
        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);

       // this.renderable.setCurrentAnimation("close");
    },

   /**
     * colision handler
     * (called when colliding with other objects)
     */
    onCollision : function (response, other) {
        return false;
    }
});






/**
 * Fire Entity
 */
game.fireEntity = me.Entity.extend({

    /**
     * constructor
     */
    init:function (x, y, settings) {
        settings.image="fire";

        this._super(me.Entity, 'init', [x, y , settings]);

        this.renderable.addAnimation("fire",  [0,1,2,4,5,6]);
        this.renderable.addAnimation("idle",  [3]);
        this.renderable.setCurrentAnimation("idle");
        this.z=5;
        this.body.setCollisionMask(me.collision.types.PLAYER_OBJECT);
        var self=this;
        game.data.isHit=false;
        this.hurting=false;
        var fire=function()
        {
            if(self.renderable)
            {
                self.renderable.setCurrentAnimation("fire","idle");
            }
        };
        this.interval = me.timer.setInterval(fire, 3000);

    },

    update : function (dt) {


        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);


    },

    onCollision : function (response, other) {

        if(this.renderable.isCurrentAnimation("fire"))
        {
            response.b.renderable.flicker(500,function(){
                if(game.data.isHit==true)
                {
                    game.data.playerHealth=game.data.playerHealth-1;
                    game.data.isHit=false;

                    if(game.data.playerHealth==0)
                    {
                        me.state.set(me.state.OVER, new game.OverScreen());
                        me.state.change(me.state.OVER);
                    }
                }
            });
            me.game.viewport.shake(10, 500, me.game.viewport.AXIS.BOTH);
            game.data.isHit=true;
        }
        return false;
    }


});







game.Arrow = me.Entity.extend({


    init:function () {

        var settings=[];
        settings.width=6;
        settings.height=34;
        settings.image=me.loader.getImage('arrow');
        this._super(me.Entity, 'init', [me.game.world.getChildByName("mainPlayer")[0].pos.x+20, me.game.world.getChildByName("mainPlayer")[0].pos.y+20, settings]);
        this.body.addShape(new me.Rect(0, 0, this.width, this.height));
        this.body.setVelocity(15, 15);
        this.body.vel.y=-15;
        this.body.collisionType = me.collision.types.PROJECTILE_OBJECT;

    },

    update : function (dt) {
        this.body.vel.y=-15*me.timer.tick;
        if(this.pos.y<0)
        {
            me.game.world.removeChild(this);
        }
        // apply physics to the body (this moves the entity)
        this.body.update(dt);

        // handle collisions against other shapes
        me.collision.check(this);

        // return true if we moved or if the renderable was updated

        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);
    },

        onCollision : function (response, other) {
        switch (response.b.body.collisionType) {


            case me.collision.types.ENEMY_OBJECT:
                    me.game.world.removeChild(this);
                    response.b.health=response.b.health-1;
                    if(response.b.health==0)
                    {
                        me.state.set(me.state.WIN, new game.WinScreen());
                        me.state.change(me.state.WIN);
                    }
                return false;
                break;

            default:
                return false;
        }
        return true;
    }

});


/**
 * Final Boss Entity
 */
game.finalBossEntity = me.Entity.extend({

    init:function (x, y, settings) {
        settings.image="finalboss";
        this.isArrow="arrow";
        this.health=25;
        this._super(me.Entity, 'init', [x, y , settings]);

        this.renderable.addAnimation("move",  [0,1,2]);
        this.renderable.setCurrentAnimation("move",500);
        this.z=5;
        this.alwaysUpdate=true;
        this.renderable.alwaysUpdate=true;
        this.body.setCollisionMask(me.collision.types.PROJECTILE_OBJECT);
    },
    update : function (dt) {


        return (this._super(me.Entity, 'update', [dt]) || this.body.vel.x !== 0 || this.body.vel.y !== 0);


    },
});