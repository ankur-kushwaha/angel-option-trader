"use client"
import RightSidebar from './components/RIghtSidebar';
import Sidebar from './components/Sidebar';
import Table from './components/Table';
import { OptionDataProvider } from './useStore';

export default function ListingPage() {
  return (
    <div>
      <OptionDataProvider>
        <div className='flex flex-col lg:flex-row'>
          <Sidebar />
          <div className='lg:hidden'>
            <RightSidebar />
          </div>
          <div className='flex-1'>
            <Table />
          </div>
          <div className='hidden lg:block'>
            <RightSidebar />
          </div>
        </div>
      </OptionDataProvider>
    </div>
  )
}
