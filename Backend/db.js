const mongoose=require('mongoose');
const connectToMongo=async()=>{
    try
    {
        await mongoose.connect('mongodb://localhost:27017/HeartPrediction');
        console.log("Db connected Successfully")
    }
    catch(error)
    {
        console.error('Error connecting to Mongodb',error);
    }
}
module.exports=connectToMongo;