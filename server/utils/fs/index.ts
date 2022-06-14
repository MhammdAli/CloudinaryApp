import {unlink} from 'fs';
import {promisify} from 'util';
export const removeFile = promisify(unlink);
 
