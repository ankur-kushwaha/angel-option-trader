
import { useRouter, useSearchParams } from 'next/navigation';
// import { useRouter } from 'next/router';
import React, { useEffect } from 'react'


export default function RightSidebar() {
  const searchRef = React.useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();
  const router = useRouter()
  // const { data: optionsData, deleteItem } = useStore();
  const [optionStocks,setOptionStocks] = React.useState<string[]>([]);
  useEffect(()=>{
    let data  = JSON.parse(window.localStorage.getItem('OptionStocks')||"[]")
    setOptionStocks(data)
  },[])

  function deleteItem(item: string) {
    let newOptionStocks = optionStocks.filter((i)=>i!=item)
    setOptionStocks(newOptionStocks)
    window.localStorage.setItem('OptionStocks', JSON.stringify(newOptionStocks));
  }

  function handleAdd(){
    let stockCode = searchRef.current?.value||"";
    if(!stockCode) return;
    let newOptionStocks = [...new Set([...optionStocks,stockCode])]  
    window.localStorage.setItem('OptionStocks', JSON.stringify(newOptionStocks));
    setOptionStocks(newOptionStocks);
    searchRef.current!.value = "";
  }


  function handleClick(item: string) {
    let [stockCode] = item.split("|");
    router.push('/listing?stockCode=' + stockCode + '&multiple=' + (5) + '&threshold=' + (5))
  }

  return (
    <aside id="" className="" aria-label="Sidebar">

      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <div>
          <label htmlFor="default-search" className="mb-2 text-sm font-medium text-gray-900 sr-only dark:text-white">Search</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg className="w-4 h-4 text-gray-500 dark:text-gray-400" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 20">
                <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" />
              </svg>
            </div>
            <input ref={searchRef} type="search" id="default-search" className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="" required />
            <button type="submit" className="text-white absolute right-2.5 bottom-2.5 bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800" onClick={handleAdd}>Add</button>
          </div>
        </div>
        <ul className="space-y-2 font-medium">
          {optionStocks.map((item, index) => {
            // let [stockCode, multiple, threshold] = item.split("|");
            return <li key={index} onClick={() => handleClick(item)}>
              <a href="#" className="flex flex-row items-center justify-between p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <div className='flex flex-col'>
                  <span className="">{item} </span>
                </div>
                <div className='bg-slate-300 h-full px-2 ' onClick={() => deleteItem(item)}>
                  <span className='text-xs' >X</span>
                </div>
              </a>
            </li>

          })}

        </ul>

      </div>
    </aside>

  )
}
