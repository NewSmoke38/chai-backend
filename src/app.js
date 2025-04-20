import express from "express"
import cors from "cors";
import cookieParser from "cookie-parser"


const app = express()

// some express configurations

// app.use is used for mainly configurations and middleware
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// here we set a limit to how much JSON we can recieve 
app.use(express.json({limit: "16kb"}))    // middleware is needed for JSON 

// getting req from a url
app.use(express.urlencoded({extended: true, limit: "16kb"}))   // extended here makes the url have nested objects also, its a powerful thing man

// for storing public kinda stuff so that anyone can use it, pdfs, images and all
app.use(express.static("public"))

app.use(cookieParser())
export { app }