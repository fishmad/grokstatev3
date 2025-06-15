import React, { useState, ChangeEvent, FormEvent } from 'react';
import { Head, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useInitials } from '@/hooks/use-initials';
import { User } from '@/types'; // Assuming User type is defined in types
import UpdatePasswordForm from './partials/UpdatePasswordForm'; // Added import
import DeleteUserForm from './partials/DeleteUserForm'; // Added import

interface ProfileEditPageProps {
    auth: {
        user: User;
    };
    mustVerifyEmail?: boolean;
    status?: string;
    errors?: any;
}

const ProfileEditPage: React.FC<ProfileEditPageProps> = ({ auth, mustVerifyEmail, status }) => {
    const user = auth.user;
    const getInitials = useInitials();
    const [previewImage, setPreviewImage] = useState<string | null>(user.profile_picture_url || null);

    const { data, setData, post, processing, errors, recentlySuccessful } = useForm({
        name: user.name || '',
        email: user.email || '',
        phone_number: user.phone_number || '',
        profile_picture: null as File | null,
        _method: 'patch', // Or 'put' depending on your route definition for updates
    });

    const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setData('profile_picture', file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        // 'profile.update' is a common convention, adjust if your route is different
        post(route('profile.update'), {
            forceFormData: true, // Important for file uploads
            onSuccess: () => {
                // Optionally clear the file input or reset preview if needed
                // If the backend returns the new profile_picture_url, update previewImage
                // For now, we assume the page reloads with new props or user navigates away.
            },
        });
    };

    return (
        <>
            <Head title="Profile" />
            <div className="py-12">
                <div className="max-w-2xl mx-auto sm:px-6 lg:px-8 space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle>Profile Information</CardTitle>
                            <CardDescription>Update your account's profile information and email address.</CardDescription>
                        </CardHeader>
                        <form onSubmit={handleSubmit}>
                            <CardContent className="space-y-6">
                                <div className="space-y-2">
                                    <Label htmlFor="profile_picture">Profile Picture</Label>
                                    <div className="flex items-center space-x-4">
                                        <Avatar className="w-20 h-20">
                                            <AvatarImage src={previewImage || undefined} alt={user.name} />
                                            <AvatarFallback className="text-2xl">{getInitials(user.name)}</AvatarFallback>
                                        </Avatar>
                                        <Input
                                            id="profile_picture"
                                            type="file"
                                            className="block w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20"
                                            onChange={handleImageChange}
                                            accept="image/png, image/jpeg, image/gif"
                                        />
                                    </div>
                                    {errors.profile_picture && <p className="text-sm text-red-600 mt-1">{errors.profile_picture}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        required
                                        autoComplete="name"
                                    />
                                    {errors.name && <p className="text-sm text-red-600 mt-1">{errors.name}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        required
                                        autoComplete="email"
                                    />
                                    {errors.email && <p className="text-sm text-red-600 mt-1">{errors.email}</p>}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="phone_number">Phone Number (Optional)</Label>
                                    <Input
                                        id="phone_number"
                                        type="tel"
                                        value={data.phone_number}
                                        onChange={(e) => setData('phone_number', e.target.value)}
                                        autoComplete="tel"
                                    />
                                    {errors.phone_number && <p className="text-sm text-red-600 mt-1">{errors.phone_number}</p>}
                                </div>

                                {mustVerifyEmail && user.email_verified_at === null && (
                                    <div>
                                        <p className="text-sm mt-2 text-gray-800 dark:text-gray-200">
                                            Your email address is unverified.
                                            {/* Add link to resend verification email if using Laravel Breeze/Jetstream starter kits */}
                                            {/* <Link
                                                href={route('verification.send')}
                                                method="post"
                                                as="button"
                                                className="underline text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-800"
                                            >
                                                Click here to re-send the verification email.
                                            </Link> */}
                                        </p>
                                        {status === 'verification-link-sent' && (
                                            <div className="mt-2 font-medium text-sm text-green-600 dark:text-green-400">
                                                A new verification link has been sent to your email address.
                                            </div>
                                        )}
                                    </div>
                                )}
                            </CardContent>
                            <CardFooter className="flex justify-end">
                                <Button type="submit" disabled={processing}>
                                    {processing ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </CardFooter>
                        </form>
                    </Card>

                    {/* Update Password Section */}
                    <UpdatePasswordForm className="mt-6" />

                    {/* Delete Account Section */}
                    <DeleteUserForm className="mt-6" />
                </div>
            </div>
        </>
    );
};

export default ProfileEditPage;
