
export interface Instrument {
  token: string
  symbol: string
  name: string
  expiry: string
  strike: number
  lotsize: string
  instrumenttype: string
  exch_seg: string
  tick_size: string
}

export interface Quote {
  exchange: string
  tradingSymbol: string
  symbolToken: string
  ltp: number
  open: number
  high: number
  low: number
  close: number
  lastTradeQty: number
  exchFeedTime: string
  exchTradeTime: string
  netChange: number
  percentChange: number
  avgPrice: number
  tradeVolume: number
  opnInterest: number
  lowerCircuit: number
  upperCircuit: number
  totBuyQuan: number
  totSellQuan: number
  "52WeekLow": number
  "52WeekHigh": number
  depth: Depth
}

export interface Depth {
  buy: Buy[]
  sell: Sell[]
}

export interface Buy {
  price: number
  quantity: number
  orders: number
}

export interface Sell {
  price: number
  quantity: number
  orders: number
}
