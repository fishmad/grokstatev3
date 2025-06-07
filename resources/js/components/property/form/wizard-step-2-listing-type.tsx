import React from 'react';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Gavel, Tag, Handshake, FileText, List } from "lucide-react";

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

export default function WizardStep2Listing({ data, setData, propertyTypes, listingMethods, listingStatuses, errors, nextStep, prevStep }: any) {
  const showPriceForm = !!data.price;

  React.useEffect(() => {
    if (listingStatuses?.length > 0 && !data.listing_status_id) {
      setData('listing_status_id', String(listingStatuses[0].id));
    }
    if (propertyTypes?.length > 0 && !data.property_type_id) {
      setData('property_type_id', String(propertyTypes[0].id));
    }
  }, [listingStatuses, propertyTypes]);

  return (
    <div>
      <h2 className="text-3xl font-bold pt-4 pb-6 text-gray-900 dark:text-gray-100">Advertisment Type</h2>

      {/* <div className="space-y-2">
        <div className="font-semibold mb-5">Step 1: Select a top-level category</div> */}
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4 mb-4">
          {listingMethods && listingMethods.map((m: any) => {
            console.log('listing method', m, m.display_names);
            // Map method name to icon (customize as needed)
            let Icon = List;
            if (m.name.toLowerCase().includes('auction')) Icon = Gavel;
            else if (m.name.toLowerCase().includes('sale')) Icon = Tag;
            else if (m.name.toLowerCase().includes('lease')) Icon = Handshake;
            else if (m.name.toLowerCase().includes('tender')) Icon = FileText;
            return (
              <label
                key={m.id}
                className={`cursor-pointer flex flex-col items-center justify-center w-36 h-24 rounded-xl border-2 transition text-center select-none shadow-sm
                  ${data.listing_method_id == m.id
                    ? 'border-orange-600 bg-blue-50 shadow-lg'
                    : 'border-zinc-300 bg-white hover:border-orange-600 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:border-white'}
                `}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') setData('listing_method_id', m.id);
                }}
              >
                <input
                  type="radio"
                  name="listingMethod"
                  value={m.id}
                  checked={data.listing_method_id == m.id}
                  onChange={() => setData('listing_method_id', m.id)}
                  className="sr-only"
                />
                <span className="mb-2 text-2xl text-orange-600">
                  {Icon && React.createElement(Icon, { size: 32 })}
                </span>
                <span className={`font-semibold text-base ${data.listing_method_id == m.id ? 'text-zinc-900 dark:text-white' : 'text-zinc-900 dark:text-zinc-100'}`}>{Array.isArray(m.display_names) && m.display_names.length > 0 ? m.display_names[0] : m.name}</span>
              </label>
            );
          })}
        </div>
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
      </div>
    </div>
  );
}
