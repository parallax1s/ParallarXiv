import Head from 'next/head';
import Script from 'next/script';

export default function Home() {
  return (
    <>
      <Head>
        <title>ParallarXiv</title>
      </Head>
      <Script src="https://unpkg.com/three@0.160.1/build/three.min.js" strategy="beforeInteractive" />
      <Script src="https://unpkg.com/three@0.160.1/examples/js/controls/PointerLockControls.js" strategy="beforeInteractive" />
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
          const scene = new THREE.Scene();
          scene.background = new THREE.Color(0x000000);

          const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
          camera.position.y = 1.6;

          const renderer = new THREE.WebGLRenderer();
          renderer.setSize(window.innerWidth, window.innerHeight);
          document.body.appendChild(renderer.domElement);

          const controls = new THREE.PointerLockControls(camera, renderer.domElement);
          const overlay = document.getElementById('overlay');

          overlay.addEventListener('click', () => {
            controls.lock();
          });

          controls.addEventListener('lock', () => {
            overlay.style.display = 'none';
          });
          controls.addEventListener('unlock', () => {
            overlay.style.display = 'flex';
          });

          const objects = [];
          const velocities = new Map();

          const raycaster = new THREE.Raycaster();
          const mouse = new THREE.Vector2();

          function spawnBall() {
            const geometry = new THREE.SphereGeometry(Math.random() * 0.5 + 0.2, 32, 32);
            const material = new THREE.MeshStandardMaterial({
              color: new THREE.Color(Math.random(), Math.random(), Math.random()),
            });
            const sphere = new THREE.Mesh(geometry, material);
            sphere.position.set((Math.random() - 0.5) * 20, Math.random() * 4 + 1, (Math.random() - 0.5) * 20);
            scene.add(sphere);
            objects.push(sphere);
            velocities.set(sphere, new THREE.Vector3((Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02, (Math.random() - 0.5) * 0.02));

            // schedule next spawn
            setTimeout(spawnBall, Math.random() * 2000 + 1000);
          }

          // start spawning
          spawnBall();

          const ambient = new THREE.AmbientLight(0xffffff, 0.5);
          scene.add(ambient);
          const directional = new THREE.DirectionalLight(0xffffff, 0.5);
          directional.position.set(1, 1, 1);
          scene.add(directional);

          const clock = new THREE.Clock();

          function animate() {
            requestAnimationFrame(animate);

            const delta = clock.getDelta();

            objects.forEach((obj) => {
              const v = velocities.get(obj);
              obj.position.addScaledVector(v, delta * 60);
              if (obj.position.length() > 30) {
                obj.position.multiplyScalar(0.8);
              }
            });

            if (controls.isLocked === true) {
              const moveSpeed = 5 * delta;
              const direction = new THREE.Vector3();
              if (keys['w']) direction.z -= moveSpeed;
              if (keys['s']) direction.z += moveSpeed;
              if (keys['a']) direction.x -= moveSpeed;
              if (keys['d']) direction.x += moveSpeed;
              controls.moveRight(direction.x);
              controls.moveForward(direction.z);
            }

            renderer.render(scene, camera);
          }
          animate();

          const keys = {};
          window.addEventListener('keydown', (e) => {
            keys[e.key.toLowerCase()] = true;
          });
          window.addEventListener('keyup', (e) => {
            keys[e.key.toLowerCase()] = false;
          });

          function onClick() {
            if (!controls.isLocked) return;
            mouse.x = 0;
            mouse.y = 0;
            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(objects);
            if (intersects.length > 0) {
              const hit = intersects[0].object;
              scene.remove(hit);
              velocities.delete(hit);
              const index = objects.indexOf(hit);
              if (index > -1) objects.splice(index, 1);
            }
          }
          document.addEventListener('click', onClick);

          window.addEventListener('resize', () => {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
          });
        `}
      </Script>
    </>
  );
}

