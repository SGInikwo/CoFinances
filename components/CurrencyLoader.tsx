import React from 'react'
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog"
import { Loader2 } from 'lucide-react'

const CurrencyLoader = ( {open, setOpen} ) => {

  return (
    <div className="absolute top-0 left-0 invisible opacity-0 pointer-events-none">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex-col bg-financeSidebar border-hidden">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 size={20} className="animate-spin" /> &nbsp;
            <span className='font-bold'>LOADING...</span>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CurrencyLoader