import React from 'react'
import Image from 'next/image'
import CurrencyMenue from "./CurrencyMenue"
import {
  Dialog,
  DialogTrigger,
} from "@/components/ui/dialog"

import BankManue from './BankManue';


const TransactionsInput = ({currency}) => {
  const [isOpen, setIsOpen] = React.useState(false);


  return (
    <div className='sidebar-link hover:bg-financeGradient hover:text-white hover:cursor-pointer md:justify-center md:items-center'>
      {/* Upload File */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogTrigger asChild>
          <div  className='flex gap-3 w-full h-full'>
            <div className='flex relative size-6 md:justify-center md:items-center'>
              <Image
                src="icons/upload.svg" // Replace with your image path
                alt="Upload File"
                style={{ cursor: "pointer" }}
                className="absolute inset-0 m-auto object-contain"
                fill
              />
            </div>
            <p className='sidebar-label'>
              Upload
            </p>
          </div>
        </DialogTrigger>

        <BankManue setIsOpen={setIsOpen} currency={currency}/>
        
      </Dialog>
    </div>
  );
}

export default TransactionsInput;
