//require('dotenv').config({path: './env'})

import dotenv from "dotenv"
import connectDB from "./db/index.js"

// in this nicer approach we import from the DB file and only execute here. 
// better


dotenv.config({
    path: './env'
})


connectDB()







// ye wala approach is thik thak and everything in here only in index.js

/*

import express from "express"
const app = express()


// using iife here is very nice
// immediately invoked function expression
//()()

( async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URI}/$
            {DB_NAME}`)
            app.on("error", (error) => {
                console.log("ERROR", error);
                throw error
            })

           app.listen(process.env.PORT, () => {
            console.log(`App is listning on port 
                 ${process.env.PORT}`);
            
           }) 
    } catch (error) {
        console.error("ERROR:", error)
        throw err
    }
})()

*/