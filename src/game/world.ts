import { 
    Vector3,
    Mesh,
    VertexData,
    Scene,
    StandardMaterial
 } from "@babylonjs/core";
import type { voxel_face, Nullable, voxel_geometry_ids, voxel_type}  from "./voxel";

import { Chunk } from "./chunk";

//Workflow we set voxel only active on border (where "air" and "earth" meet)


export class VoxelWorld {

    chunk_size : number
    chunks : Array<Chunk>
    
    constructor(chunk_size : number){
        this.chunk_size = chunk_size
        this.chunks = []
        this.chunks.push(new Chunk(chunk_size))
    }
    generate_voxels(algorithm : (x : number, y : number, z : number) => Nullable<voxel_type>){
        this.chunks[0].generate(algorithm)
    }

    generate_geometry(scene : Scene){

        let mesh = new Mesh("world", scene)
        let positions : Array<number> = []
        let indices : Array<number> = []
        let normals : Array<number> = []
        let uvs : Array<number> = []
        let vertex_Data = new VertexData()

        for (let x=0; x<this.chunk_size; x++){
            for(let y = 0; y< this.chunk_size; y++){
                for(let z = 0; z < this.chunk_size; z++){
                    let vox = this.get_voxel(x,y,z)
                    if(vox){
                        // console.log("vox found")
                        let vox_pos = new Vector3(x,y,z)
                        faces.forEach((face : voxel_face) => {
                            this.check_face(face, vox_pos, positions, indices, uvs)
                        })
                        // let f = faces[5]
                        // this.check_face(f, vox_pos, positions, indices)
                    }
                }
            }
        }

        vertex_Data.positions = positions
        vertex_Data.indices = indices
        vertex_Data.applyToMesh(mesh)
        mesh.material = new StandardMaterial("mat", scene)
        mesh.material.backFaceCulling = false
        mesh.position.x -= this.chunk_size/2
        mesh.position.z -= this.chunk_size/2
        return mesh
    }
    check_face(face : voxel_face, vox_pos : Vector3, positions : Array<number>, indices : Array<number>, uvs : Array<number>){
        // console.log("check direction")
        let n = new Vector3(vox_pos.x+face.direction.x, vox_pos.y+face.direction.y, vox_pos.z+face.direction.z)
        // console.log(`x : ${n.x}, y : ${n.y}, z : ${n.z}`)
        let n_vox = this.get_voxel(n.x,n.y,n.z)
        
        if(n_vox == null){
            // console.log("no neighbour confirmed")
            this.create_plane(vox_pos, face, positions, indices)
        }else {
            // console.log("neighbour confirmed, do not generate plane")
        }
    }
    set_voxel(x : number,y : number,z : number, type : Nullable<voxel_type>){
        let id = x * this.chunk_size * this.chunk_size + y * this.chunk_size + z
        this.chunks[0].voxels[id] = type
    }
    get_voxel(x : number, y : number, z : number) : Nullable<voxel_type>{
        let id = x * this.chunk_size * this.chunk_size + y * this.chunk_size + z
        
        if (id < 0){
            
            return null
        }
        if (id > this.chunk_size*this.chunk_size*this.chunk_size){
            
            return null
        }
        return this.chunks[0].voxels[id]
    }
    create_plane(vox_pos : Vector3, face : voxel_face, positions : Array<number>, indices : Array<number>){
        let indices_offset = (indices.length/6)*4

        face.corners.forEach((corner : Vector3) => {
            positions.push(vox_pos.x+corner.x, vox_pos.y+corner.y, vox_pos.z+corner.z)
        })
        indices.push(
            indices_offset, indices_offset+1, indices_offset+2,
            indices_offset+3, indices_offset, indices_offset+2
        )
        // uvs.push()
    }
    update_geometry(scene : Scene) : Promise<Mesh>{
        let p : Promise<Mesh> = new Promise((resolve) => {
            let mesh = this.generate_geometry(scene)
            resolve(mesh)
        })
        return p
    }

}

const faces : Array<voxel_face>= [
    {
        direction : new Vector3(1,0,0), //right (x axis is defined as right), (works)
        corners : [
            new Vector3(1,0,0),
            new Vector3(1,0,1),
            new Vector3(1,1,1),
            new Vector3(1,1,0)
        ],
        uvs : [
            [0, 1],
            [0, 0],
            [1, 1],
            [1, 0]
        ]
    },
    {
      direction : new Vector3(-1, 0, 0), //left (works)
      corners : [
          new Vector3(0, 0, 0),
          new Vector3(0, 0, 1),
          new Vector3(0, 1, 1),
          new Vector3(0, 1, 0)
      ],
      uvs : [
        [0, 1],
        [0, 0],
        [1, 1],
        [1, 0]
      ]  
    },
    {
        direction : new Vector3(0, 1, 0), //up (works)
        corners : [
            new Vector3(0, 1, 0),
            new Vector3(1, 1, 0),
            new Vector3(1, 1, 1),
            new Vector3(0, 1, 1)
        ],
        uvs : [
            [0, 1],
            [0, 0],
            [1, 1],
            [1, 0]
        ]  
    },
    {
        direction : new Vector3(0, -1, 0), //down (works)
        corners : [
            new Vector3(0,0,0),
            new Vector3(1,0,0),
            new Vector3(1,0,1),
            new Vector3(0,0,1)
        ],
        uvs : [
            [0, 1],
            [0, 0],
            [1, 1],
            [1, 0]
          ]  
    },
    {
        direction : new Vector3(0,0,1), //forward (works)
        corners : [
            new Vector3(0,0,1),
            new Vector3(0,1,1),
            new Vector3(1,1,1),
            new Vector3(1,0,1)
        ],
        uvs : [
            [0, 1],
            [0, 0],
            [1, 1],
            [1, 0]
          ]  
    },
    {
        direction : new Vector3(0,0,-1), //backward (works)
        corners : [
            new Vector3(0,0,0),
            new Vector3(0,1,0),
            new Vector3(1,1,0),
            new Vector3(1,0,0)
        ],
        uvs : [
            [0, 1],
            [0, 0],
            [1, 1],
            [1, 0]
          ]  
    }
]

export function create_test_plane(scene : Scene){
    console.log("create test plane")
    let chunk_mesh = new Mesh("chunk_0", scene)

    let positions : Array<number> = []
    let indices : Array<number> = []
    let normals : Array<number> = []
    let vertex_Data = new VertexData()
    
    let vf = faces[1]

    for (const pos of vf.corners){
        positions.push(pos.x, pos.y, pos.z)
    }
    indices.push(
        0, 1, 2,
        3, 0, 2
        )

    vertex_Data.positions = positions
    vertex_Data.indices = indices
    vertex_Data.applyToMesh(chunk_mesh)
    chunk_mesh.material = new StandardMaterial("mat", scene)
    chunk_mesh.material.backFaceCulling = false


    return chunk_mesh
}

