const {unlink} = require('fs');
const Directory = 'public/images/';
const {resolve} = require('path')
process.once('message',(files)=>{

    files = JSON.parse(files);
 
    if(Array.isArray(files)){
         
        files.forEach((file)=>{
            
            unlink(file,(err)=>{})
        })

    }

    

    process.exit();


})