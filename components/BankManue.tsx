import { bankLinks } from '@/constants';
import Link from 'next/link';
import React, { useRef, useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
} from '@/components/ui/dialog';
import axios from 'axios';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from './ui/button';
import * as XLSX from 'xlsx';
import { create_JWT, getLoggedInUser } from '@/lib/actions/user.actions';
import { get_jwt, isJWTExpired, send_jwt } from '@/lib/auth';
import { Separator } from './ui/separator';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';
import {
  push_data,
  send_transactions,
} from '@/lib/actions/transaction.actions';
import CurrencyMenue from './CurrencyMenue';

const currencies = [
  { label: 'EUR', value: '0' },
  { label: 'KRW', value: '1' },
  { label: 'KES', value: '2' },
  { label: 'GBP', value: '3' },
  { label: 'USD', value: '4' },
] as const;

const { NEXT_PUBLIC_FASTAPI_URL: API_URL } = process.env;

interface RowData {
  [key: string]: string | number | boolean; // Dynamic row structure
}

interface BankManueProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currency: number | string;
}

const BankManue: React.FC<BankManueProps> = ({ setIsOpen, currency }) => {
  const [open, setOpen] = React.useState(false);
  const [value, setValue] = React.useState(currency);
  // const [openDialog, setOpenDialog] = React.useState(false);
  const [clientCurrency, setclientCurrency] = React.useState(currency);

  const updateCurrency = async (selectedCurrency: string) => {
    setclientCurrency(selectedCurrency);
  };

  const { toast } = useToast();
  const [data, setData] = useState<RowData[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // const [isOpen, setIsOpen] = React.useState(false);
  const [selectedValue, setSelectedValue] = useState<string>('upload');

  const triggerFileInput = () => {
    // Trigger the hidden file input
    fileInputRef.current?.click();
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setIsLoading(true);
      const file = e.target.files[0];
      const reader = new FileReader();

      reader.onload = async (event) => {
        const arrayBuffer = event.target?.result as ArrayBuffer; // Read the file as an ArrayBuffer
        const data = new Uint8Array(arrayBuffer); // Convert the ArrayBuffer to Uint8Array
        const workbook = XLSX.read(data, { type: 'array' }); // Use type 'array' for XLSX
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const parsedData: RowData[] = XLSX.utils.sheet_to_json<RowData>(sheet); // Convert the sheet to JSON

        setData(parsedData);

        // Send parsed data to the FastAPI backend
        try {
          const user = await getLoggedInUser();
          if (!user) {
            throw new Error('No active session found for the user.');
          }

          let jwt = await get_jwt(user['$id']);

          if (await isJWTExpired(jwt)) {
            jwt = await create_JWT();

            await send_jwt(jwt);
            jwt = await get_jwt(user['$id']);
          } else {
          }

          console.log('name', API_URL);

          const response = await send_transactions(
            jwt,
            parsedData,
            clientCurrency,
          );

          // await push_data(jwt)

          setIsOpen(false);
          toast({
            duration: 1000,
            variant: 'succes',
            title: 'Data is send!',
            description: 'Your data is being saved.',
          });
          setIsLoading(false);
          window.location.reload();
        } catch (error) {
          console.error('Error sending data to server:', error);
          toast({
            duration: 1000,
            variant: 'destructive',
            title: 'Uh oh! Something went wrong.',
            description: 'There was a problem with your request.',
          });
          setIsLoading(false);
        }
      };

      reader.readAsArrayBuffer(file); // Use readAsArrayBuffer instead of readAsBinaryString
    }
  };
  return (
    <div>
      <DialogContent className="w-[600px] h-[500px] flex justify-center items-center z-50 bg-gray-300">
        {' '}
        {/* Ensure z-index is high enough */}
        <DialogHeader>
          <DialogDescription className="flex flex-col justify-center items-center w-full">
            <div className="justify-center items-center ">
              <Tabs
                value={selectedValue}
                onValueChange={setSelectedValue}
                className="w-[400px] justify-center items-center"
              >
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger
                    value="upload"
                    className={cn('text-gray-500', {
                      'bg-financeGradient text-white':
                        selectedValue === 'upload',
                    })}
                  >
                    Upload
                  </TabsTrigger>
                  <TabsTrigger
                    value="banks"
                    className={cn('text-gray-500', {
                      'bg-financeGradient text-white':
                        selectedValue === 'banks',
                    })}
                  >
                    Banks
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="upload">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-center">
                        Add your statements here!
                      </CardTitle>
                      {/* <CardDescription>
                        Add your statements here!
                      </CardDescription> */}
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="flex items-center justify-center">
                        <CurrencyMenue
                          currencies={currencies}
                          open={open}
                          setOpen={setOpen}
                          value={value}
                          setValue={setValue}
                          updateCurrency={updateCurrency}
                        />
                      </div>

                      <div className="flex justify-center items-center space-y-1">
                        {/* Button acting as a file input */}
                        <Button
                          type="button"
                          disabled={isLoading}
                          onClick={triggerFileInput}
                          className="bg-financeGradient text-white"
                        >
                          {isLoading ? (
                            <>
                              <Loader2 size={20} className="animate-spin" />{' '}
                              &nbsp; Loading...
                            </>
                          ) : (
                            'Upload File'
                          )}
                        </Button>

                        {/* Hidden file input */}
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept=".xlsx, .xls, .csv"
                          onChange={handleFileUpload}
                          style={{ display: 'none' }} // Hide the file input
                        />
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="banks">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex justify-center">
                        List of Banks
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      <div className="space-y-1">
                        {bankLinks.map((bank) => {
                          // const isActive = pathName === item.route || pathName.startsWith(`${item.route}/`);
                          return (
                            <Link
                              href={bank.bankURL}
                              key={bank.label}
                              target="_blank" // Open in a new tab
                              rel="noopener noreferrer" // Security for _blank
                              className="flex gap-3 items-center py-1 md:p-3 2xl:p-4 rounded-full justify-center"
                            >
                              <div className="relative size-6">
                                <Image
                                  src={bank.imgURL} // Update this if you want to include an image for each bank
                                  alt={bank.label}
                                  fill
                                />
                              </div>
                              {/* <p className={cn("sidebar-label", { "!text-white": isActive })}> */}
                              <p>
                                {bank.label}
                                <Separator />
                              </p>
                            </Link>
                          );
                        })}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </div>
  );
};

export default BankManue;
