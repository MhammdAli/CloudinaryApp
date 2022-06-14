import { HttpError } from 'http-errors'; 
import type { NextApiRequest, NextApiResponse } from 'next'
import { uploadFiles } from 'server/upload/index';
import {sendFilesToClean} from 'server/proccesses/cleaner/start';

 
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  
  try{
 
    
    sendFilesToClean(['file1','file','fil3'])

     res.json({name : 'Hello'})
}catch(err : any ){ 
  res
  .json(err);
}

}
