
import { 
    Engine, 
    Scene, 
    ArcRotateCamera, 
    HemisphericLight, 
    MeshBuilder, 
    Vector3, 
    Mesh, 
    VertexData, 
    StandardMaterial,
    LinesMesh,
    Color3,
    TransformNode,
  

} from "@babylonjs/core"
import { create_test_plane, VoxelWorld } from "./world"
import * as gen_algorithms from "./generation"
import { voxel_type } from "./voxel"

export function setup(){
    
    const canvas = document.getElementById("game") as HTMLCanvasElement
    const engine = new Engine(canvas, true)

   

    const scene = create_scene(engine, canvas)

    let chunk_size = 16

    let world = new VoxelWorld(chunk_size)
    
    world.generate_voxels(gen_algorithms.sinus)
    // world.set_voxel(0,0,0, voxel_type.earth)
    // world.set_voxel(1,0,0, voxel_type.earth)
    // world.set_voxel(0,0,1, voxel_type.earth)

    let mesh = world.generate_geometry(scene)

    let box = MeshBuilder.CreateBox("selector", {}, scene)
    let blue = new StandardMaterial("blue")
    blue.diffuseColor = new Color3(0,0,1.0)
    blue.alpha = 0.5
    box.scaling.scaleInPlace(1.2)
    box.material = blue
    box.isPickable = false
    box.position.y

    engine.runRenderLoop(function () {
        scene.render();
    });
    canvas.addEventListener("wheel", (event : WheelEvent) => {
        event.preventDefault()
    })
    let current_vox = new Vector3(0,0,0)
    scene.onPointerMove = () => {
        let picked_result = scene.pick(scene.pointerX, scene.pointerY)
        
        if(picked_result.hit){
            current_vox.x = Math.round(picked_result.pickedPoint.x) + chunk_size/2 -1
            current_vox.y = Math.round(picked_result.pickedPoint.y) -1 
            current_vox.z = Math.round(picked_result.pickedPoint.z) + chunk_size/2 -1
            box.position.x = Math.round(picked_result.pickedPoint.x) - 0.5
            box.position.y = Math.round(picked_result.pickedPoint.y) - 0.5
            box.position.z = Math.round(picked_result.pickedPoint.z) - 0.5
        }
    }
    scene.onPointerPick = (event : PointerEvent) => {
        // console.log("picked")
        // console.log(`x : ${current_vox.x}, y : ${current_vox.y}, z : ${current_vox.z}`)
        console.log(event.button)
        if(current_vox.x < 0 || current_vox.y < 0 || current_vox.z < 0){
            return
        }
        if(event.button == 0){
            world.set_voxel(current_vox.x, current_vox.y, current_vox.z, null)
        }
        if(event.button == 2){
            world.set_voxel(current_vox.x, current_vox.y, current_vox.z, voxel_type.earth)
        }
        world.update_geometry(scene).then((value : Mesh) => {
            mesh.dispose()
            mesh = value
        })
    }
    

}

export function create_scene(engine : Engine, canvas : HTMLCanvasElement) : Scene{
    const scene = new Scene(engine)

    const camera = new ArcRotateCamera("camera", -Math.PI / 2, Math.PI / 2.5, 3, new Vector3(0, 0, 0), scene);
    camera.attachControl(canvas, true);

    const light = new HemisphericLight("light", new Vector3(1, 1, 0), scene);

    
    
    // let test = MeshBuilder.CreateBox("test", {}, scene)
    // let mat = new StandardMaterial("red", scene)
    // mat.diffuseColor = new Color3(1,0,0)
    // test.position = new Vector3(0.5,0.5,0.5)
    // test.material = mat

    let grid = create_grid(scene)
    
   

    return scene

}
export function create_chunk(scene : Scene) : Mesh{
    var customMesh = new Mesh("custom", scene);

    var positions = [-5, 2, -3, -7, -2, -3, -3, -2, -3, 5, 2, 3, 7, -2, 3, 3, -2, 3];
    var indices = [0, 1, 2, 3, 4, 5];
        
    var vertexData = new VertexData();

    vertexData.positions = positions;
    vertexData.indices = indices;   

    vertexData.applyToMesh(customMesh);
    return customMesh
}

function create_grid(scene : Scene) : TransformNode{

    let grid_root = new TransformNode("grid_root", scene)
    let points = [
        new Vector3(-2,0,-2,),
        new Vector3(2,0,-2)
    ]
    const options = {
        points : points,
        updatable: false
    }
    
    let lines = MeshBuilder.CreateLines("lines", options, scene)
    lines.parent = grid_root
    for (let i = 0; i<5; i++){
        let l = lines.createInstance("l"+i)
        l.position.z = i * 1
        l.parent = grid_root
        
    }
    
   
    
    
    let vertical_points = [
        new Vector3(-2,0,-2),
        new Vector3(-2,0,2)
    ]
    let v_options = {
        points : vertical_points,
        updatable : false
    }
    let v_lines = MeshBuilder.CreateLines("z_lines", v_options, scene)
    for (let i = 0; i<5; i++){
        let l = v_lines.createInstance("v_l"+i)
        l.position.x = i * 1
        l.parent = grid_root
    }
    v_lines.parent = grid_root

    return grid_root
}