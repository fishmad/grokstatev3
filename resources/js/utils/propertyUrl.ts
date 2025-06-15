import slugify from 'slugify';
import type { Property } from '@/types/property-types';
import { route } from 'ziggy-js';

/**
 * Safely extracts all required fields for SEO URL generation from a property object,
 * supporting both flat and nested relationship structures.
 *
 * Always prefer relationship slugs if present, then flat fields, then fallback.
 * This ensures robust, future-proof SEO URL generation for all property shapes.
 */
function extractSeoFields(property: Property) {
  let listing_type_slug = 'eoi'; // Default fail-safe for listing type
  if (property.listing_type &&
      typeof property.listing_type === 'object' &&
      property.listing_type.slug &&
      typeof property.listing_type.slug === 'string' &&
      property.listing_type.slug.trim() !== '') {
    listing_type_slug = property.listing_type.slug.trim();
  }

  let property_type_slug = 'other'; // Default fail-safe for property type
  if (property.property_type &&
      typeof property.property_type === 'object' &&
      property.property_type.slug &&
      typeof property.property_type.slug === 'string' &&
      property.property_type.slug.trim() !== '') {
    property_type_slug = property.property_type.slug.trim();
  }

  const streetNum = String(property.address?.street_number || property.street_number || '').trim();
  const streetName = String(property.address?.street_name || property.street_name || '').trim();
  let streetAddress = '';
  if (streetNum && streetName) {
    streetAddress = `${streetNum} ${streetName}`;
  } else {
    streetAddress = streetNum || streetName;
  }

  return {
    listing_type: listing_type_slug,
    property_type: property_type_slug,
    slug: String(property.slug || '').trim(),
    street_address: streetAddress,
    suburb: String(property.address?.suburb || property.suburb || '').trim(),
    state: String(property.address?.state || property.state || '').trim(),
    postcode: String(property.address?.postcode || property.postcode || '').trim(),
  };
}

/**
 * Generates a property URL, prioritizing SEO-friendly formats if enabled and data is available.
 * Falls back to ID-based URLs if SEO generation is disabled or necessary data is missing.
 *
 * @param property The property object.
 * @param seoUrlsEnabled A boolean flag indicating whether SEO URLs should be generated.
 * @param useShortUrl Optional. If true, generates a 3-segment short SEO URL. Defaults to false (4-segment canonical).
 * @returns The generated property URL string.
 */
export function generatePropertyUrl(property: Property, seoUrlsEnabled: boolean, useShortUrl = false): string {
    if (!property || typeof property.id === 'undefined') {
        // eslint-disable-next-line no-console
        console.error('[URL Generation] Invalid property object or missing ID:', property);
        return '#error-invalid-property'; // Return a fallback or error indicator
    }

    if (seoUrlsEnabled) {
        const {
            listing_type,
            property_type,
            slug,
            street_address,
            suburb,
            state,
            postcode
        } = extractSeoFields(property);

        // Ensure essential components for SEO URL are present
        const hasRequiredSeoFields = listing_type && property_type && suburb && state && (slug || street_address);

        if (hasRequiredSeoFields) {
            const safeSlug = slugify(slug || street_address || `property-${property.id}`, { lower: true, strict: true });
            const safeSuburb = slugify(suburb, { lower: true, strict: true });
            const safeState = slugify(state, { lower: true, strict: true });
            // Postcode is not typically slugified in URLs but can be included if desired.
            // const safePostcode = postcode; // Or slugify if needed

            if (useShortUrl) {
                // 3-segment short URL: /buy/property-type/suburb-state-slug
                // Example: /buy/house/paddington-nsw-123-oxford-street
                // Or if postcode is preferred: /buy/house/paddington-2021-123-oxford-street
                return `/${listing_type}/${property_type}/${safeSuburb}-${safeState}-${safeSlug}`;
            } else {
                // 4-segment canonical URL: /buy/nsw/paddington/house-123-oxford-street
                // Example: /buy/nsw/paddington/house-123-oxford-street
                return `/${listing_type}/${safeState}/${safeSuburb}/${property_type}-${safeSlug}`;
            }
        } else {
            // Fallback to ID-based URL if SEO fields are missing even if SEO is enabled
            // eslint-disable-next-line no-console
            console.warn(`[URL Generation] Missing SEO fields for property ID ${property.id}, falling back to ID-based URL.`, { listing_type, property_type, slug, street_address, suburb, state });
            return route('properties.show', property.id);
        }
    }

    // Default to ID-based URL if SEO URLs are disabled
    return route('properties.show', property.id);
}

/**
 * Generates a canonical (4-segment) SEO-friendly URL for a property.
 * Example: /buy/nsw/paddington/house-123-oxford-street
 *
 * @param property The property object.
 * @param seoUrlsEnabled A boolean flag indicating whether SEO URLs should be generated.
 * @returns The canonical property URL string.
 */
export function getCanonicalPropertyUrl(property: Property, seoUrlsEnabled: boolean): string {
    return generatePropertyUrl(property, seoUrlsEnabled, false);
}

/**
 * Generates a short (3-segment) SEO-friendly URL for a property.
 * Example: /buy/house/paddington-nsw-123-oxford-street
 *
 * @param property The property object.
 * @param seoUrlsEnabled A boolean flag indicating whether SEO URLs should be generated.
 * @returns The short property URL string.
 */
export function getShortPropertyUrl(property: Property, seoUrlsEnabled: boolean): string {
    return generatePropertyUrl(property, seoUrlsEnabled, true);
}

// Instead of importing getPropertySeoUrl, use the correct export:
// import { getCanonicalPropertyUrl } from '@/utils/propertyUrl';
// or
// import { generatePropertyUrl } from '@/utils/propertyUrl';
// or
// import { getShortPropertyUrl } from '@/utils/propertyUrl';
//
// Update all imports in your codebase that reference getPropertySeoUrl to use one of the above, depending on your intent.
//
// If you want to use the canonical SEO URL everywhere you previously used getPropertySeoUrl, use getCanonicalPropertyUrl.
// If you want the short SEO URL, use getShortPropertyUrl.
// If you want the function that auto-selects SEO or fallback, use generatePropertyUrl.
//
// Example fix:
// import { getCanonicalPropertyUrl as getPropertySeoUrl } from '@/utils/propertyUrl';