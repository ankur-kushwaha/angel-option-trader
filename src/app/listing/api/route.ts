import { NextApiRequest } from "next";
import { getDbData } from "./db";
import { Instrument, Quote } from "./types";
import { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { SMART_API_KEY } from "@/constants/config";

const axios = require('axios');

async function getData(exchangeTokens:{
  NFO?: string[];
  BSE?: string[];
  NSE?: string[];
}){
  var data = JSON.stringify({
    "mode": "FULL", 
    "exchangeTokens": exchangeTokens
  });
  const token = cookies().get('token')?.value;
  
  var config = {
    method: 'post',
    url: 'https://apiconnect.angelbroking.com/rest/secure/angelbroking/market/v1/quote/',
    headers: {
      'X-PrivateKey': SMART_API_KEY,
      'Accept': 'application/json, application/json',
      'X-SourceID': 'WEB, WEB',
      'X-ClientLocalIP': 'CLIENT_LOCAL_IP',
      'X-ClientPublicIP': 'CLIENT_PUBLIC_IP',
      'X-MACAddress': 'MAC_ADDRESS',
      'X-UserType': 'USER',
      'Authorization': 'Bearer '+token,
      'Content-Type': 'application/json'
    },
    data: data
  };

  let response = await axios(config)
    .then(function (response: any) {
      // console.log(JSON.stringify(response.data));
      return response.data
    })
    .catch(function (error: any) {
      console.log(error);
    });
    return response
}


async function getStockOptions(stockCode:string,multiple:number,threshold:number){
  const ltp = await getLtp(stockCode);
  let upperStrike = ltp - (threshold/100)*ltp

  const filter = {
    'name': stockCode, 
    'exch_seg': 'NFO', 
    'instrumenttype': 'OPTSTK',
  };
  let data:Instrument[] = await getDbData(filter);

  let newData = data.filter(item=>{
    let strikePrice = Number(item.strike)/100;
    return strikePrice < upperStrike && item.symbol.endsWith('PE') && strikePrice%multiple == 0;
  }).map(item=>{
    return {
      ...item,
      strike: Number(item.strike)/100,
      stockLtp:ltp
    }
  }).sort((a,b)=>-a.strike+b.strike)
  // console.log(data);
  return newData
} 

type GetReturnTypeInPromise<T> = T extends (
  ...args: any[]
) => Promise<(infer Argument)>
  ? Argument
  : never

type GetStockOptionsRetrunType = GetReturnTypeInPromise<typeof getStockOptions>[0]

async function getToken(stockCode:string){
  const filter = {
    'symbol': stockCode, 
  };
  let data = await  getDbData(filter)
  return data[0].token;
}

async function getLtp(stockCode:string){
  let token = await getToken(stockCode);
  let data = await getData({
    BSE: [token+""],
  });
  return data.data.fetched[0].ltp;
}

function getTop10Elements(data:any[]){
  return data.slice(0,10);
}

async function getPremium(item:GetStockOptionsRetrunType){
  let data = await getData({
    "NFO": [item.token+""]
  });

  let quote:Quote = data.data.fetched[0];
  let premium = quote.depth.buy[0].price * Number(item.lotsize);
  
  return {
      tradingSymbol:quote.tradingSymbol,  
      premium,
      expiry:item.expiry,
      stockLtp:item.stockLtp,
      strike:item.strike,
      lotSize:item.lotsize,
      depth:{
        buy:quote.depth.buy[0],
        sell:quote.depth.sell[0]  
      },
  }
}

export type Premium = GetReturnTypeInPromise<typeof getPremium>

export async function GET(request: NextRequest ) {

  const searchParams = request.nextUrl.searchParams
  searchParams.get('stockCode')
  
  let stockCode =  (searchParams.get('stockCode')||'PFC') as string;
  let multiple = Number(searchParams.get('multiple'))||5;
  let threshold = Number(searchParams.get('threshold'))|| 10;

  const options = await getStockOptions(stockCode,multiple,threshold);
  let topOtions = getTop10Elements(options);


  let data = await Promise.all(topOtions.map(getPremium));
  data = data.sort((a,b)=>b.premium-a.premium)
  return Response.json({ data})
}