import AdminLayout from '@/layouts/admin-layout';
import { type BreadcrumbItem, type SharedData, type User } from '@/types';
import { Property, PropertyMedia } from '@/types/property-types';
import { Head, usePage } from '@inertiajs/react';
import { useInitials } from '@/hooks/use-initials';
import { useState, useEffect } from 'react';
import { formatPropertyPrice } from '@/utils/formatPropertyPrice';
import { generatePropertyUrl } from '@/utils/propertyUrl';
import PropertyImageGalleryCard from '@/components/property/show/property-image-gallery-card';
import PropertyHeaderCard from '@/components/property/show/property-header-card';
import PropertyDetailsCard from '@/components/property/show/property-details-card';
import PropertyDescriptionCard from '@/components/property/show/property-description-card';
import PropertyFeaturesCard from '@/components/property/show/property-features-card';
import AgentInfoCard from '@/components/property/show/agent-info-card';
import PropertyLocationMapCard from '@/components/property/show/property-location-map-card';
import RelatedPropertyCard from '@/components/property/show/related-property-card';

interface PropertyShowProps extends SharedData {
    property: Property;
    related_properties?: Property[];
    [key: string]: any;
}

export default function AdminPropertyShow() {
    const { property, related_properties } = usePage<PropertyShowProps>().props;
    const getInitials = useInitials();
    const propertyMedia: PropertyMedia[] = property.media || [];
    const address = property.address || {
        unit_number: property.unit_number ?? '',
        street_number: property.street_number ?? '',
        street_name: property.street_name ?? '',
        suburb: property.suburb ?? '',
        state: property.state ?? '',
        postcode: property.postcode ?? '',
        country: property.country ?? '',
        latitude: '',
        longitude: '',
    };
    const propertyFeature: any = (property as any).propertyFeature || (property as any).property_feature || null;
    const latitude = typeof address.latitude === 'number' ? address.latitude : (address.latitude ? Number(address.latitude) : -25.2744);
    const longitude = typeof address.longitude === 'number' ? address.longitude : (address.longitude ? Number(address.longitude) : 133.7751);
    const areaSqft = propertyFeature?.floorArea ?? propertyFeature?.floor_area ?? null;
    const plotSqft = propertyFeature?.landArea ?? propertyFeature?.land_area ?? null;
    const bedrooms = propertyFeature?.bedrooms ?? property.bedrooms ?? null;
    const bathrooms = propertyFeature?.bathrooms ?? property.bathrooms ?? null;
    const garageSpaces = propertyFeature?.garageSpaces ?? propertyFeature?.garage_spaces ?? null;
    const carSpaces = propertyFeature?.carSpaces ?? propertyFeature?.car_spaces ?? null;
    const parkingSpaces = propertyFeature?.parkingSpaces ?? propertyFeature?.parking_spaces ?? null;
    const parseFeatureArray = (val: any) => {
        if (Array.isArray(val)) return val;
        if (typeof val === 'string') {
            try { return JSON.parse(val); } catch { return []; }
        }
        return [];
    };
    const outdoorFeatures = parseFeatureArray(propertyFeature?.outdoorFeatures ?? propertyFeature?.outdoor_features);
    const indoorFeatures = parseFeatureArray(propertyFeature?.indoorFeatures ?? propertyFeature?.indoor_features);
    const climateEnergyFeatures = parseFeatureArray(propertyFeature?.climateEnergyFeatures ?? propertyFeature?.climate_energy_features);
    const accessibilityFeatures = parseFeatureArray(propertyFeature?.accessibilityFeatures ?? propertyFeature?.accessibility_features);
    const keywords = parseFeatureArray(propertyFeature?.keywords ?? propertyFeature?.keywords);
    const features = keywords;
    const showOutdoorFeatures = outdoorFeatures && Array.isArray(outdoorFeatures) && outdoorFeatures.length > 0;
    const showIndoorFeatures = indoorFeatures && Array.isArray(indoorFeatures) && indoorFeatures.length > 0;
    const showClimateEnergyFeatures = climateEnergyFeatures && Array.isArray(climateEnergyFeatures) && climateEnergyFeatures.length > 0;
    const showAccessibilityFeatures = accessibilityFeatures && Array.isArray(accessibilityFeatures) && accessibilityFeatures.length > 0;
    const owner = property.user as User;
    const breadcrumbs: BreadcrumbItem[] = [
        { title: 'Properties', href: '#' },
        { title: property.title, href: '#' },
    ];
    const propertyStatusLabel = (status: Property['status']) => {
        switch (status) {
            case 'for_sale': return 'For Sale';
            case 'for_rent': return 'For Rent';
            case 'sold': return 'Sold';
            case 'rented': return 'Rented';
            default: return 'N/A';
        }
    };
    return (
        <AdminLayout breadcrumbs={breadcrumbs}>
            <Head title={property.title ?? ''} />
            <div className="container mx-auto py-6 px-4 md:px-6">
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <PropertyImageGalleryCard media={propertyMedia} title={property.title} />
                        <PropertyHeaderCard
                            title={property.title}
                            status={property.status ?? ''}
                            address={[
                                address.unit_number && `Unit ${address.unit_number}`,
                                address.street_number && address.street_name ? `${address.street_number} ${address.street_name}` : address.street_name || address.street_number,
                                address.suburb,
                                address.state,
                                address.postcode,
                                address.country
                            ].filter(Boolean).join(', ') || 'No address available'}
                            price={formatPropertyPrice(property)}
                            statusLabel={propertyStatusLabel(property.status)}
                        />
                        <PropertyDetailsCard
                            bedrooms={bedrooms}
                            bathrooms={bathrooms}
                            garageSpaces={garageSpaces}
                            carSpaces={carSpaces}
                            parkingSpaces={parkingSpaces}
                            areaSqft={areaSqft}
                            plotSqft={plotSqft}
                            newOrEstablished={typeof propertyFeature?.new_or_established === 'boolean' ? propertyFeature.new_or_established : null}
                        />
                        <PropertyDescriptionCard description={property.description} />
                        {features && features.length > 0 && (
                            <PropertyFeaturesCard title="Features" features={features} />
                        )}
                        {showOutdoorFeatures && (
                            <PropertyFeaturesCard title="Outdoor Features" features={outdoorFeatures} />
                        )}
                        {showIndoorFeatures && (
                            <PropertyFeaturesCard title="Indoor Features" features={indoorFeatures} />
                        )}
                        {showClimateEnergyFeatures && (
                            <PropertyFeaturesCard title="Climate & Energy Features" features={climateEnergyFeatures} />
                        )}
                        {showAccessibilityFeatures && (
                            <PropertyFeaturesCard title="Accessibility Features" features={accessibilityFeatures} />
                        )}
                    </div>
                    <div className="lg:col-span-1 space-y-6">
                        {owner && (
                            <AgentInfoCard owner={owner} getInitials={getInitials} />
                        )}
                        <PropertyLocationMapCard
                            latitude={latitude}
                            longitude={longitude}
                            title={property.title}
                        />
                    </div>
                </div>
                {related_properties && related_properties.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-semibold mb-4">Similar Properties</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {related_properties.map((relProp: Property) => (
                                <RelatedPropertyCard
                                    key={relProp.id}
                                    property={relProp}
                                    seoUrlsEnabled={true}
                                    generatePropertyUrl={generatePropertyUrl}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
