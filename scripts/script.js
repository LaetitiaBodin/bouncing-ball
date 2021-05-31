canvas = document.getElementById('canvas');
ctx = canvas.getContext('2d');

let timer; // Necessary to put the animation on pause.
let ctx_frames = 30; // Time for the interval.
let step = 5; // X and Y incrementation / decrementation. Can be edited via 2 buttons.
let ctx_top = 0;
let ctx_right = canvas.width;
let ctx_bottom = canvas.height;
let ctx_left = 0;
let background_color = '#eee6ff';
let ball_radius = 20;
let ball_colors = {
   primary : '#093028',
   secondary : '#237a57'
};
let paddle_size = {
   min : 8,
   max : ball_radius * 4
};
let paddle_color = '#237a57';

/* Default position for the ball when the page loads. */
let x = canvas.width / 2;
let y = canvas.height / 2;
let dirX = 'up';
let dirY = 'up';

function background () {
   ctx.fillStyle = background_color;
   ctx.fillRect(ctx_left, ctx_top, ctx_right, ctx_bottom);
}     
         
function paddles () {
      // Only visible when the ball reaches the edge during the animation.
      ctx.beginPath();
      ctx.fillStyle = paddle_color;
      /* No "else if", only "if" => If the ball hits an angle, paddles on both sides will be visible.
         Otherwise, only one paddle is visible (first one in the "else if" chain).*/
      if (y >= ctx_bottom - ball_radius * 2) {
         // Bottom
         ctx.fillRect(x - ball_radius * 2, ctx_bottom - paddle_size.min, paddle_size.max, paddle_size.min);
      }
      if (x <= ctx_left + ball_radius * 2) {
         // Left
         ctx.fillRect(ctx_left, y - ball_radius * 2, paddle_size.min, paddle_size.max);
      }
      if (y <= ctx_top + ball_radius * 2) {
         // Top
         ctx.fillRect(x - ball_radius * 2, ctx_top, paddle_size.max, paddle_size.min);
      }
      if (x >= ctx_right - ball_radius * 2) {
         // Right
         ctx.fillRect(ctx_right - paddle_size.min, y - ball_radius * 2, paddle_size.min, paddle_size.max);
      }
      ctx.closePath();
   }
         
function ball () {
   let colorBall = ctx.createRadialGradient(x, y, 1, x, y, ball_radius);   
   colorBall.addColorStop(0, ball_colors.secondary);
   colorBall.addColorStop(1, ball_colors.primary);
   ctx.beginPath();
   ctx.fillStyle = colorBall;
   ctx.arc(x, y, ball_radius, 0, 2 * Math.PI);
   ctx.fill();
   ctx.closePath();
}

function bouncing () {   
   // Top
   if (y <= ball_radius + paddle_size.min + step) {
      dirY = 'up';
   }
   // Right
   if (x >= ctx_right - ball_radius - paddle_size.min - step) {
      dirX = 'down';
   }
   // Bottom
   if (y >= ctx_bottom - ball_radius - paddle_size.min - step) {
      dirY = 'down';
   }
   // Left
   if (x <= ball_radius + paddle_size.min + step) {
      dirX = 'up';
   }
}

function direction () {
   if (dirY == 'down') {
      y -= step; // Ball goes to the top.
   }
   if (dirX == 'up') {
      x += step; // Ball goes to the right.
   }  
   if (dirY == 'up') {
      y += step; // Ball goes to the bottom.
   }
   if (dirX == 'down') {
      x -= step; // Ball goes to the left.
   }
}

function canvasAnimate(){
   background();
   paddles();
   ball();
   bouncing();
   direction();
}

function removeButtons () {
   if (step == 1) {
      // Lowest speed. SLOWER button is disabled => The speed cannot decrease.
      btnSlow.setAttribute("disabled", "disabled");
   }
   if (step > 1) {
      // Between lowest and highest speed. => SLOWER button is no longer disabled => The speed can decrease.
      btnSlow.removeAttribute("disabled");
   }
   if (step < 10) {
      // Between lowest and highest speed. => FASTER button is not yet disabled => The speed can increase.
      btnFast.removeAttribute("disabled");
   }
   if (step == 10) {
      // Highest speed. FASTER button is disabled => The speed cannot increase.
      btnFast.setAttribute("disabled", "disabled");
   }
}

function updateSpeed () {
   currentSpeed.innerHTML = step.toString().padStart(2, '0');
}

function canvasLoad () {
   background();
   ball();
   // Paddles
   ctx.beginPath();
   ctx.fillStyle = paddle_color;
   // Top
   ctx.fillRect(x - ball_radius * 2, ctx_top, ball_radius * 4, paddle_size.min);
   // Right
   ctx.fillRect(ctx_right - paddle_size.min, y - ball_radius * 2, paddle_size.min, ball_radius * 4);
   // Bottom
   ctx.fillRect(x - ball_radius * 2, ctx_bottom - paddle_size.min, ball_radius * 4, paddle_size.min);
   // Left
   ctx.fillRect(ctx_left, y - ball_radius * 2, paddle_size.min, ball_radius * 4);
   ctx.closePath();
   updateSpeed();
}

function canvasStart (el) {
   timer = setInterval(canvasAnimate, ctx_frames); // Starts the animation => Calls the function every ctx_frames in ms.
   el.setAttribute("disabled", "disabled"); // START button is disabled.
   btnStop.removeAttribute("disabled"); // STOP button is no longer disabled.
   removeButtons();
}

function canvasStop (el) {
   clearInterval(timer); // Stops the animation => The function is no longer called.
   el.setAttribute("disabled", "disabled"); // STOP button is disabled.
   btnStart.removeAttribute("disabled"); // START button is no longer disabled.
   removeButtons();
}

function goFaster () {
   if (step < 10) {
      step += 1;
   }
   removeButtons();
   updateSpeed();
};

function goSlower () {
   if (step > 1) {
      step -= 1;
   }
   removeButtons();
   updateSpeed();
};
