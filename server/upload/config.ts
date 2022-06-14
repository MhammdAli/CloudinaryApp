import {isUndefined} from 'server/utils/helpers';
import {logDevError} from 'server/utils/logger';
import cloudUploader from 'cloudinary';
export const CLOUD_NAME = process.env.CLOUDENARY_CLOUDNAME;
export const API_KEY    = process.env.CLOUDENARY_API_KEY;
export const API_SECRET = process.env.CLOUDENARY_API_SECRET;

const cloudenary = cloudUploader.v2;

cloudenary.config({
    cloud_name : CLOUD_NAME,
    api_key    : API_KEY,
    api_secret : API_SECRET 
})

export const defaultUploadOptions = {
    use_filename : true,
    unique_filename : true,
    eager  : [
        {gravity: "auto:face", height: 400, width: 400, crop: "fill",fetch_format : 'png',radius : 'max'},
        {gravity: "face", height: 250, width: 600, crop: "fill",fetch_format : 'jpg',quality : 'auto:best'}
    ]
}

export default cloudenary; 

if(isUndefined(CLOUD_NAME)) logDevError('missing CLOUD_NAME in the environment variable');
if(isUndefined(API_KEY)) logDevError('missing API_KEY in the environment variable'); 
if(isUndefined(API_SECRET)) logDevError('missing API_SECRET in the environment variable'); 