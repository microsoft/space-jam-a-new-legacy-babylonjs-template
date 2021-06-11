import {
    Scene,
    Engine,
    AssetsManager,
    Vector3,
    TransformNode,
    SceneLoader,
    Mesh
} from "babylonjs";

import { Player } from "./models/Player";
import * as GUI from "babylonjs-gui";
import 'babylonjs-loaders';
import { AbstractMesh } from "babylonjs/Meshes/abstractMesh";

export class Environment {
    private _scene: Scene;
    private _engine: Engine;
    //private _assetsManager: AssetsManager;
    private _players: Array<Player>;

    constructor(scene: Scene, engine: Engine) {
        this._scene = scene;
        this._engine = engine;
        //this._assetsManager = new AssetsManager(this._scene);
        this._players = require('./data/players.json');
    }

    public async init() {

        this.createCharacterButtons();
        this.addLogo();
    }

    public createCharacterButtons() {
        // Create the main 3D UI manager for the button grid
        var mainManager = new GUI.GUI3DManager(this._scene);
        var mainButtonPanel = new GUI.CylinderPanel();
        mainButtonPanel.margin = 0.2;

        mainManager.addControl(mainButtonPanel);
        var anchor = new TransformNode("");
        mainButtonPanel.linkToTransformNode(anchor);
        mainButtonPanel.position =  new Vector3(0,-2,-3);
        mainButtonPanel.columns = 8;
        mainButtonPanel.rows = 2;


        // Create the mesh 3D UI manager for the popUp
        var meshManager = new GUI.GUI3DManager(this._scene);
        var meshPanel = new GUI.PlanePanel();
        meshPanel.margin = 0.2;

        meshManager.addControl(meshPanel);
        meshPanel.linkToTransformNode(anchor);
        meshPanel.position = new Vector3(6, 0, -1);

        //set panel layouts
        mainButtonPanel.blockLayout = true;

        //set player container and add to mesh panel
        var displayStatsContainer = new GUI.HolographicButton("orientation");
        meshPanel.addControl(displayStatsContainer);
        displayStatsContainer.isVisible = false;
       

        var activeMesh: AbstractMesh[] = null;

        // //close button logic to hide player container and close button
        displayStatsContainer.onPointerUpObservable.add(() => {
            displayStatsContainer.isVisible = false;
            if (activeMesh) {
                activeMesh.forEach(mesh => {
                    mesh.dispose();
                });
            }
        });


        //loop thru players and add a button for each player
        for (var index = 0; index < this._players.length; index++) {
            let player = this._players[index];

            //create and add button
            var button = new GUI.HolographicButton("orientation");
            mainButtonPanel.addControl(button);
            button.text = player.name;
            button.imageUrl = player.imgUrl;
            button.onPointerUpObservable.add(async function () {
                displayStatsContainer.imageUrl = player.imgUrl;
                displayStatsContainer.text = `PER: ${player.per}`;
                displayStatsContainer.isVisible = true;
                displayStatsContainer.scaling = new Vector3(3, 3, 1);
                displayStatsContainer.position =  new Vector3(-6,-1,2);

            //     SceneLoader.Append(player.model,"", this._scene, function (scene) { 
            //         let meshes = scene.meshes;  
            //         activeMesh = meshes;          
            //         meshes.forEach(mesh => {
            //                 mesh.rotation = new Vector3(0,1,0)
            //                 mesh.position = new Vector3(-2,-3,0);
            //                 //console.log(activeMesh);

            //         })
            //     });
            });
        };
    }


    public addLogo() {
        const guiMenu = GUI.AdvancedDynamicTexture.CreateFullscreenUI("UI");
        guiMenu.idealHeight = 720;

        //background image
        const imageRect = new GUI.Rectangle("titleContainer");
       // imageRect.width = 1;
        imageRect.thickness = 0;
        guiMenu.addControl(imageRect);

        const logo = new GUI.Image("", "https://sjanlassets.blob.core.windows.net/assets/SpaceJamANewLegacyLogo.png")
        logo.width = 0.1;
        logo.height = 0.2;
        logo.verticalAlignment = GUI.Control.VERTICAL_ALIGNMENT_TOP;
        logo.horizontalAlignment = GUI.Control.HORIZONTAL_ALIGNMENT_CENTER;
        imageRect.addControl(logo);
    }



}
