function main() {
    const canvas = document.querySelector('#c');
    const renderer = new THREE.WebGLRenderer({canvas});
  
    // setting up camera
    const fov = 35;
    const aspect = 1;  // the canvas default
    const near = 0.1;
    const far = 1000;
    const camera = new THREE.PerspectiveCamera(fov, aspect, near, far);
    camera.position.z = 10;
    
  
    // setting up controls
    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.minDistance = 1.12; controls.maxDistance = 100;
    controls.update();
  
    // setting the mooood lol, setting up the planet textures
    const scene = new THREE.Scene();
    const loader = new THREE.TextureLoader();
    const moonTexture = loader.load(`https://i.ibb.co/8N6rTn0/moon-4k-color-brim16.jpg`);
    const earthTexture = loader.load('https://i.ibb.co/8zKKPhp/8k-earth-clouds.jpg');
    const marsTexture = loader.load('https://i.ibb.co/NYCRHmX/8k-mars.jpg');
    const map = [moonTexture, earthTexture, marsTexture];
  
  
    // making of thte planets
    const geometry = new THREE.SphereBufferGeometry(1, 32, 32);
  
    function makeInstance(geometry, map, x) {
      const material = new THREE.MeshPhongMaterial({map});
      const sphere = new THREE.Mesh(geometry, material);
      scene.add(sphere);
  
      sphere.position.x = x;
  
      return sphere;
    }
  
    // the planets (3d models)
    const moon = makeInstance(geometry, moonTexture, 0);     // moon
    const earth = makeInstance(geometry, earthTexture, -3.5); // cloudy earth
    const mars = makeInstance(geometry, marsTexture,  3.5);  // mars bby
  
    
    // lights 
    const color = 0xFFFFFF;
    const intensity = 2;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(0, 10, 0);
    light.target.position.set(-5, 0, 0);
    scene.add(light); 
    scene.add(light.target);
  
    class ColorGUIHelper {
      constructor(object, prop) {
        this.object = object;
        this.prop = prop;
      }
      get value() {
        return `#${this.object[this.prop].getHexString()}`;
      }
      set value(hexString) {
        this.object[this.prop].set(hexString);
      }
    }
  
  
    {
      const loader = new THREE.TextureLoader();
      const texture = loader.load(
        'https://i.ibb.co/kDRmqgw/8k-stars-milky-way.jpg',
        () => {
          const rt = new THREE.WebGLCubeRenderTarget(texture.image.height);
          rt.fromEquirectangularTexture(renderer, texture);
          scene.background = rt;
        });
    }
  
  
    function resizeRendererToDisplaySize(renderer) {
      const canvas = renderer.domElement;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      const needResize = canvas.width !== width || canvas.height !== height;
      if (needResize) {
        renderer.setSize(width, height, false);
      }
      return needResize;
    }
  
    // control center -------------------------------------------------------
  
    options = {
      motion: true,
      clear: false,
    }
  
    function updateCamera() {
      camera.updateProjectionMatrix();
    }
    
    const gui = new dat.GUI();
    gui.add(camera, 'fov', 0, 180).name('zoom').onChange(updateCamera);
    gui.add(options, "motion").name("autoRotate").onChange(updateCamera);
    
    //rotate moon
    const moonFolder = gui.addFolder('Rotate Moon');
    moonFolder.add(moon.rotation, "x", 0, Math.PI * 2, 0.01);
    moonFolder.add(moon.rotation, "y", 0, Math.PI * 2, 0.01);
    moonFolder.add(moon.rotation, "z", 0, Math.PI * 2, 0.01);
  
    // rotate earth
    const earthFolder = gui.addFolder('Rotate Earth');
    earthFolder.add(earth.rotation, "x", 0, Math.PI * 2, 0.01);
    earthFolder.add(earth.rotation, "y", 0, Math.PI * 2, 0.01);
    earthFolder.add(earth.rotation, "z", 0, Math.PI * 2, 0.01);
  
    // rotate mars
    const marsFolder = gui.addFolder('Rotate Mars');
    marsFolder.add(mars.rotation, "x", 0, Math.PI * 2, 0.01);
    marsFolder.add(mars.rotation, "y", 0, Math.PI * 2, 0.01);
    marsFolder.add(mars.rotation, "z", 0, Math.PI * 2, 0.01);
  
    const lightFolder = gui.addFolder('Lighting');
    //lightFolder.add(light.visible);
    lightFolder.addColor(new ColorGUIHelper(light, 'color'), 'value').name('color');
    lightFolder.add(light, 'intensity', 0, 2, 0.01);
    lightFolder.add(light.target.position, 'x', -10, 10, 0.01);
    lightFolder.add(light.target.position, 'y', -10, 10, 0.01);
    lightFolder.add(light.target.position, 'z', 0, 10, 0.01);
  
    //--------------------------------------------------------------------------------
    
    function render(time) {
      time *= 0.001;
  
      if (resizeRendererToDisplaySize(renderer)) {
        const canvas = renderer.domElement;
        camera.aspect = canvas.clientWidth / canvas.clientHeight;
        camera.updateProjectionMatrix();
      }
  
      if(options.motion) {
        moon.rotateX(0.002);
        moon.rotateY(0.01);
        moon.rotateZ(0.001);
    
        earth.rotateX(-0.002);
        earth.rotateY(0.01);
        earth.rotateZ(0.002);
    
        mars.rotateX(0.004);
        mars.rotateY(-0.01);
        mars.rotateZ(0.001);
      }
  
      renderer.render(scene, camera);
  
      requestAnimationFrame(render);
    }
  
    requestAnimationFrame(render);
  
  
    window.addEventListener('mousedown', (e) => {
      e.preventDefault();
      window.focus();
    });
    window.addEventListener('keydown', (e) => {
      e.preventDefault();
    });
  } 
  
  main();
  
  
