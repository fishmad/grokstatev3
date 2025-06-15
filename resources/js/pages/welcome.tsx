import AppLayout from '@/layouts/welcome-layout';
import { Head, Link, usePage } from '@inertiajs/react';
import { Card } from '@/components/ui/card';
import { Bath, CarFront, Home, Building2 } from 'lucide-react';
import { getImageUrl } from '@/utils/getImageUrl';


export default function Welcome() {
    const { properties = [] } = usePage().props;
    const propertyList = Array.isArray(properties) ? properties : [];
    return (
        <AppLayout breadcrumbs={[{ title: 'Home', href: '/' }]}> 
            <Head title="Recently Listed Properties" />
            <div className="flex flex-1 flex-col gap-6 p-4 md:p-6">
                <section className="mx-auto max-w-7xl px-2 sm:px-4 py-0">
                    <div className="mb-6 flex items-center justify-between">
                        <h2 className="text-xl md:text-2xl font-semibold">Recently Listed Properties</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                        {propertyList.length === 0 && (
                            <div className="col-span-full text-center text-neutral-500">No properties found.</div>
                        )}
                        {propertyList.map((property: any) => {
                            const image = property.media?.find((img: any) => img.collection_name === 'images') || property.media?.[0];
                            return (
                                <Card key={property.id} className="max-w-full w-full rounded rounded-t-lg overflow-hidden shadow-lg flex flex-col mx-auto p-0">
                                    <div className="relative w-full aspect-[4/3] bg-neutral-100 flex-shrink-0">
                                        {image ? (
                                            <img
                                                className="w-full h-full object-cover object-center rounded-t-lg transition-transform duration-200 hover:scale-105 cursor-pointer"
                                                src={getImageUrl(image?.url)}
                                                alt={property.title}
                                                onClick={() => window.location.href = `/properties/${property.id}`}
                                                style={{ display: 'block' }}
                                            />
                                        ) : (
                                            <Building2 className="h-16 w-16 text-neutral-300 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                                        )}
                                    </div>
                                    <div className="px-4 py-4 flex-1 flex flex-col">
                                        <div className="font-bold text-xl mb-2 truncate text-neutral-900 dark:text-white">{property.title}</div>
                                        <div className="text-lg font-bold text-orange-700 dark:text-orange-400 mb-2">{property.price?.display_price ?? (property.price?.amount ? `$${Number(property.price.amount).toLocaleString()}` : 'Contact for price')}</div>
                                        <div className="flex gap-3 text-sm text-neutral-500 mb-2">
                                            {property.beds && (
                                                <span><Home className="mr-1 inline h-4 w-4" />{property.beds} Beds</span>
                                            )}
                                            {property.baths && (
                                                <span><Bath className="mr-1 inline h-4 w-4" />{property.baths} Baths</span>
                                            )}
                                            {property.parking_spaces && (
                                                <span><CarFront className="mr-1 inline h-4 w-4" />{property.parking_spaces} Parking</span>
                                            )}
                                        </div>
                                        <Link href={`/properties/${property.id}`} className="mt-2 text-sm text-orange-600 hover:underline">View Details</Link>
                                    </div>
                                </Card>
                            );
                        })}
                    </div>
                </section>
            </div>
        </AppLayout>
    );
}
