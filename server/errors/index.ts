import { HttpError } from 'http-errors';
import type {NextApiRequest,NextApiResponse} from 'next';
import { logDevError } from 'server/utils/logger';

export const noMatchApiHandler = (req : NextApiRequest, res : NextApiResponse)=>{  
    res.status(404).json({
        name : "NOT_MATCH",
        message : `can't ${req.method}`
    })
}

export const errorHandler = (err : HttpError,req : NextApiRequest ,res : NextApiResponse )=>{
    logDevError(err,true);
    const status = err.status || 500;
    const stack = process.env.NODE_ENV === "development" ? err.stack : []
    
    res.status(status).json({
        name : err.name,
        message : err.message,
        stack
    })
}