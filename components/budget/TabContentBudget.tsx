import React, { useEffect, useRef, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AddCategory from './budget/AddCategory';
import { ChromePicker } from 'react-color';
import CategoryList from './budget/CategoryList';
import MonthCarousel from './budget/MonthCarousel';

const TabContentDashboard = ({ budget, categoryNames, userCurrency }) => {
  const [background, setBackground] = useState('#fff');
  const [showPicker, setShowPicker] = useState(false);
  const pickerRef = useRef<HTMLDivElement>(null);

  const handleChangeComplete = (color) => {
    setBackground(color.hex);
  };

  // Close the picker when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (pickerRef.current && !pickerRef.current.contains(event.target)) {
        setShowPicker(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);
  return (
    <div>
      <TabsContent value="budget">
        <Card>
          <CardHeader>
            <CardTitle>Budget</CardTitle>
            <CardDescription>
              Make changes to your account here. Click save when done.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-end space-x-2 items-start">
              <AddCategory
                selectedColor={background}
                handleChangeComplete={handleChangeComplete}
              />

              <button
                className="w-10 h-10 rounded-full border shadow flex"
                style={{ backgroundColor: background }}
                onClick={() => setShowPicker(!showPicker)}
              />

              {showPicker && (
                <div ref={pickerRef} className="absolute z-50 mt-2">
                  <ChromePicker
                    color={background}
                    onChangeComplete={handleChangeComplete}
                  />
                </div>
              )}
            </div>

            <div>
              <CategoryList
                budget={budget}
                categoryNames={categoryNames}
                userCurrency={userCurrency}
              />
            </div>
          </CardContent>
          <CardFooter>{/* <Button>Save changes</Button> */}</CardFooter>
        </Card>
      </TabsContent>
    </div>
  );
};

export default TabContentDashboard;
