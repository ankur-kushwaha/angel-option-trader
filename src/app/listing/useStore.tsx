import React, { useEffect, useState } from 'react'
import { Premium } from './api/route';

export type OptionData = {
  [key: string]: {
    createdAt: string,
    multiple: string,
    threshold: string,
    stockCode: string,
    data: Premium[]
  }|undefined
}

type OptionContextProps = {
  data:OptionData,
  setData: any,
  deleteItem: (item: string) => void,
  appendData: (key: string, data: Premium[]) => void
}

const OptionsDataContext = React.createContext<OptionContextProps>({} as OptionContextProps);

export function OptionDataProvider({children}: {children: React.ReactNode}){

  const [data, setData] = useState<OptionData>({});
  
  function deleteItem(item: string) {
    let optionData = JSON.parse(window.localStorage.getItem('optionData') || "{}");
    delete optionData[item];
    setData(optionData)
    window.localStorage.setItem('optionData', JSON.stringify(optionData));
  }

  useEffect(() => {
    let optionData = JSON.parse(window.localStorage.getItem('optionData') || "{}");
    setData(optionData)
  }, [])

  function appendData(key: string, data: Premium[]) {
    let optionData = JSON.parse(window.localStorage.getItem('optionData') || "{}");
    optionData[key] = {
      createdAt: new Date().toISOString(),
      multiple: key.split("|")[1],
      threshold: key.split("|")[2],
      stockCode: key.split("|")[0],
      data
    }
    setData(optionData)
    
    window.localStorage.setItem('optionData', JSON.stringify(optionData));
  }

  return <OptionsDataContext.Provider value={{data,setData,deleteItem,appendData}}>
    {children}
  </OptionsDataContext.Provider>
}

export function useStore(){
  return React.useContext(OptionsDataContext);
}