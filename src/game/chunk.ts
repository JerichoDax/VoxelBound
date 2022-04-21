import { 
    Scene,
    Mesh,
    VertexData,
    Vector3,
 } from "@babylonjs/core";

 import type {voxel, Nullable, voxel_type, voxel_face} from "./voxel"
 


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


export class Chunk {

    size : number
    voxels : Array<voxel_type>

    constructor(size : number){
        this.size = size
        this.voxels = new Array(size*size*size)
        
    }
    generate(algorithm : (x : number, y : number, z : number) => Nullable<voxel_type>){
        for(let x = 0; x < this.size; x++){
            for(let y = 0; y < this.size; y++){
                for(let z = 0; z < this.size; z++){
                    this.voxels[x*this.size*this.size+y*this.size+z] = algorithm(x,y,z)
                }
            }
        }
    }
    // generate(generation_algorithm : (x : number, y : number, z : number) => Nullable<voxel_type>, offset : Vector3){

    //     for (let m_x=0; m_x< this.size; m_x++){
    //         for( let m_y = 0; m_y < this.size; m_y++){
    //             for(let m_z = 0; m_z < this.size; m_z++){
    //                 this.voxels[m_x * this.size*this.size +  m_y * this.size + m_z] = generation_algorithm(m_x, m_y, m_z)
    //             }
    //         }
    //     }
    // }
    get_voxel(pos : Vector3) : Nullable<voxel_type>{
        let result : Nullable<voxel_type> = null
        let id = pos.x * this.size*this.size + pos.y * this.size + pos.z

        if (id < 0 || id > this.size*this.size*this.size){
            
            return result
        }
        result = this.voxels[id]
        
        return result
    }
    
}

export function add_voxel(mesh : Mesh, chunk : Chunk, coords : Vector3, type : voxel_type){

}