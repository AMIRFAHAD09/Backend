const mongoose = require('mongoose');

const URI = process.env.MONGO_URI;


const connectDb = async()=>{
    try {
        await mongoose.connect(URI)
    } catch (error) {
        console.log("database connection failed.",error)
        process.exit();
    }
}
module.exports=connectDb;