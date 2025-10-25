import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI as string;


if(!MONGODB_URI)
{
    throw new Error("Please provide the Database Url in env file!!")

}

let cashed = global.mongoose;

if(!cashed) {
   cashed=  global.mongoose = {conn: null, promise: null}
}

export async function connDB(){
    if(cashed.conn){
        return cashed.conn
    }

    if(!cashed.promise){
        mongoose
        .connect(MONGODB_URI)
        .then(() => mongoose.connection)
    }
    try {
        cashed.conn = await cashed.promise
    } catch (error) {
        cashed.promise = null
        throw error
    }
    return cashed.conn
}
