"use client"
import RightSidebar from './components/RIghtSidebar';
import Sidebar from './components/Sidebar';
import Table from './components/Table';
import { OptionDataProvider } from './useStore';

export default function ListingPage() {
  return (
    <div>
      <OptionDataProvider>
        <Sidebar />
        <Table />
        <RightSidebar />
      </OptionDataProvider>
    </div>
  )
}
