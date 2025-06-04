import React from 'react';
import { Button } from '@/components/ui/button';

interface Price {
  type?: string;
  amount?: string;
  currency?: string;
}

interface PricesInputProps {
  prices: Price[];
  setPrices: (prices: Price[]) => void;
}

const currencyOptions = [
  { value: 'USD', label: 'USD' },
  { value: 'AUD', label: 'AUD' },
  { value: 'EUR', label: 'EUR' },
  { value: 'GBP', label: 'GBP' },
];

export default function PricesInput({ prices, setPrices }: PricesInputProps) {
  const handleChange = (idx: number, field: keyof Price, value: string) => {
    const updated = prices.map((p, i) => i === idx ? { ...p, [field]: value } : p);
    setPrices(updated);
  };
  const addPrice = () => setPrices([...prices, { type: '', amount: '', currency: '' }]);
  const removePrice = (idx: number) => setPrices(prices.filter((_, i) => i !== idx));

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-semibold">Prices</span>
        <Button type="button" size="sm" onClick={addPrice}>Add Price</Button>
      </div>
      {prices.map((price, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <input
            className="input input-bordered w-1/3"
            placeholder="Type (e.g. Sale, Rent)"
            value={price.type || ''}
            onChange={e => handleChange(idx, 'type', e.target.value)}
          />
          <input
            type="number"
            min="0"
            className="input input-bordered w-1/3"
            placeholder="Amount"
            value={price.amount || ''}
            onChange={e => handleChange(idx, 'amount', e.target.value)}
          />
          <select
            className="input input-bordered w-1/4"
            value={price.currency || ''}
            onChange={e => handleChange(idx, 'currency', e.target.value)}
          >
            <option value="">Currency</option>
            {currencyOptions.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
          <Button type="button" size="sm" variant="destructive" onClick={() => removePrice(idx)}>-</Button>
        </div>
      ))}
    </div>
  );
}
