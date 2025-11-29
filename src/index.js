const express = require("express");  
const dotenv = require('dotenv')  
dotenv.config() 

const app = express()  
const port = process.env.PORT || 3001 

app.get('/', (req, res) => {  
    res.send('Hello World!')
})  

console.log('process.env.MONGO_DB', process.env.MONGO_DB)
mongoose.connect(`mongodb+srv://lttd:$${process.env.MONGO_DB}`)
.then(() => {
console.log('Connect Db success!')
})
.catch((err) => {
console.log(err)
})

app.listen(port, () => {  
console.log('Server is running in port:', + port)  
})  