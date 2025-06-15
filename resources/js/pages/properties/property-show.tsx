import AppLayout from '@/layouts/welcome-layout';
import { type BreadcrumbItem, type SharedData, type User } from '@/types';
import type { Property } from '@/types/property-types';
import { Head, router, usePage } from '@inertiajs/react';
import { useInitials } from '@/hooks/use-initials';
import { useState, useEffect } from 'react';
import { formatPropertyPrice } from '@/utils/formatPropertyPrice';
import { generatePropertyUrl } from '@/utils/propertyUrl';
import { logger } from '@/utils/logger';
import PropertyImageGalleryCard from '@/components/property/show/property-image-gallery-card';
import PropertyHeaderCard from '@/components/property/show/property-header-card';
import PropertyDetailsCard from '@/components/property/show/property-details-card';
import PropertyDescriptionCard from '@/components/property/show/property-description-card';
import PropertyFeaturesCard from '@/components/property/show/property-features-card';
import AgentInfoCard from '@/components/property/show/agent-info-card';
import PropertyActionsCard from '@/components/property/show/property-actions-card';
import RelatedPropertyCard from '@/components/property/show/related-property-card';
import PropertyLocationMapCard from '@/components/property/show/property-location-map-card';

//logger.debug('LOGGER TEST: DEBUG_FEATURES_ENABLED =', window.DEBUG_FEATURES_ENABLED);

interface PropertyShowProps extends SharedData {
    property: Property;
    is_favorited: boolean;
    favorite_id: number | null;
    related_properties?: Property[];
    [key: string]: any;
}

export default function PropertyShow() {
    const { property, auth, related_properties, is_favorited, favorite_id } = usePage<{ property: Property; auth: any; related_properties?: Property[]; is_favorited: boolean; favorite_id: number | null }>().props;
    const getInitials = useInitials();

    // Local state to manage optimistic updates for favorite button
    const [favoritedStatus, setFavoritedStatus] = useState(is_favorited);
    const [currentFavoriteId, setCurrentFavoriteId] = useState(favorite_id);
    const [isFavoriteProcessing, setIsFavoriteProcessing] = useState(false); // For favorite button loading state

    useEffect(() => {
        setFavoritedStatus(is_favorited);
        setCurrentFavoriteId(favorite_id);
    }, [is_favorited, favorite_id]);

    const breadcrumbs: BreadcrumbItem[] = [
        {
            title: 'Properties',
            href: route('properties.index'),
        },
        {
            title: property.title,
            href: route('properties.show', property.id),
        },
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

    const owner = property.user as User; // Type assertion for convenience

    const handleToggleFavorite = () => {
        if (!auth.user) {
            router.visit(route('login'));
            return;
        }

        // Ensure property and property.id are valid before proceeding
        if (!property || typeof property.id === 'undefined') {
            console.error('Property or Property ID is undefined. Cannot toggle favorite.');
            // Optionally, show a user-facing error message here
            return;
        }

        setIsFavoriteProcessing(true); // Start processing

        if (favoritedStatus && currentFavoriteId) {
            // Optimistically update UI
            setFavoritedStatus(false);
            router.delete(route('favorites.destroy', currentFavoriteId), {
                preserveScroll: true,
                onSuccess: () => {
                    setCurrentFavoriteId(null);
                    // flash message will be handled by layout if backend sends one
                },
                onError: () => {
                    // Revert optimistic update on error
                    setFavoritedStatus(true);
                    // Optionally show an error toast
                },
                onFinish: () => {
                    setIsFavoriteProcessing(false); // End processing
                }
            });
        } else {
            // Optimistically update UI
            setFavoritedStatus(true);
            // For a standard resource 'store' route, send property_id in the request body.
            // The route itself (favorites.store) should not expect a parameter in the URL path.
            router.post(route('favorites.store'), {
                property_id: property.id // Send property_id in the request body
            }, {
                preserveScroll: true,
                onSuccess: (page) => {
                    // The controller should return updated props, including the new favorite_id
                    // and is_favorited status. The useEffect hook will handle updating local state.
                    // However, if favorite_id is explicitly returned in page.props:
                    const newProps = page.props as unknown as PropertyShowProps;
                    if (newProps.favorite_id !== undefined) {
                        setCurrentFavoriteId(newProps.favorite_id);
                    }
                    // If is_favorited is also returned, ensure it's updated:
                    if (newProps.is_favorited !== undefined) {
                        setFavoritedStatus(newProps.is_favorited);
                    }
                },
                onError: () => {
                    // Revert optimistic update on error
                    setFavoritedStatus(false);
                    // Optionally show an error toast
                },
                onFinish: () => {
                    setIsFavoriteProcessing(false); // End processing
                }
            });
        }
    };

    // Use relationship objects as the source of truth, fallback to flat fields if needed
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
    // Use propertyFeature or direct fields
    const propertyFeature = property.propertyFeature || null;
    const bedrooms = propertyFeature?.bedrooms ?? property.bedrooms ?? null;
    const bathrooms = propertyFeature?.bathrooms ?? property.bathrooms ?? null;
    const garageSpaces = propertyFeature?.garageSpaces ?? property.garage_spaces ?? null;
    const carSpaces = propertyFeature?.carSpaces ?? property.car_spaces ?? null;
    const parkingSpaces = propertyFeature?.parkingSpaces ?? property.parking_spaces ?? null;
    const areaSqft = propertyFeature?.floorArea ?? null;
    const plotSqft = propertyFeature?.landArea ?? null;

    // For latitude/longitude
    const latitude = typeof address.latitude === 'number' ? address.latitude : (address.latitude ? Number(address.latitude) : -25.2744);
    const longitude = typeof address.longitude === 'number' ? address.longitude : (address.longitude ? Number(address.longitude) : 133.7751);

    // Robustly parse features arrays (handle stringified JSON or arrays)
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

    // Features (keywords) array for legacy UI block
    const features = keywords;

    // Use robustly parsed arrays for feature display blocks
    const showOutdoorFeatures = outdoorFeatures && Array.isArray(outdoorFeatures) && outdoorFeatures.length > 0;
    const showIndoorFeatures = indoorFeatures && Array.isArray(indoorFeatures) && indoorFeatures.length > 0;
    const showClimateEnergyFeatures = climateEnergyFeatures && Array.isArray(climateEnergyFeatures) && climateEnergyFeatures.length > 0;
    const showAccessibilityFeatures = accessibilityFeatures && Array.isArray(accessibilityFeatures) && accessibilityFeatures.length > 0;

    // Debug logging for devs (toggle with DEBUG_FEATURES_ENABLED)
    logger.debug('Property payload:', property);
    logger.debug('PropertyFeature:', propertyFeature);
    logger.debug('Outdoor Features:', outdoorFeatures);
    logger.debug('Indoor Features:', indoorFeatures);
    logger.debug('Climate/Energy Features:', climateEnergyFeatures);
    logger.debug('Accessibility Features:', accessibilityFeatures);
    logger.debug('Keywords:', keywords);

    // Use safe fallback for title and alt attributes
    <Head title={property.title ?? ''} />

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title={property.title ?? ''} />
            <div className="container mx-auto py-6 px-4 md:px-6">
                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content: Image Gallery & Details */}
                    <div className="lg:col-span-2 space-y-6">
                        <PropertyImageGalleryCard media={property.media || []} title={property.title} />
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
                        <PropertyDetailsCard property={property} />
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
                    {/* Sidebar: Agent Info & Actions */}
                    <div className="lg:col-span-1 space-y-6">
                        {owner && (
                            <AgentInfoCard owner={owner} getInitials={getInitials} />
                        )}
                        <PropertyActionsCard
                            isFavorited={favoritedStatus}
                            isFavoriteProcessing={isFavoriteProcessing}
                            onToggleFavorite={handleToggleFavorite}
                            canEdit={auth.user && auth.user.id === property.user_id}
                            editUrl={route('properties.edit', property.id)}
                            isLoggedIn={!!auth.user}
                            loginUrl={route('login', { 'redirect': route('properties.show', property.id) })}
                        />
                        <PropertyLocationMapCard
                            latitude={latitude}
                            longitude={longitude}
                            title={property.title}
                        />
                    </div>
                </div>
                {/* Related Properties Section (Optional) */}
                {related_properties && related_properties.length > 0 && (
                    <div className="mt-12">
                        <h2 className="text-2xl font-semibold mb-4">Similar Properties</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {related_properties.map((relProp: Property) => (
                                <RelatedPropertyCard
                                    key={relProp.id}
                                    property={relProp}
                                    seoUrlsEnabled={seoUrlsEnabled}
                                    generatePropertyUrl={generatePropertyUrl}
                                />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </AppLayout>
    );
}
