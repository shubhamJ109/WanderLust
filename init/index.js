const mongoose = require("mongoose");
const indata = require("./data.js");
const Listing = require("../models/listing");

async function main(){
    await mongoose.connect("mongodb://127.0.0.1:27017/WanderLust");
}
main().then(()=>{
    console.log("data inserted successfully (b)");
}).catch((err)=>{
    console.log("error occurred while inseting data (b)");
});

const initB = async()=>{
    await Listing.deleteMany({}); // clear previous data form databse wanderlust 
    indata.data = indata.data.map((obj)=>({
    ...obj,
    owner:"683eeada6840524dc24e2e66"
    }));
    await Listing.insertMany(indata.data);
    console.log("data was Initilized ");
    
};

initB();