import {get, isEmptyArray, isUndefined} from 'server/utils/helpers'
import nc, { NextHandler } from 'next-connect';
import {uploadErrors,uploadFiles,uploadImage,uploadImages,uploadVedio} from 'server/upload';
import {errorHandler,noMatchApiHandler} from 'server/errors'
import type { NextApiRequest, NextApiResponse } from 'next';
import multer from 'server/configs/multer';
import {resolve} from 'path';
const handler = nc({
    onNoMatch : noMatchApiHandler,
    onError :   errorHandler,
    attachParams : true
})


export const config = {
    api: {
      bodyParser: false,
    }
}


// image / vedio / raw  
function getCloudenaryResourceType(mimeType : string) : string{
    if(/^image/i.test(mimeType)) return 'image'
    else if (/^video/i.test(mimeType)) return 'video'
    else 'raw'
}
 
handler.post(multer.array('files') as any,async (req : NextApiRequest & Express.Request ,res : NextApiResponse,next : NextHandler)=>{
     
    try{

        if(isUndefined(req.files) || isEmptyArray(req.files as [])) return next({name : 'MISSING_FILES',message : 'no file is requested',status : 422});

        // const result = await uploadImages(req.files?.map((file : Express.Multer.File)=>resolve(file.path)),{
        //     folder : "images",
        //     checkDataIntegrity : true
        // })

        const result = await uploadFiles(req.files?.map((file : Express.Multer.File)=>({
            path : resolve(file.path),
            type : getCloudenaryResourceType(file.mimetype)
        })),{
            imageFolder : 'images',
            vedioFolder : 'vedios'
        })
        
        res.json(result)
        
    }catch(err){
        res.json(err);
    }

})


export default handler;