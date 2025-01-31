const path = require("path");
const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer');

const bodyParser = require("body-parser");


const feedRoutes = require("./routes/feed");

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '-' + file.originalname);
    }
});

const fileFilter = (req, file, cb) => {
    if(
        file.mimeType === 'image/png' ||
        file.mimeType === 'image/jpg' ||
        file.mimeType === 'image/jpeg' 
    ){
        cb(null, true);
    }else{
        cb(null, false);
    }
}

// app.use(bodyParser.urlencoded()); // <--- x-www-form-urlencoded  <---- <form>
app.use(bodyParser.json()); //<-----application/json
app.use(multer({ storage: fileStorage, fileFilter: fileFilter }).single('image'))
app.use('/images', express.static(path.join(__dirname, 'images')));

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "OPTIONS, GET, POST, PUT, PATCH, DELETE"
  );
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use("/feed", feedRoutes);

app.use((err,req,res,next)=>{
    console.log(err);
    const status = err.statusCode || 500;
    const message = err.message;
    res.status(status).json({message:message});
})

mongoose
  .connect(
    "mongodb+srv://bunty:4ozHNDozysKXwaMc@cluster0.accgv.mongodb.net/messages?w=majority&appName=Cluster0"
  )
  .then((result) => {
    app.listen(8080);
  })
  .catch((err) => {
    console.log(err);
  });
