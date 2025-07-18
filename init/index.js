const mongoose=require("mongoose");
const initData=require("./data.js");
const listing=require("../models/listing");

const mongoUrl="mongodb://127.0.0.1:27017/wanderlust";

main()
    .then(()=>{
        console.log("connected to DB");
    })
    .catch((err)=>{
        console.log(err);
    });

async function main() {
    await mongoose.connect(mongoUrl);
}

const initDB=async()=>{
    await listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner:'6878fb0c10968d2c05532e03'}));
    await listing.insertMany(initData.data);
    console.log("data was initialised");
};

initDB();