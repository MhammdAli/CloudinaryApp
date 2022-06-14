import { fork } from "child_process"; 
export function sendFilesToClean(files){
    const process = fork('server/proccesses/cleaner/index.js');
    process.send(JSON.stringify(files))
}


