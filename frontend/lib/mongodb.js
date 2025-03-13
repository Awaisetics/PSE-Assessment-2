// lib/mongodb.js
import { MongoClient } from "mongodb"

if (!process.env.MONGODB_URI) {
    throw new Error("Please add your Mongo URI to .env.local")
}

const uri = process.env.MONGODB_URI
let client
let clientPromise

if (!global._mongoClientPromise) {
    client = new MongoClient(uri)
    global._mongoClientPromise = client.connect()
}
clientPromise = global._mongoClientPromise

export default clientPromise
