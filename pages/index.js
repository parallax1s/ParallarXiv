import Head from 'next/head';
import Script from 'next/script';

export default function Home() {
  return (
    <>
      <Head>
        <title>ParallarXiv</title>
      </Head>
      <style jsx global>{`
        body {
          margin: 0;
          overflow: hidden;
          font-family: sans-serif;
          background: #000;
        }
        #overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 24px;
          color: #fff;
          background: rgba(0, 0, 0, 0.5);
          cursor: pointer;
        }
      `}</style>
      <div id="overlay">Click to start</div>
      {/* Scene setup */}
      <Script id="main-script" strategy="lazyOnload">
        {`
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          document.body.appendChild(canvas);

          function resize() {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
          }
          window.addEventListener('resize', resize);
          resize();

          const overlay = document.getElementById('overlay');
          overlay.addEventListener('click', () => {
            canvas.requestPointerLock();
          });

          document.addEventListener('pointerlockchange', () => {
            if (document.pointerLockElement === canvas) {
              overlay.style.display = 'none';
            } else {
              overlay.style.display = 'flex';
            }
          });

          const balls = [];
          function spawnBall() {
            const radius = Math.random() * 20 + 10;
            const color = `hsl(${Math.random() * 360}, 70%, 50%)`;
            const ball = {
              x: (Math.random() - 0.5) * 400,
              y: (Math.random() - 0.5) * 300,
              r: radius,
              color,
              vx: (Math.random() - 0.5) * 0.4,
              vy: (Math.random() - 0.5) * 0.4,
            };
            balls.push(ball);
            setTimeout(spawnBall, Math.random() * 2000 + 1000);
          }
          spawnBall();

          const keys = {};
          window.addEventListener('keydown', (e) => {
            keys[e.key.toLowerCase()] = true;
          });
          window.addEventListener('keyup', (e) => {
            keys[e.key.toLowerCase()] = false;
          });

          const player = { x: 0, y: 0 };

          function update(delta) {
            const speed = 100 * delta;
            if (keys['w']) player.y -= speed;
            if (keys['s']) player.y += speed;
            if (keys['a']) player.x -= speed;
            if (keys['d']) player.x += speed;
            balls.forEach((b) => {
              b.x += b.vx * delta * 60;
              b.y += b.vy * delta * 60;
              if (Math.hypot(b.x, b.y) > 600) {
                b.x *= 0.8;
                b.y *= 0.8;
              }
            });
          }

          function draw() {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            ctx.save();
            ctx.translate(canvas.width / 2 - player.x, canvas.height / 2 - player.y);
            balls.forEach((b) => {
              ctx.fillStyle = b.color;
              ctx.beginPath();
              ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
              ctx.fill();
            });
            ctx.restore();

            ctx.strokeStyle = '#fff';
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2 - 10, canvas.height / 2);
            ctx.lineTo(canvas.width / 2 + 10, canvas.height / 2);
            ctx.moveTo(canvas.width / 2, canvas.height / 2 - 10);
            ctx.lineTo(canvas.width / 2, canvas.height / 2 + 10);
            ctx.stroke();
          }

          let last = performance.now();
          function animate(time) {
            const delta = (time - last) / 1000;
            last = time;
            update(delta);
            draw();
            requestAnimationFrame(animate);
          }
          requestAnimationFrame(animate);

          canvas.addEventListener('click', () => {
            if (document.pointerLockElement !== canvas) return;
            for (let i = 0; i < balls.length; i++) {
              const b = balls[i];
              if (Math.hypot(b.x - player.x, b.y - player.y) <= b.r) {
                balls.splice(i, 1);
                break;
              }
            }
          });
        `}
      </Script>
    </>
  );
}

