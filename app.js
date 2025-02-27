const path = require("path");

const express = require("express");
const mongoose = require("mongoose");
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const { graphqlHTTP } = require('express-graphql');
const graphqlSchema = require('./graphql/schema');
const graphqlResolver =  require('./graphql/resolvers');
const cors = require( `cors` );

const bodyParser = require("body-parser");
const resolvers = require("./graphql/resolvers");
const auth = require('./middleware/auth');
const { clearImage } =  require('./util/file');
const app = express();

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'images');
  },
  filename: (req, file, cb) => {
        cb(null, uuidv4())
  }
});

const fileFilter = (req, file, cb) => {
    if(
    file.mimetype === 'image/png' ||
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg'
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
  if(req.method === 'OPTIONS'){
    return res.sendStatus(200);
  }
  next();
});

app.use(auth);
app.use( cors() );

app.put('/post-image',(req, res, next) => {
  if(!req.isAuth){
    throw new Error('Not authenticated!');
  }
  if(!req.file){
    return res.status(200).json({message: 'No file provided'});
  }
  if(req.body.oldPath){
    clearImage(req.body.oldPath);
  }
  return res.status(201).json({success:true, message:'file stored',filePath:req.file.path.replace('\\','/')})
});

app.use('/graphql', graphqlHTTP({
    schema: graphqlSchema,
    rootValue: graphqlResolver,
    graphiql: true,
    
    customFormatErrorFn(err){
    if(!err.originalErr){
        return err;
      }
    const data = err.originalErr.data;
    const message = err.message || 'An error occurred';
    const code = err.originalErr.statusCode || 500;
    return { message: message, data: data, code: code };
    }

}));

app.use((error, req, res, next) => {
  console.log(error);
  const status = error.statusCode || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(
    "mongodb+srv://bunty:4ozHNDozysKXwaMc@cluster0.accgv.mongodb.net/messages?w=majority&appName=Cluster0"
  )
  .then(result => {
    app.listen(8080);
  })
  .catch(err => console.log(err));
  