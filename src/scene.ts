import * as BABYLON from "@babylonjs/core";
//import * as LOADERS from "@babylonjs/loaders";
//import * as MATERIALS from "@babylonjs/materials";
//import * as GUI from "@babylonjs/gui";
import "babylon-vrm-loader";

export default class Game {
  engine: BABYLON.Engine;
  scene: BABYLON.Scene;
  constructor(elem: HTMLCanvasElement) {
    this.engine = new BABYLON.Engine(elem, true);
    this.scene = new BABYLON.Scene(this.engine);
    //Inspector Code
    //this.scene.debugLayer.show();
  }

  async setup(): Promise<void> {
    //Create default camera
    this.scene.createDefaultCameraOrLight(false, true, true); // Free Camera settngs
    //Create ground
    const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 5, height: 5 });
    //Ground position
    ground.position.y -= 1;
    //import VRM
    // vrmFile is File object retrieved by <input type="file">.
    const scene = await BABYLON.SceneLoader.LoadAsync(
      "https://cdn.jsdelivr.net/gh/DanKomorny/model-storage@105459ba92d4b84675cb183f03177f71d8f20145/Vivi.vrm",
      "",
      this.engine
    );
    const vrmManager = scene.metadata.vrmManagers[0];

    // Update secondary animation
    scene.onBeforeRenderObservable.add(() => {
      vrmManager.update(scene.getEngine().getDeltaTime());
    });

    // Model Transformation
    vrmManager.rootMesh.translate(new BABYLON.Vector3(1, 0, 0), 1);

    // Work with HumanoidBone
    vrmManager.humanoidBone.leftUpperArm.addRotation(0, 1, 0);

    // Work with BlendShape(MorphTarget)
    vrmManager.morphing("Joy", 1.0);
  }

  run(): void {
    this.engine.runRenderLoop(() => this.scene.render());
  }
}
