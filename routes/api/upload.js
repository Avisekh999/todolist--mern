const path = require('path');
const express = require('express');
const multer = require('multer');
const router = express.Router()



const storage = multer.diskStorage({
    destination(req, file, cb){
        cb(null, 'uploads/')
    },
    filename(req,file,cb){
        cb(null,file.originalname)
    }
})

// function checkFileType(file,cb){
//     const filetypes = /jpg|jpeg|png/
//     const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
//     const mimetype = filetypes.test(file.mimetype)

//     if(extname && mimetype) {
//         return cb(null, true)
//     }else{
//         cd('Images only!')
//     }
// }


const fileFilter = (req,file,cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);

    } else{
        cb(null,false);
    }
}


const upload = multer({
    storage,
    limits:{
        fileSize: 1024 *1024 * 5
    },
    fileFilter: fileFilter
    
})

router.post('/',upload.single('image'), (req, res) => {

    res.send(req.file.path)
})


module.exports = router;