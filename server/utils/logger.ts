import logger from 'jet-logger';

export function logDevError(content: any, printFull?: boolean | undefined){
    if(process.env.NODE_ENV === "development") logger.err(content,printFull)
}