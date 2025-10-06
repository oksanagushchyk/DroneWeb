import React, { useRef, useEffect} from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { useParams, Link } from "react-router-dom";

const modelPaths = {
  airbus: "/models/plane/airbus.gltf",
  gulfstream: "/models/plane/gulfstream.gltf",
  beechcraft: "/models/plane/beechcraft.gltf",
};

const displayNames = {
  airbus: "Airbus A380",
  gulfstream: "Gulfstream G650",
  beechcraft: "Beechcraft T6 Texan II",
};

export default function PlaneWithWalking() {
  const { id } = useParams();

  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const directionalLightRef = useRef(null);
  const ambientLightRef = useRef(null);

  useEffect(() => {
    const mount = mountRef.current;
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(
      75,
      mount.clientWidth / mount.clientHeight,
      0.1,
      3000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const directionalLight = new THREE.DirectionalLight(0xfff7e8, 1.2);
    directionalLight.position.set(100, 200, 100);
    directionalLight.castShadow = true;
    directionalLight.shadow.mapSize.width = 2048;
    directionalLight.shadow.mapSize.height = 2048;
    directionalLight.shadow.camera.left = -150;
    directionalLight.shadow.camera.right = 150;
    directionalLight.shadow.camera.top = 150;
    directionalLight.shadow.camera.bottom = -150;
    directionalLight.shadow.camera.near = 0.5;
    directionalLight.shadow.camera.far = 500;
    scene.add(directionalLight);
    directionalLightRef.current = directionalLight;

    const sunGeometry = new THREE.SphereGeometry(20, 32, 32);
    const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xffdd99, emissive: 0xffbb66 });
    const sun = new THREE.Mesh(sunGeometry, sunMaterial);
    sun.position.copy(directionalLight.position);
    scene.add(sun);

    const spriteMaterial = new THREE.SpriteMaterial({ 
      map: new THREE.TextureLoader().load('/textures/lensflare.png'),
      color: 0xffdd99,
      transparent: true,
      blending: THREE.AdditiveBlending 
    });
    const sprite = new THREE.Sprite(spriteMaterial);
    sprite.scale.set(80, 80, 1);
    sprite.position.copy(directionalLight.position);
    scene.add(sprite);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.7);
    fillLight.position.set(-100, 50, -100);
    scene.add(fillLight);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);
    ambientLightRef.current = ambientLight;

    const groundGeo = new THREE.PlaneGeometry(1000, 1000, 64, 64);
    const groundMat = new THREE.MeshStandardMaterial({ color: 0x888888 });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    ground.position.y = 0;
    scene.add(ground);

    const loader = new GLTFLoader();
    let plane;
    let planeBoundingBox;

    const modelPath = modelPaths[id] || modelPaths.airbus; // load model file path

    loader.load(
      modelPath,
      (gltf) => {
        plane = gltf.scene;
        plane.scale.set(1, 1, 1);
          plane.position.set(10, 16, 0)
        plane.traverse((child) => {
          if (child.isMesh) {
            child.castShadow = true;
            child.receiveShadow = true;
            if (child.material && child.material.isMeshStandardMaterial) {
              child.material.metalness = 0.6;  // Higher = more metal
              child.material.roughness = 0.1;  // Lower = glossier
              child.material.envMapIntensity = 1.5;
              child.material.needsUpdate = true;
            }
          }
        });
        scene.add(plane);
        planeBoundingBox = new THREE.Box3().setFromObject(plane);
      },
      undefined,
      (error) => console.error("Error loading plane model:", error)
    );

    const playerHeight = 6;
    camera.position.set(0, playerHeight, 50);

    const controls = new PointerLockControls(camera, mount);
    scene.add(controls.getObject());

    const blocker = document.createElement("div");
    Object.assign(blocker.style, {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      backgroundColor: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      color: "white",
      fontSize: "24px",
      cursor: "pointer",
      userSelect: "none",
      zIndex: 100,
    });
    blocker.innerHTML = "Click to enter 3d immersive experience";
    document.body.appendChild(blocker);

    blocker.addEventListener("click", () => controls.lock());
    controls.addEventListener("lock", () => (blocker.style.display = "none"));
    controls.addEventListener("unlock", () => (blocker.style.display = "flex"));

    const velocity = new THREE.Vector3();
    const direction = new THREE.Vector3();
    let moveForward = false,
      moveBackward = false,
      moveLeft = false,
      moveRight = false,
      canJump = false;

    const onKeyDown = (event) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          moveForward = true;
          break;
        case "ArrowLeft":
        case "KeyA":
          moveLeft = true;  // FIXED here
          break;
        case "ArrowDown":
        case "KeyS":
          moveBackward = true;
          break;
        case "ArrowRight":
        case "KeyD":
          moveRight = true;  // FIXED here
          break;
        case "Space":
          if (canJump) velocity.y += 30;
          canJump = false;
          break;
      }
    };

    const onKeyUp = (event) => {
      switch (event.code) {
        case "ArrowUp":
        case "KeyW":
          moveForward = false;
          break;
        case "ArrowLeft":
        case "KeyA":
          moveLeft = false;  // FIXED here
          break;
        case "ArrowDown":
        case "KeyS":
          moveBackward = false;
          break;
        case "ArrowRight":
        case "KeyD":
          moveRight = false;  // FIXED here
          break;
      }
    };

    document.addEventListener("keydown", onKeyDown);
    document.addEventListener("keyup", onKeyUp);

    const raycaster = new THREE.Raycaster();
    const downVector = new THREE.Vector3(0, -1, 0);
    const clock = new THREE.Clock();
    let bobbingTime = 0;

    function animate() {
      requestAnimationFrame(animate);
      if (controls.isLocked) {
        const delta = clock.getDelta();
        bobbingTime += delta;
        velocity.y -= 9.8 * 10 * delta;
        velocity.y = Math.max(velocity.y, -50);
        direction.z = Number(moveForward) - Number(moveBackward);
        direction.x = Number(moveRight) - Number(moveLeft);
        direction.normalize();
        const maxSpeed = 1;
        const acceleration = 4;
        const friction = 10;
        const epsilon = 0.01;
        if (velocity.x < direction.x * maxSpeed)
          velocity.x = Math.min(
            velocity.x + acceleration * delta,
            direction.x * maxSpeed
          );
        else if (velocity.x > direction.x * maxSpeed)
          velocity.x = Math.max(
            velocity.x - acceleration * delta,
            direction.x * maxSpeed
          );
        if (velocity.z < direction.z * maxSpeed)
          velocity.z = Math.min(
            velocity.z + acceleration * delta,
            direction.z * maxSpeed
          );
        else if (velocity.z > direction.z * maxSpeed)
          velocity.z = Math.max(
            velocity.z - acceleration * delta,
            direction.z * maxSpeed
          );
        if (direction.x === 0) {
          if (Math.abs(velocity.x) < epsilon) velocity.x = 0;
          else if (velocity.x > 0) velocity.x = Math.max(velocity.x - friction * delta, 0);
          else if (velocity.x < 0) velocity.x = Math.min(velocity.x + friction * delta, 0);
        }
        if (direction.z === 0) {
          if (Math.abs(velocity.z) < epsilon) velocity.z = 0;
          else if (velocity.z > 0) velocity.z = Math.max(velocity.z - friction * delta, 0);
          else if (velocity.z < 0) velocity.z = Math.min(velocity.z + friction * delta, 0);
        }
        const moveDir = new THREE.Vector3(velocity.x, 0, velocity.z);
        if (moveDir.lengthSq() > 0) moveDir.normalize();
        const playerPos = controls.getObject().position.clone();
        const rayOrigin = playerPos.clone();
        rayOrigin.y -= playerHeight / 2;
        raycaster.set(rayOrigin, moveDir);
        const collisionDistance = 0.4;
        const intersectTargets = [];

        if (ground) intersectTargets.push(ground);
        if (plane) intersectTargets.push(plane);
        const collisions = raycaster.intersectObjects(intersectTargets, true);

        if (!collisions.length || collisions[0].distance > collisionDistance) {
          controls.moveRight(-velocity.x * delta);
          controls.moveForward(-velocity.z * delta);
        } else {
          velocity.x *= 0.2;
          velocity.z *= 0.2;
        }
        raycaster.set(controls.getObject().position, downVector);
        
        const groundCheckTargets = [];
        if (ground) groundCheckTargets.push(ground);
        if (plane) groundCheckTargets.push(plane);
        const intersects = raycaster.intersectObjects(groundCheckTargets, true);


        if (intersects.length) {
          const distanceToGround = intersects[0].distance;
          if (distanceToGround < playerHeight) {
            velocity.y = Math.max(0, velocity.y);
            controls.getObject().position.y = intersects[0].point.y + playerHeight;
            canJump = true;
          } else {
            controls.getObject().position.y += velocity.y * delta;
            canJump = false;
          }
        } else {
          controls.getObject().position.y += velocity.y * delta;
          canJump = false;
        }
        if (planeBoundingBox) {
          const playerBox = new THREE.Box3(
            playerPos.clone().add(new THREE.Vector3(-0.7, -playerHeight, -0.7)),
            playerPos.clone().add(new THREE.Vector3(0.7, 0, 0.7))
          );
          if (playerBox.intersectsBox(planeBoundingBox)) {
            const pushBackSpeed = 30 * delta;
            if (moveForward) controls.moveForward(pushBackSpeed);
            if (moveBackward) controls.moveForward(-pushBackSpeed);
            if (moveLeft) controls.moveRight(pushBackSpeed);
            if (moveRight) controls.moveRight(-pushBackSpeed);
          }
        }
        if (controls.getObject().position.y < playerHeight) {
          controls.getObject().position.y = playerHeight;
          velocity.y = 0;
          canJump = true;
        }
        const bobbingOffset =
          Math.sin(bobbingTime * 8) * 0.02 *
          (Math.sqrt(velocity.x**2 + velocity.z**2) / 1);
        controls.getObject().position.y += bobbingOffset;
      }
      renderer.render(scene, camera);
    }

    animate();

    const onResize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      document.removeEventListener("keydown", onKeyDown);
      document.removeEventListener("keyup", onKeyUp);
      mount.removeChild(renderer.domElement);
      renderer.dispose();
      blocker.remove();
    };
  }, [id]); // add id so effect reloads if param changes

  const handleTimeOfDayChange = (e) => {
    const scene = sceneRef.current;
    const dirLight = directionalLightRef.current;
    const ambLight = ambientLightRef.current;
    const val = e.target.value;
    if (val === "morning") {
      scene.background = new THREE.Color(0xfff1e0);
      dirLight.color.set(0xffd080);
      dirLight.intensity = 0.9;
      ambLight.intensity = 0.3;
    } else if (val === "day") {
      scene.background = new THREE.Color(0x87ceeb);
      dirLight.color.set(0xfff7e8);
      dirLight.intensity = 1.2;
      ambLight.intensity = 0.35;
    } else if (val === "night") {
      scene.background = new THREE.Color(0x0b1d3a);
      dirLight.color.set(0x557799);
      dirLight.intensity = 0.4;
      ambLight.intensity = 0.1;
    }
  };

  return (
    <div>
      <div ref={mountRef} style={{ width: "100vw", height: "100vh" }} />
      <div
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          zIndex: 101,
          background: "rgba(0, 0, 0, 0.6)",
          padding: "10px 15px",
          borderRadius: "8px",
          fontFamily: "sans-serif",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        }}
      >
        <label style={{ fontWeight: "bold", marginRight: "8px", color: "white" }}>
          Time of Day:
        </label>
        <select onChange={handleTimeOfDayChange} defaultValue="day" style={{ padding: "4px 8px", borderRadius: "4px", border: "1px solid #ccc" }}>
          <option value="morning">Morning</option>
          <option value="day">Day</option>
          <option value="night">Night</option>
        </select>
      </div>
      
  
      <Link to="/choose">
        <button style={{
          position: "absolute",
          top: 20,
          left: 20,
          zIndex: 101,
          background: "rgba(0, 0, 0, 0.6)",
          padding: "10px 15px",
          borderRadius: "8px",
          fontFamily: "sans-serif",
          color: "white",
          fontWeight: "bold",
          fontSize: 18
        }}
      >
          {displayNames[id] || "Airbus A380"}
        </button>
        </Link>
    </div>
  );
}
