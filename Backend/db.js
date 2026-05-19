const mongoose=require('mongoose');
const connectToMongo=async()=>{
    try
    {
        await mongoose.connect('MONGO_URI=mongodb+srv://apicreator04_db_user:n7P1CTUTFUI3EPrY@cluster0.1vaky5o.mongodb.net/heartdisease?retryWrites=true&w=majority&appName=Cluster0');
        console.log("Db connected Successfully")
    }
    catch(error)
    {
        console.error('Error connecting to Mongodb',error);
    }
}
module.exports=connectToMongo;
