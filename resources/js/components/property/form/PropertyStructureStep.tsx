import React from 'react';
import { Button } from '@/components/ui/button';
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

export default function PropertyStructureStep({ data, setData, propertyTypes, listingMethods, listingStatuses, errors, nextStep, prevStep }: any) {
  const showPriceForm = !!data.price;
  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Structure, Listing, Price</h2>
      <div className="space-y-4">
        <label className="block text-sm font-medium">Property Type</label>
        <Select value={data.property_type_id || ''} onValueChange={val => setData('property_type_id', val)}>
          <SelectTrigger className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
            {propertyTypes && propertyTypes.map((t: any) => (
              <SelectItem key={t.id} value={String(t.id)}>{t.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <label className="block text-sm font-medium">Listing Method</label>
        <Select value={data.listing_method_id || ''} onValueChange={val => setData('listing_method_id', val)}>
          <SelectTrigger className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
            <SelectValue placeholder="Select Method" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
            {listingMethods && listingMethods.map((m: any) => (
              <SelectItem key={m.id} value={String(m.id)}>{m.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <label className="block text-sm font-medium">Listing Status</label>
        <Select value={data.listing_status_id || ''} onValueChange={val => setData('listing_status_id', val)}>
          <SelectTrigger className="w-full bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
            <SelectValue placeholder="Select Status" />
          </SelectTrigger>
          <SelectContent className="bg-white dark:bg-zinc-900 text-zinc-900 dark:text-zinc-100 border border-zinc-200 dark:border-zinc-700">
            {listingStatuses && listingStatuses.map((s: any) => (
              <SelectItem key={s.id} value={String(s.id)}>{s.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Checkbox
              checked={showPriceForm}
              onCheckedChange={checked => {
                if (!checked) {
                  setData('price', undefined);
                } else {
                  setData('price', { ...defaultPriceForm });
                }
              }}
            />
            <span>Add Price Information</span>
          </div>
          {showPriceForm && data.price && (
            <div className="space-y-4 p-4 border rounded-md">
              <div className="space-y-2">
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
              {['sale', 'offers_above', 'fixed', 'negotiable', 'rent_weekly', 'rent_monthly', 'rent_yearly'].includes(data.price.price_type) && (
                <div className="space-y-2">
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
              )}
              {data.price.price_type === 'offers_between' && (
                <>
                  <div className="space-y-2">
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
                  <div className="space-y-2">
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
                </>
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
              <div className="space-y-2">
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
              {data.price.penalize_search && (
                <p className="text-xs text-yellow-500 mt-2">
                  Warning: Non-numeric or hidden prices will be ranked lower in search results and excluded from price range filters.
                </p>
              )}
            </div>
          )}
        </div>
      </div>
      <div className="flex justify-between mt-6">
        <Button type="button" onClick={prevStep}>Back</Button>
        <Button type="button" onClick={nextStep}>Next</Button>
      </div>
    </div>
  );
}
