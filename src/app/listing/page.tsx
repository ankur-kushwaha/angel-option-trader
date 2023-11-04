"use client"
import Sidebar from './components/Sidebar';
import Table from './components/Table';
import { OptionDataProvider } from './useStore';

export default function ListingPage() {
  return (
    <div>
      <OptionDataProvider>
        <Sidebar />
        <Table />
      </OptionDataProvider>
    </div>
  )
}
