import mongoose from "mongoose";


const ConnectDb =  async () => {
  try {
    const connectionInstence = await mongoose.connect(`${process.env.MONGODB_URI}`);
    console.log(`\n MongoDb Connected !! Db Host: ${connectionInstence}`)
  } catch (error) {

    console.log("DataBase Connection error", error)
   process.exit(1)
    
  }
}

export default ConnectDb;