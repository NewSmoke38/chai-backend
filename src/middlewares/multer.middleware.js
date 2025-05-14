import multer from "multer"



// using diskstorage not memory storage 
// here we can use destination or filename, any of em
const storage = multer.diskStorage({
  destination: function (req, file, cb) {     // here we get file now, thats why multer  is used
    cb(null, "./public/temp")
  },
  filename: function (req, file, cb) {

    cb(null, file.originalname)
  }
})

export const upload = multer({ 
    storage
 })