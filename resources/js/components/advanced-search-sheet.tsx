import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';

interface AdvancedSearchSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AdvancedSearchSheet({ open, onOpenChange }: AdvancedSearchSheetProps) {
  // You can lift state up or manage form state here as needed
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
 
      <SheetContent side="right" className="max-w-md w-full bg-white dark:bg-neutral-900 shadow-xl border-l border-neutral-200 dark:border-neutral-800 p-0">
        <div className="p-6 flex flex-col gap-6 h-full">
          <SheetHeader>
            <SheetTitle className="text-2xl font-bold mb-2">Advanced Search</SheetTitle>
          </SheetHeader>
          <form className="flex flex-col gap-6 flex-1">
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Keyword</label>
              <Input className="text-base" placeholder="e.g. pool, renovated, etc." />
            </div>
            <div>
              <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Price Range ($)</label>
              <div className="px-2 pt-2 pb-1">
                <Slider
                  range
                  min={0}
                  max={2000000}
                  step={10000}
                  defaultValue={[200000, 800000]}
                  trackStyle={[{ backgroundColor: '#fb923c', height: 6 }]}
                  handleStyle={[
                    { borderColor: '#fb923c', backgroundColor: '#fff', height: 20, width: 20, marginTop: -7 },
                    { borderColor: '#fb923c', backgroundColor: '#fff', height: 20, width: 20, marginTop: -7 }
                  ]}
                  railStyle={{ backgroundColor: '#e5e7eb', height: 6 }}
                  dotStyle={{ display: 'none' }}
                />
                <div className="flex justify-between text-xs text-neutral-400 mt-1">
                  <span>$0</span>
                  <span>$2M+</span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Beds</label>
                <Input className="text-base" type="number" min={0} placeholder="Min" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-1">&nbsp;</label>
                <Input className="text-base" type="number" min={0} placeholder="Max" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Baths</label>
                <Input className="text-base" type="number" min={0} placeholder="Min" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-1">&nbsp;</label>
                <Input className="text-base" type="number" min={0} placeholder="Max" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-1">Area (sqft)</label>
                <Input className="text-base" type="number" min={0} placeholder="Min" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-neutral-700 dark:text-neutral-200 mb-1">&nbsp;</label>
                <Input className="text-base" type="number" min={0} placeholder="Max" />
              </div>
            </div>
            <Button type="submit" className="mt-4 w-full text-base rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-lg py-3">Apply Filters</Button>
          </form>
        </div>
      </SheetContent>
    </Sheet>
  );
}
