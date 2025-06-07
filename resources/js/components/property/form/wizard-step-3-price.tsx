import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

const defaultPriceForm = {
  price_type: 'sale',
  amount: '',
  range_min: '',
  range_max: '',
  label: '',
  hide_amount: false,
  penalize_search: false,
  display: true,
  tax: 'unknown',
};

export default function WizardStep3Price({ data, setData, propertyTypes, listingMethods, listingStatuses, errors, nextStep, prevStep }: any) {
  // Always show price form
  if (!data.price) {
    setData('price', { ...defaultPriceForm });
  }
  const showPriceForm = true;
  return (
    <div>
      <h2 className="text-3xl font-bold pt-4 pb-6 text-gray-900 dark:text-gray-100">Pricing Method</h2>
      {/* Move the form outside of the bordered division */}
      {data.price && (
        <>
          <div className="space-y-4">
            

              {data.price.price_type !== 'offers_between' && (

            <div className="flex flex-col md:flex-row md:items-end md:gap-4 space-y-2 md:space-y-0">


              <div className="flex-1">
                <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Price Type</label>
                <Select
                  value={data.price.price_type}
                  onValueChange={val => setData('price', { ...defaultPriceForm, ...data.price, price_type: val })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Price Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sale">Sale</SelectItem>
                    <SelectItem value="rent_weekly">Rent (Weekly)</SelectItem>
                    <SelectItem value="rent_monthly">Rent (Monthly)</SelectItem>
                    <SelectItem value="rent_yearly">Rent (Yearly)</SelectItem>
                    <SelectItem value="offers_above">Offers Above</SelectItem>
                    <SelectItem value="offers_between">Offers Between</SelectItem>
                    <SelectItem value="enquire">Enquire</SelectItem>
                    <SelectItem value="contact">Contact</SelectItem>
                    <SelectItem value="call">Call</SelectItem>
                    <SelectItem value="negotiable">Negotiable</SelectItem>
                    <SelectItem value="fixed">Fixed</SelectItem>
                    <SelectItem value="tba">TBA</SelectItem>
                  </SelectContent>
                </Select>
                {errors['price.price_type'] && <p className="text-xs text-red-500 mt-1">{errors['price.price_type']}</p>}
              </div>


              {/* // )} */}



              {/* Only show the price type select ONCE, and only in the first column for both normal and offers_between layouts */}
              {data.price.price_type !== 'offers_between' && (
                ['sale', 'offers_above', 'fixed', 'negotiable', 'rent_weekly', 'rent_monthly', 'rent_yearly'].includes(data.price.price_type) && (
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Amount</label>
                    <Input
                      type="number"
                      min="1000"
                      value={data.price.amount || ''}
                      onChange={e => setData('price', { ...defaultPriceForm, ...data.price, amount: e.target.value })}
                      placeholder="e.g., 500000"
                    />
                    {errors['price.amount'] && <p className="text-xs text-red-500 mt-1">{errors['price.amount']}</p>}
                  </div>
                )
              )}


              {data.price.price_type !== 'offers_between' && (
                ['sale', 'offers_above', 'fixed', 'negotiable', 'rent_weekly', 'rent_monthly', 'rent_yearly'].includes(data.price.price_type) && (
                  <div className="flex-1">
                    <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Tax</label>
                    <Select
                      value={data.price.tax}
                      onValueChange={val => setData('price', { ...defaultPriceForm, ...data.price, tax: val })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select Tax" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unknown">Unknown</SelectItem>
                        <SelectItem value="exempt">Exempt</SelectItem>
                        <SelectItem value="inclusive">Inclusive</SelectItem>
                        <SelectItem value="exclusive">Exclusive</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors['price.tax'] && <p className="text-xs text-red-500 mt-1">{errors['price.tax']}</p>}
                  </div>
                )
              )}


            </div>
)}
            



            {/* For offers_between, show price type, min, and max all on one line */}
            {data.price.price_type === 'offers_between' && (
              <div className="flex flex-col md:flex-row md:items-end md:gap-4 space-y-2 md:space-y-0">
                <div className="flex-1">
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Price Type</label>
                  <Select
                    value={data.price.price_type}
                    onValueChange={val => setData('price', { ...defaultPriceForm, ...data.price, price_type: val })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Price Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="sale">Sale</SelectItem>
                      <SelectItem value="rent_weekly">Rent (Weekly)</SelectItem>
                      <SelectItem value="rent_monthly">Rent (Monthly)</SelectItem>
                      <SelectItem value="rent_yearly">Rent (Yearly)</SelectItem>
                      <SelectItem value="offers_above">Offers Above</SelectItem>
                      <SelectItem value="offers_between">Offers Between</SelectItem>
                      <SelectItem value="enquire">Enquire</SelectItem>
                      <SelectItem value="contact">Contact</SelectItem>
                      <SelectItem value="call">Call</SelectItem>
                      <SelectItem value="negotiable">Negotiable</SelectItem>
                      <SelectItem value="fixed">Fixed</SelectItem>
                      <SelectItem value="tba">TBA</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors['price.price_type'] && <p className="text-xs text-red-500 mt-1">{errors['price.price_type']}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Minimum Amount</label>
                  <Input
                    type="number"
                    min="1000"
                    value={data.price.range_min || ''}
                    onChange={e => setData('price', { ...defaultPriceForm, ...data.price, range_min: e.target.value })}
                    placeholder="e.g., 400000"
                  />
                  {errors['price.range_min'] && <p className="text-xs text-red-500 mt-1">{errors['price.range_min']}</p>}
                </div>
                <div className="flex-1">
                  <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Maximum Amount</label>
                  <Input
                    type="number"
                    min="1000"
                    value={data.price.range_max || ''}
                    onChange={e => setData('price', { ...defaultPriceForm, ...data.price, range_max: e.target.value })}
                    placeholder="e.g., 500000"
                  />
                  {errors['price.range_max'] && <p className="text-xs text-red-500 mt-1">{errors['price.range_max']}</p>}
                </div>
              </div>
            )}





            <div className="space-y-2">
              <label className="block text-xs font-medium text-zinc-700 dark:text-zinc-300">Label (Display Text)</label>
              <Input
                type="text"
                value={data.price.label || ''}
                onChange={e => setData('price', { ...defaultPriceForm, ...data.price, label: e.target.value })}
                placeholder="e.g., Offers above $400,000"
              />
              {errors['price.label'] && <p className="text-xs text-red-500 mt-1">{errors['price.label']}</p>}
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={data.price.hide_amount}
                onCheckedChange={checked => setData('price', { ...defaultPriceForm, ...data.price, hide_amount: !!checked })}
              />
              <label className="text-xs text-zinc-700 dark:text-zinc-300">Hide Amount (show label instead)</label>
            </div>
            <div className="flex items-center gap-2">
              <Checkbox
                checked={data.price.display}
                onCheckedChange={checked => setData('price', { ...defaultPriceForm, ...data.price, display: !!checked })}
              />
              <label className="text-xs text-zinc-700 dark:text-zinc-300">Display Price</label>
            </div>
            {data.price.penalize_search && (
              <p className="text-xs text-yellow-500 mt-2">
                Warning: Non-numeric or hidden prices will be ranked lower in search results and excluded from price range filters.
              </p>
            )}
          </div>
        </>
      )}
    </div>
  );
}
