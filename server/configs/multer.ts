import multer from 'multer';  
import {isImage, isVedio} from 'server/upload';

const multerUploader = multer({ 
    storage : multer.diskStorage({
        destination : 'public/images'
    }), 
    fileFilter : function(_: Express.Request, file: Express.Multer.File, callback: multer.FileFilterCallback){
        if((isVedio(file.originalname) || isImage(file.originalname))) return callback(null,true);
        callback({
            name : 'INVALID_FILE_FORMAT',
            message : 'file must be vedio or image forma'
        })
      
    },
})

export default multerUploader;