<?php

namespace App\Services;

use App\Models\Property;
use Illuminate\Support\Facades\Log;

class ReaxmlService
{
    /**
     * Generate REAXML XML for a property.
     * @param Property $property
     * @return string XML
     * @throws \Exception if required fields are missing
     */
    public function generate(Property $property): string
    {
        // Validate required fields (expand as per REAXML spec)
        $missing = [];
        if (!$property->headline) $missing[] = 'headline';
        if (!$property->status) $missing[] = 'status';
        if (!$property->address) $missing[] = 'address';
        if (!$property->address || !$property->address->street_name) $missing[] = 'address.street_name';
        if (!$property->address || !$property->address->suburb) $missing[] = 'address.suburb';
        if (!$property->address || !$property->address->state) $missing[] = 'address.state';
        if (!$property->address || !$property->address->postcode) $missing[] = 'address.postcode';
        if (!$property->agent) $missing[] = 'agent';
        if (!$property->agent || !$property->agent->name) $missing[] = 'agent.name';
        if (!$property->agent || !$property->agent->email) $missing[] = 'agent.email';
        if (count($missing)) {
            throw new \Exception('Missing required fields: ' . implode(', ', $missing));
        }

        // Build XML (expanded example)
        $xml = new \SimpleXMLElement('<residential></residential>');
        $xml->addChild('uniqueID', $property->external_listing_id ?? $property->id);
        $xml->addChild('status', $property->status);
        $xml->addChild('headline', $property->headline);
        $xml->addChild('description', $property->description);
        $xml->addChild('price', $property->price);
        $xml->addChild('authority', $property->authority ?? '');
        $address = $xml->addChild('address');
        $address->addChild('unitNumber', $property->address->unit_number ?? '');
        $address->addChild('streetNumber', $property->address->street_number ?? '');
        $address->addChild('street', $property->address->street_name ?? '');
        $address->addChild('suburb', $property->address->suburb ?? '');
        $address->addChild('state', $property->address->state ?? '');
        $address->addChild('postcode', $property->address->postcode ?? '');
        $address->addChild('country', $property->address->country ?? 'Australia');
        $address->addChild('latitude', $property->address->latitude ?? '');
        $address->addChild('longitude', $property->address->longitude ?? '');
        $agent = $xml->addChild('agent');
        $agent->addChild('name', $property->agent->name ?? '');
        $agent->addChild('email', $property->agent->email ?? '');
        $agent->addChild('phone', $property->agent->phone ?? '');
        $agent->addChild('agency', $property->agent->agency_name ?? '');
        $agent->addChild('licenseNumber', $property->agent->license_number ?? '');
        // Features (example)
        if ($property->features) {
            $features = $xml->addChild('features');
            $features->addChild('bedrooms', $property->features->bedrooms ?? '');
            $features->addChild('bathrooms', $property->features->bathrooms ?? '');
            $features->addChild('carspaces', $property->features->car_spaces ?? '');
            $features->addChild('landSize', $property->features->land_size ?? '');
        }
        // Add more fields as required by REAXML spec
        return $xml->asXML();
    }
}
