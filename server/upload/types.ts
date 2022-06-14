import { UploadApiResponse } from "cloudinary"
import { normalizeResult } from "server/utils/helpers"

export interface fileOptions {
    folder ?: string,
    override ?: boolean
}

export interface uploadOptions extends fileOptions { 
    checkDataIntegrity ?: boolean,
}

export interface renameFileOptions{
    sourceFolder ?: string,
    destFolder ?:string,
    folder  ?: string
}

export interface signatureOptions {
    public_id : string,
    version   : number
}
export interface uploadOption { 
    vedioFolder  : string,
    imageFolder : string
}

export interface uploadFilesResponse{
    images : normalizeResult<UploadApiResponse> | [],
    vedios : normalizeResult<UploadApiResponse> | []
}

export interface file {
    path : string,
    type : 'image' | 'vedio'
}


export interface queryOptions {
    max_results ?: number,
    next_cursor ?: string,
    resource_type : 'image' | 'video' | 'raw'
}

