const express = require("express");  
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const routes = require('./routes');
const bodyParser = require('body-parser')
dotenv.config() 

const app = express()  
const port = process.env.PORT || 3000 

app.use(bodyParser.json())
routes(app);  

mongoose.connect(`${process.env.MONGO_DB}`)  //link db
.then(() => {
console.log('Connect Db success!')
})
.catch((err) => {
console.log(err)
})

app.listen(port, () => {  
console.log('Server is running in port:', + port)  
})  