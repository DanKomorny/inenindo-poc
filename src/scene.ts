import * as BABYLON from "@babylonjs/core";
//import * as LOADERS from "@babylonjs/loaders";
//import * as MATERIALS from "@babylonjs/materials";
//import * as GUI from "@babylonjs/gui";
//import * as INSPECTOR from "@babylonjs/inspector";
import "babylon-vrm-loader";

export default class Game {
  engine: BABYLON.Engine;
  scene: BABYLON.Scene;
  constructor(elem: HTMLCanvasElement) {
    this.engine = new BABYLON.Engine(elem, true);
    this.scene = new BABYLON.Scene(this.engine);
    //Inspector
    //this.scene.debugLayer.show();
  }

  async setup(): Promise<void> {
    {
      this.scene.createDefaultCameraOrLight(false, true, true);
      const ground = BABYLON.MeshBuilder.CreateGround("ground", { width: 5, height: 5 });
      ground.position.y -= 1;

      // vrmFile is File object retrieved by <input type="file">.
      // or you can use url too.
      BABYLON.SceneLoader.Append(
        "https://cdn.jsdelivr.net/gh/DanKomorny/model-storage@105459ba92d4b84675cb183f03177f71d8f20145/Vivi.vrm",
        null,
        this.scene
      );
    }
    const vrmManager = this.scene.metadata.vrmManagers[0];

    // Update secondary animation(Spring Bones)
    this.scene.onBeforeRenderObservable.add(() => {
      vrmManager.update(this.scene.getEngine().getDeltaTime());
    });
    // Model Transformation
    vrmManager.rootMesh.translate(new BABYLON.Vector3(1, 0, 0), 0);
    // Work with HumanoidBone
    vrmManager.humanoidBone.leftUpperArm.addRotation(0, 1, 0);
    // Work with BlendShape(MorphTarget)
    vrmManager.morphing("Joy", 1.0);
  }
  run(): void {
    this.engine.runRenderLoop(() => this.scene.render());
  }
}
