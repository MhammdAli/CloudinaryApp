import { isArray, isEmptyArray, defaultValue, not, In } from 'server/utils/helpers';
import nc from 'next-connect';
import {getResourcesByIds} from 'server/upload';
import {errorHandler,noMatchApiHandler} from 'server/errors';
import {NextApiRequest,NextApiResponse} from 'next';

const hander = nc({
    onError : errorHandler,
    onNoMatch : noMatchApiHandler
})

hander.get(async (req : NextApiRequest,res : NextApiResponse)=>{


    const {
        resource_ids
    } = req.body;

    const { 
        resource_type
    } = req.query;


    if(!isArray(resource_ids)) throw {name : "INVALID_VALUE",message : 'resource_ids must be an array',status : 422}
    if(isEmptyArray(resource_ids)) throw {name : 'INVALID_VALUE',message : 'resource_ids must atleast contain one id , got 0',status : 422}
    if(not(In(defaultValue(resource_type,'image'),['image','video','raw']))){
        throw {name : "INVALID_VALUE",message : `resource_type must be either image , vedio or raw , got ${resource_type}`, status : 422}
    }
     
    try{

    
        const result = await getResourcesByIds(resource_ids,{
            resource_type : defaultValue(resource_type,'image')
        });

        res.json(result);

    }catch(err){
        res.json(err);
    }


})



export default hander;