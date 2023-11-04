
import { useRouter, useSearchParams } from 'next/navigation';
// import { useRouter } from 'next/router';
import React, { useEffect } from 'react'
import { OptionData, useStore } from '../useStore';


export default function Sidebar() {

  // const [optionsData, setOptionsData] = React.useState<OptionData>({});
  const searchParams = useSearchParams();
  const router = useRouter()
  const {data:optionsData,deleteItem} = useStore();
  

  function handleClick(item: string) {
    let [stockCode, multiple, threshold] = item.split("|");
    router.push('/listing?stockCode=' + stockCode + '&multiple=' + multiple + '&threshold=' + threshold)
  }


  return (
    <aside id="default-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen transition-transform -translate-x-full sm:translate-x-0" aria-label="Sidebar">
      <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
        <ul className="space-y-2 font-medium">
          {Object.keys(optionsData).sort((a,b)=>new Date(optionsData[b]?.createdAt||"").getTime()-new Date(optionsData[a]?.createdAt||"").getTime()).map((item, index) => {
            let [stockCode, multiple, threshold] = item.split("|");
            return <li key={index} onClick={() => handleClick(item)}>
              <a href="#" className="flex flex-row items-center justify-between p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                <div className='flex flex-col'>
                  <span className="">{stockCode} </span>
                  <span className=" text-xs text-gray-500 dark:text-gray-400">Multiple: {multiple}</span>
                  <span className=" text-xs text-gray-500 dark:text-gray-400">Threshold: {threshold}</span>
                  <span className=" text-xs text-gray-500 dark:text-gray-400">Premium: {optionsData[item]?.data[0].premium}</span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">{new Date(optionsData[item]?.createdAt||"").toLocaleString()}</span>
                </div>
                <div className='bg-slate-300 h-full p-4' onClick={()=>deleteItem(item)}>
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
