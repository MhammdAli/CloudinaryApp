import {errorHandler,noMatchApiHandler} from 'server/errors';
import nc from 'next-connect';
import next, {NextApiResponse,NextApiRequest} from 'next';
import {getTags} from 'server/upload';
import { defaultValue, In, not } from 'server/utils/helpers';
const handler = nc({
    onError : errorHandler,
    onNoMatch : noMatchApiHandler
})


handler.get(async (req : NextApiRequest,res : NextApiResponse)=>{

    const {
       maxResult,
       nextCursor,
       resource_type
    } = req.query;
   
    if(not(In(defaultValue(resource_type,'image'),['image','video','raw']))){
        throw {name : "INVALID_VALUE",message : `resource_type must be either image , vedio or raw , got ${resource_type}`}
    }

    try{
        
        const result = await getTags({
            resource_type : defaultValue(resource_type,'image'),
            max_results : defaultValue(maxResult,10),
            next_cursor : nextCursor as string
        });

        res.json(result);
    }catch(err){
        res.json(err);
    }
 
})





export default handler;

