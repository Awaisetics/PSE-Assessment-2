// lib/mongodb.js
import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo URI to .env.local")
}

const uri = process.env.MONGODB_URI

let client
let clientPromise

async function createClient() {
    console.log("🔃 MongoDB: Attempting to connect...")

    try {
        client = new MongoClient(uri)
        await client.connect()
        console.log("✅ MongoDB: Successfully connected!")
        return client
    } catch (error) {
        console.error("❌ MongoDB connection error:", error)
        throw error
    }
}

if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClient()
}

clientPromise = global._mongoClientPromise

export default clientPromise
