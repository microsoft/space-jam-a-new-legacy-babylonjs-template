 import {
  Scene,
  HemisphericLight,
  Vector3,
  Engine,
  ArcRotateCamera,
  CannonJSPlugin,
  MeshBuilder,
  StandardMaterial,
  PhotoDome,
  PhysicsImpostor
} from "babylonjs";
import * as cannon from "cannon";
import { WoodProceduralTexture } from "babylonjs-procedural-textures";


import {Environment} from "./environment"
// Get the canvas DOM element
var canvas = document.getElementById("renderCanvas") as HTMLCanvasElement;
// Load the 3D engine
var engine: Engine = null;
var sceneToRender = null;
var createDefaultEngine = function () {
  return new Engine(canvas, true, {
    preserveDrawingBuffer: true,
    stencil: true,
  });
};

var createScene = async function () {
  var scene = new Scene(engine);
  var camera = new ArcRotateCamera("cam", -Math.PI / 2, Math.PI / 2, 10, new Vector3(0, -2, 3), scene);

  var light = new HemisphericLight(
    "light1",
    new Vector3(0, 1, 0),
    scene
  );
  light.intensity = 0.7;

  var cannonPlugin = new CannonJSPlugin(true, 10, cannon);
  scene.enablePhysics(new Vector3(0, -3, 0), cannonPlugin);

  camera.wheelDeltaPercentage = 0.01;
  camera.attachControl(canvas, true);
  const environment = new Environment(scene, engine);
  environment.init();

  // Create Floor
  var gymFloor = MeshBuilder.CreateGround("ground", { width: 60, height: 60 }, scene);
  gymFloor.position = new Vector3(0, -3.5, 0);
  var woodMaterial = new StandardMaterial("woodMaterial", scene);
  var woodTexture = new WoodProceduralTexture("text", 1024, scene);
  woodTexture.ampScale = 80.0;
  woodMaterial.diffuseTexture = woodTexture;
  gymFloor.material = woodMaterial;

  // Add Physics
  gymFloor.physicsImpostor = new PhysicsImpostor(gymFloor, PhysicsImpostor.SphereImpostor, { mass: 0, restitution: 1 }, scene);

  // Create PhotoDome
  var dome = new PhotoDome(
      "testdome",
      "https://sjanlassets.blob.core.windows.net/assets/Looney-Court.png",
      {
          resolution: 32,
          size: 100
      },
      scene
  );

  // Create default XR Experience
  const xr = await scene.createDefaultXRExperienceAsync({
    floorMeshes: [gymFloor],
  });

  return scene;
};

try {
  engine = createDefaultEngine();
} catch (e) {
  console.log(
    "the available createEngine function failed. Creating the default engine instead"
  );
  engine = createDefaultEngine();
}
if (!engine) throw "engine should not be null.";

createScene().then((returnedScene) => {
  sceneToRender = returnedScene;
});

engine.runRenderLoop(function () {
  if (sceneToRender) {
    sceneToRender.render();
  }
});

// Resize
window.addEventListener("resize", function () {
  engine.resize();
});
