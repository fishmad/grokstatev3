import React from 'react';
import { Head, useForm, router } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';

interface SavedSearch {
    id: number;
    name: string;
    search_parameters: {
        location?: string;
        type?: string;
        bedrooms?: number;
        bathrooms?: number;
        min_price?: number;
        max_price?: number;
    };
    receive_alerts: boolean;
    user_id: number;
    created_at: string;
    updated_at: string;
}

interface EditSavedSearchPageProps {
    auth: any; // Adjust according to your auth prop structure
    savedSearch: SavedSearch;
    errors?: any; // Adjust according to your errors prop structure
}

const EditSavedSearchPage: React.FC<EditSavedSearchPageProps> = ({ auth, savedSearch, errors }) => {
    const { data, setData, put, processing, errors: formErrors, reset } = useForm({
        name: savedSearch.name || '',
        search_parameters: {
            location: savedSearch.search_parameters?.location || '',
            type: savedSearch.search_parameters?.type || '',
            bedrooms: savedSearch.search_parameters?.bedrooms || undefined,
            bathrooms: savedSearch.search_parameters?.bathrooms || undefined,
            min_price: savedSearch.search_parameters?.min_price || undefined,
            max_price: savedSearch.search_parameters?.max_price || undefined,
        },
        receive_alerts: savedSearch.receive_alerts || false,
    });

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('saved-searches.update', savedSearch.id), {
            preserveScroll: true,
            onSuccess: () => {
                // Optionally, handle success (e.g., show a notification)
            },
        });
    };

    const handleSearchParamChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setData('search_parameters', {
            ...data.search_parameters,
            [name]: value,
        });
    };
    
    const handleNumericSearchParamChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setData('search_parameters', {
            ...data.search_parameters,
            [name]: value === '' ? undefined : Number(value),
        });
    };

    return (
        <>
            <Head title="Edit Saved Search" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle>Edit: {savedSearch.name}</CardTitle>
                            <CardDescription>Update the details of your saved search.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Search Name</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="e.g., My Dream Beach House"
                                        required
                                    />
                                    {formErrors.name && <p className="text-sm text-red-600 mt-1">{formErrors.name}</p>}
                                </div>

                                {/* Search Parameters Fields - These are often not directly editable in a simple "edit name/alerts" form */}
                                {/* For this version, we will focus on editing the name and receive_alerts status as per the controller's update method */}
                                {/* If full parameter editing is needed, these fields would be similar to the create form */}
                                
                                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 pt-4 border-t border-gray-200 dark:border-gray-700">Search Criteria (Read-only)</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <p><strong>Location:</strong> {data.search_parameters.location || 'Any'}</p>
                                    <p><strong>Type:</strong> {data.search_parameters.type || 'Any'}</p>
                                    <p><strong>Bedrooms:</strong> {data.search_parameters.bedrooms ?? 'Any'}</p>
                                    <p><strong>Bathrooms:</strong> {data.search_parameters.bathrooms ?? 'Any'}</p>
                                    <p><strong>Min Price:</strong> {data.search_parameters.min_price ? `$${data.search_parameters.min_price.toLocaleString()}` : 'Any'}</p>
                                    <p><strong>Max Price:</strong> {data.search_parameters.max_price ? `$${data.search_parameters.max_price.toLocaleString()}` : 'Any'}</p>
                                </div>


                                <div className="flex items-center space-x-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                                    <Checkbox
                                        id="receive_alerts"
                                        checked={data.receive_alerts}
                                        onCheckedChange={(checked) => setData('receive_alerts', !!checked)}
                                    />
                                    <Label htmlFor="receive_alerts" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                        Receive email alerts for new properties matching this search?
                                    </Label>
                                </div>
                                {formErrors.receive_alerts && <p className="text-sm text-red-600 mt-1">{formErrors.receive_alerts}</p>}

                            </CardContent>
                            <CardFooter className="flex justify-between">
                                <Button type="button" variant="outline" onClick={() => router.get(route('saved-searches.index'))}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Updating...' : 'Update Search'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>
                </div>
            </div>
        </>
    );
};

export default EditSavedSearchPage;
