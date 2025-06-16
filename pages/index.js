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
        #menu {
          position: fixed;
          top: 10px;
          right: 10px;
          background: rgba(0, 0, 0, 0.7);
          color: #fff;
          padding: 8px;
          font-size: 14px;
          border-radius: 4px;
        }
        #menu-content {
          margin-top: 4px;
        }
        #menu.minimized #menu-content {
          display: none;
        }
      `}</style>
      <div id="overlay">Click to start</div>
      <div id="menu" className="minimized">
        <button id="toggle-menu">Menu</button>
        <div id="menu-content">
          <label>Zoom <input id="menu-fov" type="range" min="100" max="800" value="400" /></label><br />
          <label>Speed <input id="menu-speed" type="range" min="50" max="200" value="100" /></label>
        </div>
      </div>
      {/* Scene setup */}
      <Script id="main-script" strategy="lazyOnload">
        {`
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          document.body.appendChild(canvas);

          const menu = document.getElementById('menu');
          const toggleBtn = document.getElementById('toggle-menu');
          const fovInput = document.getElementById('menu-fov');
          const speedInput = document.getElementById('menu-speed');

          toggleBtn.addEventListener('click', () => {
            menu.classList.toggle('minimized');
          });

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
            overlay.style.display = document.pointerLockElement === canvas ? 'none' : 'flex';
          });

          const balls = [];
          function spawnBall() {
            const radius = Math.random() * 20 + 10;
            const color = 'hsl(' + (Math.random() * 360) + ', 70%, 50%)';
            const ball = {
              x: (Math.random() - 0.5) * 400,
              y: (Math.random() - 0.5) * 200,
              z: (Math.random() - 0.5) * 400,
              r: radius,
              color,
              vx: (Math.random() - 0.5) * 0.4,
              vy: (Math.random() - 0.5) * 0.4,
              vz: (Math.random() - 0.5) * 0.4,
            };
            balls.push(ball);
            setTimeout(spawnBall, Math.random() * 2000 + 1000);
          }
          spawnBall();

          const keys = {};
          window.addEventListener('keydown', (e) => {
            keys[e.key] = true;
          });
          window.addEventListener('keyup', (e) => {
            keys[e.key] = false;
          });

          const camera = { x: 0, y: 0, z: 0, yaw: 0, pitch: 0 };
          let fov = 400;
          let moveSpeed = 100;

          fovInput.value = fov;
          speedInput.value = moveSpeed;

          fovInput.addEventListener('input', () => {
            fov = Number(fovInput.value);
          });

          speedInput.addEventListener('input', () => {
            moveSpeed = Number(speedInput.value);
          });

          canvas.addEventListener('mousemove', (e) => {
            if (document.pointerLockElement !== canvas) return;
            camera.yaw -= e.movementX * 0.002;
            camera.pitch -= e.movementY * 0.002;
            camera.pitch = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, camera.pitch));
          });

          function update(delta) {
            const speed = moveSpeed * delta;
            const cos = Math.cos(camera.yaw);
            const sin = Math.sin(camera.yaw);
            if (keys['w']) {
              camera.x += sin * speed;
              camera.z += cos * speed;
            }
            if (keys['s']) {
              camera.x -= sin * speed;
              camera.z -= cos * speed;
            }
            if (keys['a']) {
              camera.x -= cos * speed;
              camera.z += sin * speed;
            }
            if (keys['d']) {
              camera.x += cos * speed;
              camera.z -= sin * speed;
            }

            if (keys['Shift']) {
              fov = Math.max(100, fov - 200 * delta);
              fovInput.value = fov;
            }
            if (keys['Control']) {
              fov = Math.min(800, fov + 200 * delta);
              fovInput.value = fov;
            }

            balls.forEach((b) => {
              b.x += b.vx * delta * 60;
              b.y += b.vy * delta * 60;
              b.z += b.vz * delta * 60;
              if (Math.hypot(b.x, b.y, b.z) > 600) {
                b.x *= 0.8;
                b.y *= 0.8;
                b.z *= 0.8;
              }
            });
          }

          function project(x, y, z) {
            x -= camera.x;
            y -= camera.y;
            z -= camera.z;

            const cy = Math.cos(camera.yaw);
            const sy = Math.sin(camera.yaw);
            const cx = Math.cos(camera.pitch);
            const sx = Math.sin(camera.pitch);

            let dx = cy * x - sy * z;
            let dz = sy * x + cy * z;
            let dy = cx * y - sx * dz;
            dz = sx * y + cx * dz;

            if (dz <= 0) return { visible: false };
            const scale = fov / dz;
            return { x: canvas.width / 2 + dx * scale, y: canvas.height / 2 + dy * scale, r: scale, visible: true };
          }

          function draw() {
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            balls.forEach((b) => {
              const p = project(b.x, b.y, b.z);
              if (!p.visible) return;
              ctx.fillStyle = b.color;
              ctx.beginPath();
              ctx.arc(p.x, p.y, b.r * p.r, 0, Math.PI * 2);
              ctx.fill();
            });

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
              const p = project(balls[i].x, balls[i].y, balls[i].z);
              if (p.visible && Math.hypot(p.x - canvas.width / 2, p.y - canvas.height / 2) <= balls[i].r * p.r) {
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

