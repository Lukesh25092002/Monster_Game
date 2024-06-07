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
            this.totalSpeed = 5;
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
        }

        render(context){
            this.player.draw(context);
            this.player.update();
        }
    }

    const game = new Game(canvas);

    function animate(){
        ctx.clearRect(0,0,canvas.width,canvas.height);
        game.render(ctx);
        requestAnimationFrame(animate);
    }
    animate();
});




// class Player{
//     constructor(game){
//         this.game = game;
//         this.collisionX = this.game.width*0.5;
//         this.collisionY = this.game.height*0.5;
//         this.collisionRadius = 50;
//         this.speedX = 0;
//         this.speedY = 0;
//         this.speedModifier = 10;
//     }

//     draw(context){
//         context.fillStyle = 'white';
//         context.beginPath();
//         context.arc(this.collisionX,this.collisionY,this.collisionRadius,0,Math.PI*2);
//         context.closePath();
//         context.save();
//         context.globalAlpha = 0.5;
//         context.fill();
//         context.restore();
//         context.stroke();

//         context.beginPath();
//         context.moveTo(this.collisionX,this.collisionY);
//         context.lineTo(this.game.mouse.x,this.game.mouse.y);
//         context.closePath();
//         context.stroke();
//     }

//     update(){
//         const dx = this.game.mouse.x - this.collisionX;
//         const dy = this.game.mouse.y - this.collisionY;
//         const hypotenuse = Math.hypot(dy,dx);

//         this.speedX = dx/hypotenuse*this.speedModifier || 0;
//         this.speedY = dy/hypotenuse*this.speedModifier || 0;

//         if(hypotenuse<this.speedModifier){
//             this.speedX = 0;
//             this.speedY = 0;
//         }
        
//         this.collisionX += this.speedX;
//         this.collisionY += this.speedY;
//     }
// }