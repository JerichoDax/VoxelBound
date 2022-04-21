import type { Vector3 } from "@babylonjs/core";

export type Nullable<T> = null | T

export type voxel_geometry_ids  = {
    vertices_positions_ids : Array<number>
    indices_ids : Array<number>
}

export interface voxel_face {
    direction : Vector3,
    corners : Array<Vector3>,
    uvs : Array<Array<number>>
}

export enum voxel_type {
    air=0,
    earth=1
}

export interface voxel {
    active : boolean,
    type : voxel_type
}

export function create_chunk(){
    
}
