import { MongoClient } from 'mongodb';
import { Instrument } from './types';
 
/*
 * Requires the MongoDB Node.js Driver
 * https://mongodb.github.io/node-mongodb-native
 */



export async function getDbData(filter:any){
 
  
  const client = await MongoClient.connect(process.env.MONGODB_URL||"");
  const coll = client.db('OptionTrader').collection('AngleInstrument');
  const cursor = coll.find(filter);
  const result = await cursor.toArray();
  await client.close();
  return result as unknown as Instrument[];
}