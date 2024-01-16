import { MongoClient } from 'mongodb'
const uri = process.env.MONGODB_URI || ""
const client = new MongoClient(uri)
export default async function connectToDatabase() {
  await client.connect()
  return client.db('test')
}