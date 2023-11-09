import { useSearchParams } from 'next/navigation'
import React from 'react'
import { useStore } from '../useStore'

export default function Table() {
  const searchParams = useSearchParams()
  const {data,appendData} = useStore();
  const stockCode = searchParams.get('stockCode')
  const multiple = searchParams.get('multiple')||10
  const threshold = searchParams.get('threshold')||5
  
  let key = `${stockCode}|${multiple}|${threshold}`

  function handleRefresh(){

    if(!stockCode){
      return;
    }

    fetch(`/listing/api?stockCode=${stockCode}&multiple=${multiple}&threshold=${threshold}`).then(res => res.json()).then(data => {
      appendData(key,data.data)
    })
  }

  async function handleRefreshAll(){

    let data  = JSON.parse(window.localStorage.getItem('OptionStocks')||"[]")
    for(let stockCode of data){
      await fetch(`/listing/api?stockCode=${stockCode}&multiple=5&threshold=5`)
      .then(res => res.json()).then(data => {
        let key = `${stockCode}|5|5`
        appendData(key,data.data)
      })
    }
  }

  return (
    <section className="bg-gray-50 dark:bg-gray-900 p-3 sm:p-5">
        <div className="mx-auto max-w-screen-xl px-4 lg:px-12">
          <div className="bg-white dark:bg-gray-800 relative shadow-md sm:rounded-lg overflow-hidden">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-3 md:space-y-0 md:space-x-4 p-4">
              <div className="w-full md:w-1/2">
                <form className="flex items-center">
                  <label htmlFor="simple-search" className="sr-only">Search</label>
                  <div className="relative w-full">
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <svg aria-hidden="true" className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                        <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <input type="text" id="simple-search" className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 p-2 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-primary-500 dark:focus:border-primary-500" placeholder="Search" required />
                  </div>
                </form>
              </div>
              <div className="w-full md:w-auto flex flex-col md:flex-row space-y-2 md:space-y-0 items-stretch md:items-center justify-end md:space-x-3 flex-shrink-0">
                <button onClick={handleRefresh} type="button" className="flex items-center justify-center bg-primary-700 hover:bg-primary-800 ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                  <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                  </svg>
                  Refresh
                </button>
                <button onClick={handleRefreshAll} type="button" className="flex items-center justify-center bg-primary-700 hover:bg-primary-800 ring-4 focus:ring-primary-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-primary-600 dark:hover:bg-primary-700 focus:outline-none dark:focus:ring-primary-800">
                  <svg className="h-3.5 w-3.5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                    <path clipRule="evenodd" fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" />
                  </svg>
                  Refresh All
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
                <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
                  <tr>
                    <th scope="col" className="px-4 py-3">Trading symbol</th>
                    <th scope="col" className="px-4 py-3">Premium</th>
                    <th scope="col" className="px-4 py-3">Expiry</th>
                    <th scope="col" className="px-4 py-3">Lotsize</th>
                    <th scope="col" className="px-4 py-3">LTP</th>
                    <th scope="col" className="px-4 py-3">Strike</th>
                    <th scope="col" className="px-4 py-3">Breakeven</th>
                  </tr>
                </thead>
                <tbody>
                  {data[key]?.data.map((item, index) => {
                    return <tr key={index} className="border-b dark:border-gray-700">
                      <th scope="row" className="px-4 py-3 font-medium text-gray-900 whitespace-nowrap dark:text-white">{item.tradingSymbol}</th>
                      <td className="px-4 py-3">{item.premium}</td>
                      <td className="px-4 py-3">{item.expiry}</td>
                      <td className="px-4 py-3">{item.lotSize}</td>
                      <td className="px-4 py-3">{item.stockLtp}</td>
                      <td className="px-4 py-3">{item.strike}</td>
                      <td className="px-4 py-3">{((item.stockLtp - (item.strike - item.depth.buy.price))*100/item.stockLtp).toFixed(2)}</td>
                    </tr>
                  })

                  }
                </tbody>
              </table>
            </div>
           
          </div>
        </div>
      </section>
  )
}
