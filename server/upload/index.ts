import { sendFilesToClean } from 'server/proccesses/cleaner/start';
import { file, queryOptions, signatureOptions, uploadFilesResponse, uploadOption, uploadOptions} from 'server/upload/types';
import cloudenary,{API_SECRET,defaultUploadOptions} from 'server/upload/config';
import {ResourceApiResponse, UploadApiResponse} from 'cloudinary';
import { defaultValue, eq, has, isEmptyArray, get, isEmptyString, normalizeSettledPromise, normalizeResult, isUndefined } from 'server/utils/helpers';

export enum uploadErrors {
    INVALID_SIGNATURE = "INVALID_SIGNATURE"
}

function checksignature(signatureOption : signatureOptions,uploadedSignature : string) : void{ 
    const signature = cloudenary.utils.api_sign_request(signatureOption,API_SECRET as string) 
    if(!eq(signature,uploadedSignature)) throw {name : uploadErrors.INVALID_SIGNATURE,message : 'invalid signature'}
}


export async function uploadImage(file : string,uploadOption ?: uploadOptions) : Promise<UploadApiResponse>{
    console.log(file,uploadOption)
    try{
        const images : UploadApiResponse = await cloudenary.uploader.upload(file,{
            ...defaultUploadOptions,
            folder : uploadOption?.folder,
            overwrite : defaultValue(uploadOption?.override,true)
        })
        
        if(uploadOption?.checkDataIntegrity){
            checksignature({
                public_id : images.public_id,
                version   : images.version
            },images.signature);
        } 

        return Promise.resolve(images);

    }catch(err){
        return Promise.reject(err);
    }
}

 
export async function uploadImages(files : string[],uploadOption ?: uploadOptions) : Promise<normalizeResult<UploadApiResponse>>{
     
    const images : Promise<UploadApiResponse>[] = files.map((file : string)=>uploadImage(file,uploadOption));
    
    try{ 
        const uploadedImages : PromiseSettledResult<UploadApiResponse>[] = await Promise.allSettled<Promise<UploadApiResponse>[]>(images);

        return Promise.resolve(normalizeSettledPromise(uploadedImages));

    }catch(err){
        return Promise.reject(err);
    }
    
} 

export function isVedio(file : string) : boolean{
    return /^.*\.(mp4|MOV)$/i.test(file);
}

export function isImage(file : string) : boolean{
    return /^.*\.(jpg|png|gif|jpeg)$/i.test(file);
}

export async function uploadVedio(file : string,uploadOption ?: uploadOptions) : Promise<UploadApiResponse>{

   // console.log(file)
    // if(!isVedio(file)) return Promise.reject({
    //     message: "Invalid vedio file",
    //     name: "Error",
    //     http_code : 400
    // })
    
    try{

        const vedio : UploadApiResponse = await cloudenary.uploader.upload(file,{
            resource_type : 'video',
            use_filename : true, 
            unique_filename : true,
            folder : uploadOption?.folder
        })

        if(uploadOption?.checkDataIntegrity){
            checksignature({
                public_id : vedio.public_id,
                version   : vedio.version
            },vedio.signature);
        }
        
        return Promise.resolve(vedio);
    }catch(err){
        return Promise.reject(err);
    }

}

export async function uploadVedios(files : string[],uploadOption ?: uploadOptions) : Promise<normalizeResult<UploadApiResponse>>{
    
    try{ 
        const vedios : Promise<UploadApiResponse>[] = files.map((file)=>uploadVedio(file,uploadOption));
        const uploadedVedios = await Promise.allSettled<Promise<UploadApiResponse>>(vedios);
        return Promise.resolve(normalizeSettledPromise(uploadedVedios));
    }catch(err){
        return Promise.reject(err);
    }
    
}

 

export async function uploadFiles(files : file[],options : uploadOption ) : Promise<uploadFilesResponse>{
 
 

    const [images,vedios] = files.reduce((acc : [string[],string[]],file : file)=>{
        acc[file.type === 'image' ? 0 : 1].push(file.path);
        return acc; 
    },[[],[]]);

    try{
       const result = await Promise.allSettled([uploadImages(images,{folder : options.imageFolder}),uploadVedios(vedios,{folder : options.vedioFolder})]);

       sendFilesToClean(files.map((file)=>file.path))
       console.log('resource is cleaning right now and by pass it')
       return Promise.resolve({
           images : result[0].status === 'fulfilled' ? result[0].value : [],
           vedios : result[1].status === 'fulfilled' ? result[1].value : [] 
       });

       
    }catch(err){
       sendFilesToClean(files.map((file)=>file.path))
       return Promise.reject(err);
    }

     

}

export async function getResourcesByTag(tag : string,query : queryOptions) : Promise<ResourceApiResponse>{
    try{
       const tags : ResourceApiResponse = await cloudenary.api.resources_by_tag(tag,query);
       if(!has(tags,'resources')) throw tags;
       return Promise.resolve(tags);
    }catch(err){
        return Promise.reject(err);
    }
}

export async function getTags(query : queryOptions) : Promise<any>{

    try{
       const result = await cloudenary.api.tags(query);
       return Promise.resolve(result);
    }catch(err){
        return Promise.reject(err);
    }
}

export async function getResourcesByIds(public_ids : string[],query : queryOptions) : Promise<ResourceApiResponse| {resources : []}>{
    
    if(isEmptyArray(public_ids)) return Promise.resolve({resources : []})
  
    try{
       const resources : ResourceApiResponse = await cloudenary.api.resources_by_ids(public_ids,query);
       resources.resources
       if(!has(resources,'resources')) throw resources;

       return Promise.resolve(resources);
    }catch(err){
       return Promise.reject(err);
    }

}

export async function removeFile(public_id : string) {
    try{
        const result = await cloudenary.uploader.destroy(public_id,{
            resource_type : 'auto'
        })
        return Promise.resolve(result);
    }catch(err){
        return Promise.reject(err);
    }
}

export async function rename(from_public_id : string,to_public_id : string){
    try{
  
        const result = await cloudenary.uploader.rename(from_public_id,to_public_id,{
            resource_type : "auto"
        })
 
        if(eq(get(result,'name'),"error")) throw result;
        
        return Promise.resolve(result);
    }catch(err){
        return Promise.reject(err);
    }
}

export function getFileLink(public_id : string) : string{
    return cloudenary.utils.url(public_id);
}

