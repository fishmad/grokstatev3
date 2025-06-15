// Utility to format price or price range for a property, supporting all Price DB variations
import type { Property } from '@/types/property-types';

export function formatPropertyPrice(property: Property) {
  // If property.price is an object (from Eloquent relationship), use its display_price accessor if present
  if (property.price && typeof property.price === 'object') {
    // Laravel accessor: display_price
    if (property.price.display_price) {
      return property.price.display_price;
    }
    // Fallbacks for amount/range/label
    if (property.price.price_type === 'offers_between' && property.price.range_min && property.price.range_max) {
      return `$${Number(property.price.range_min).toLocaleString()} - $${Number(property.price.range_max).toLocaleString()}`;
    }
    if (property.price.amount) {
      let prefix = property.price.price_type === 'offers_above' ? 'Offers above ' : '';
      let suffix = '';
      switch (property.price.price_type) {
        case 'rent_weekly': suffix = ' p/w'; break;
        case 'rent_monthly': suffix = ' p/m'; break;
        case 'rent_yearly': suffix = ' p/a'; break;
      }
      return prefix + `$${Number(property.price.amount).toLocaleString()}` + suffix;
    }
    if (property.price.label) {
      return property.price.label;
    }
  }
  // If price is a string (legacy), just return it
  if (typeof property.price === 'string') {
    return property.price;
  }
  // Fallback
  return 'Price on request';
}
