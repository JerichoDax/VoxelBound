import { voxel_type, Nullable } from "./voxel";


export function generation_algorithm() {

}

export function simple_1D_sinus(x : number, y : number, z : number) : Nullable<voxel_type>{
    let t = Math.abs(Math.round(Math.sin(y)))
    if (t == 1){
        return voxel_type.earth
    }else {
        return voxel_type.air
    }
}
export function simple_flat_plane(x : number, y : number, z : number) : Nullable<voxel_type>{

    if(y == 0){
        
        return voxel_type.earth
    }else {
        return null
    }

}
export function empty(x : number, y : number, z : number){
    return null
}
export function simple_x_plane(x : number, y : number, z : number) : Nullable<voxel_type>{
    if(x == 1){
        return voxel_type.earth
    }else {
        return voxel_type.air
    }
}
export function single_voxel(x : number, y : number, z : number) : Nullable<voxel_type> {
    if(x == 1 && y == 1 && z == 1){
        return voxel_type.earth
    }
    return voxel_type.air
}
export function sinus(x : number, y : number, z : number) : Nullable<voxel_type> {
    if(y == 0){
        return voxel_type.earth
    }
    if(y == 1 && x % 2 == 0 && z > 0){
        return voxel_type.earth
    }
    
    return null
}