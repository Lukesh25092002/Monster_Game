window.addEventListener("load",function(){
    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 1280;
    canvas.height = 720;

    ctx.fillStyle = 'white';
    ctx.lineWidth = 3;
    ctx.strokeStyle = 'white';

    class Player{
        constructor(game){
            this.game = game;
            this.collisionX = this.game.width*0.5;
            this.collisionY = this.game.height*0.5;
            this.collisionRadius = 50;
            this.totalSpeed = 10;

            this.marginTop = 260;
        }

        draw(context){
            context.fillStyle = 'white';
            context.beginPath();
            context.arc(this.collisionX,this.collisionY,this.collisionRadius,0,Math.PI*2);
            context.closePath();
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();

            context.beginPath();
            context.moveTo(this.collisionX,this.collisionY);
            context.lineTo(this.game.mouse.x,this.game.mouse.y);
            context.closePath();
            context.stroke();
        }

        update(){
            const dx = this.game.mouse.x - this.collisionX;
            const dy = this.game.mouse.y - this.collisionY;
            const hypotenuse = Math.hypot(dy,dx);
            
            if(hypotenuse>=this.totalSpeed){
                const speedX = dx/hypotenuse*this.totalSpeed || 0;
                const speedY = dy/hypotenuse*this.totalSpeed || 0;

                this.collisionX += speedX;
                this.collisionY += speedY;
            }

            this.game.obstacleArray.forEach((obstacle)=>{
                let [collision,hypotenuse,sumOfRadii,dx,dy] = this.game.checkCollision(this,obstacle);
                const unitX = dx/hypotenuse;
                const unitY = dy/hypotenuse;

                if(collision){
                    this.collisionX = obstacle.collisionX + sumOfRadii*unitX;
                    this.collisionY = obstacle.collisionY + sumOfRadii*unitY;
                }
            });

            if(this.collisionX-this.collisionRadius<0)
                this.collisionX = this.collisionRadius;
            if(this.collisionX+this.collisionRadius>this.game.width)
                this.collisionX = this.game.width-this.collisionRadius;
            if(this.collisionY<this.marginTop)
                this.collisionY = this.marginTop;
            if(this.collisionY+this.collisionRadius>this.game.height)
                this.collisionY = this.game.height-this.collisionRadius;
        }
    }

    class Obstacle{
        constructor(game){
            this.game = game;
            this.collisionX = Math.random()*this.game.width;
            this.collisionY = Math.random()*this.game.height;
            this.collisionRadius = 60;

            this.image = document.getElementById("obstacles");
            this.spriteWidth = 250;
            this.spriteHeight = 250;
            this.spriteX = this.collisionX - this.spriteWidth*0.5;
            this.spriteY = this.collisionY - this.spriteHeight + 45;

            this.frameX = Math.floor(Math.random()*4);
            this.frameY = Math.floor(Math.random()*3);
        }

        draw(context){
            context.drawImage(this.image,this.frameX*this.spriteWidth,this.frameY*this.spriteHeight,this.spriteWidth,this.spriteHeight,this.spriteX,this.spriteY,this.spriteWidth,this.spriteHeight);

            context.fillStyle = 'white';
            context.beginPath();
            context.arc(this.collisionX,this.collisionY,this.collisionRadius,0,Math.PI*2);
            context.closePath();
            context.save();
            context.globalAlpha = 0.5;
            context.fill();
            context.restore();
            context.stroke();
        }
    }

    class Game{
        constructor(canvas){
            this.canvas = canvas;
            this.width = canvas.width;
            this.height = canvas.height;

            this.player = new Player(this);

            this.mouse = {
                x: this.width*0.5,
                y: this.height*0.5,
                pressed: false
            };

            this.canvas.addEventListener("mousedown",(e)=>{
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = true;
            });

            this.canvas.addEventListener("mouseup",(e)=>{
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                this.mouse.pressed = false;
            });

            this.canvas.addEventListener("mousemove",(e)=>{
                if(this.mouse.pressed){
                    this.mouse.x = e.offsetX;
                    this.mouse.y = e.offsetY;
                }
            });

            this.obstacleArray = [];
            this.numberOfObstacles = 10;
        }

        init(){
            let attempts = 0;
            while(attempts<500 && this.obstacleArray.length<this.numberOfObstacles){
                let testObstacle = new Obstacle(this);
                
                let collided = false;
                this.obstacleArray.forEach((obstacle)=>{
                    const dx = testObstacle.collisionX - obstacle.collisionX;
                    const dy = testObstacle.collisionY - obstacle.collisionY;
                    const hypotenuse = Math.hypot(dy,dx);
                    const hypotenuseBuffer = 150;

                    if(hypotenuse<testObstacle.collisionRadius+obstacle.collisionRadius+hypotenuseBuffer)
                        collided = true;
                });

                if(!collided && testObstacle.spriteX>0 && testObstacle.spriteX<this.width-testObstacle.spriteWidth && testObstacle.spriteY>150 && testObstacle.collisionY<this.height-100){
                    this.obstacleArray.push(testObstacle);
                }

                attempts++;
            }
        }

        checkCollision(objA,objB){
            const dx = objA.collisionX - objB.collisionX;
            const dy = objA.collisionY - objB.collisionY;
            const hypotenuse = Math.hypot(dy,dx);
            const sumOfRadii = objA.collisionRadius+objB.collisionRadius;

            return [hypotenuse<sumOfRadii,hypotenuse,sumOfRadii,dx,dy];
        }

        render(context){
            this.player.draw(context);
            this.player.update();

            this.obstacleArray.forEach((obstacle)=>{
                obstacle.draw(context);
            });
        }
    }

    const game = new Game(canvas);
    game.init();

    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.render(ctx);
        requestAnimationFrame(animate);
    }
    animate();
});