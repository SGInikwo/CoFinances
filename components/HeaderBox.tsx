'use client'

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import React from 'react'
import { Button } from './ui/button'
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import { create_JWT, updateuserCurrency } from "@/lib/actions/user.actions"
import { push_data } from "@/lib/actions/transaction.actions"
import { get_jwt, isJWTExpired, send_jwt } from "@/lib/auth"


const currencies = [
  { label: "EUR", value: "0" },
  { label: "KRW", value: "1" },
  { label: "KES", value: "2" },
  { label: "GBP", value: "3" },
  { label: "USD", value: "4" },
] as const

const HeaderBox = ({ type='title', title, subtext, user, userInfo, currency}: HeaderBoxProps) => {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState(currency)

  const updateCurrency = async (selectedCurrency: string) => {
    try {
      await updateuserCurrency({ newCurrency: selectedCurrency })

      let jwt = await get_jwt(userInfo)
      if( await isJWTExpired(jwt)){

        jwt = await create_JWT()
        
        await send_jwt(jwt)
        jwt = await get_jwt(userInfo)
      }else{

      }
      await push_data(jwt)

      window.location.reload(); 
    } catch (error) {
      console.error("Error updating currency: ", error)
    }
  }
  return (
    <section className="flex justify-between">
      <div className='header-box'>
        <h1 className='header-box-title'>
          {title}
          {type === 'greeting' && (
            <span className='text-financeGradient'>
              &nbsp;{user}
              </span>
          )}
        </h1>
        <p className='header-box-subtext'>{subtext}</p>
      </div>

      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={open}
            className="w-[80px] justify-between rounded-full hover:border-financeGradient"
          >
            {value
              ? currencies.find((currency) => currency.value === value)?.label
              : "Select framework..."}
            <ChevronsUpDown className="opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[200px] p-0">
          <Command>
            <CommandInput placeholder="Search framework..." className="h-9" />
            <CommandList>
              <CommandEmpty>No framework found.</CommandEmpty>
              <CommandGroup>
                {currencies.map((currency) => (
                  <CommandItem
                    key={currency.value}
                    value={currency.value}
                    onSelect={(currentValue) => {
                      setValue(currentValue === value ? "" : currentValue)
                      updateCurrency(currentValue)
                      setOpen(false)
                    }}
                    className={cn(
                      "cursor-pointer bg-white",
                      "hover:bg-financeSidebar", // Hover state
                      "aria-selected:bg-financeSidebar", // Keyboard focus (overrides hover)
                      "hover:bg-white aria-selected:hover:bg-financeSidebar"
                    )}
                  >
                    {currency.label}
                    <Check
                      className={cn(
                        "ml-auto",
                        value === currency.value ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </section>
  )
}

export default HeaderBox