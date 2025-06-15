import PublicLayout from '@/layouts/public-layout';
import { type SharedData } from '@/types';
import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { useEffect } from 'react';

interface SavedSearchesCreateProps extends SharedData {
    searchParams: Record<string, string | number | null>; // Parameters passed from property search page
    [key: string]: any; // Add index signature
}

export default function SavedSearchesCreate() {
    const { searchParams, errors: pageErrors } = usePage<SavedSearchesCreateProps>().props;

    const { data, setData, post, processing, errors, reset } = useForm({
        name: 'My Custom Search',
        search_parameters: searchParams || {},
        receive_alerts: true as boolean, // Explicitly type as boolean
    });

    useEffect(() => {
        // Update form if searchParams prop changes (e.g., user navigates back and forth)
        setData('search_parameters', searchParams || {});
    }, [searchParams]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('saved-searches.store'), {
            onSuccess: () => reset(), // Reset form on success
        });
    };

    return (
        <PublicLayout>
            <Head title="Save Search Criteria" />
            <div className="container mx-auto py-6 px-4 md:px-6 max-w-2xl">
                <Card>
                    <CardHeader>
                        <CardTitle>Save Search Criteria</CardTitle>
                        <CardDescription>
                            Save your current property search filters to easily access them later and receive alerts.
                        </CardDescription>
                    </CardHeader>
                    <form onSubmit={handleSubmit}>
                        <CardContent className="space-y-6">
                            <div>
                                <Label htmlFor="name">Search Name</Label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="mt-1 block w-full"
                                    required
                                    autoFocus
                                />
                                {errors.name && <p className="mt-2 text-sm text-red-600">{errors.name}</p>}
                            </div>

                            <div>
                                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 mb-2">
                                    These criteria will be saved:
                                </h4>
                                <div className="bg-muted p-4 rounded-md space-y-1">
                                    {Object.entries(data.search_parameters).length > 0 ? (
                                        Object.entries(data.search_parameters).map(([key, value]) => {
                                            if (value !== null && value !== '') {
                                                return (
                                                    <p key={key} className="text-sm text-muted-foreground">
                                                        <span className="font-semibold capitalize">{key.replace(/_/g, ' ')}:</span> {String(value)}
                                                    </p>
                                                );
                                            }
                                            return null;
                                        })
                                    ) : (
                                        <p className="text-sm text-muted-foreground">
                                            No specific search criteria selected. This will save a general search.
                                        </p>
                                    )}
                                </div>
                                {errors.search_parameters && <p className="mt-2 text-sm text-red-600">{errors.search_parameters}</p>}
                            </div>

                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="receive_alerts"
                                    checked={data.receive_alerts}
                                    onCheckedChange={(checked) => setData('receive_alerts', Boolean(checked))}
                                />
                                <Label htmlFor="receive_alerts" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                                    Receive email alerts for new properties matching this criteria?
                                </Label>
                                {errors.receive_alerts && <p className="mt-2 text-sm text-red-600">{errors.receive_alerts}</p>}
                            </div>

                        </CardContent>
                        <CardFooter className="flex justify-end space-x-2">
                            <Button type="button" variant="outline" asChild>
                                <Link href={route('saved-searches.index')}>Cancel</Link>
                            </Button>
                            <Button type="submit" disabled={processing}>
                                {processing ? 'Saving...' : 'Save Search'}
                            </Button>
                        </CardFooter>
                    </form>
                </Card>
            </div>
        </PublicLayout>
    );
}
