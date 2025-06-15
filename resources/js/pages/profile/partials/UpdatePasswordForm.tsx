import React, { FormEvent } from 'react';
import { useForm } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';

interface UpdatePasswordFormProps {
    className?: string;
}

const UpdatePasswordForm: React.FC<UpdatePasswordFormProps> = ({ className }) => {
    const { data, setData, put, errors, reset, processing, recentlySuccessful } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const submit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        put(route('password.update'), {
            preserveScroll: true,
            onSuccess: () => reset(),
            // onError: (errors) => { /* Handle errors if needed */ }
        });
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Update Password</CardTitle>
                <CardDescription>
                    Ensure your account is using a long, random password to stay secure.
                </CardDescription>
            </CardHeader>
            <form onSubmit={submit}>
                <CardContent className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="current_password">Current Password</Label>
                        <Input
                            id="current_password"
                            type="password"
                            value={data.current_password}
                            onChange={(e) => setData('current_password', e.target.value)}
                            autoComplete="current-password"
                            required
                        />
                        {errors.current_password && <p className="text-sm text-red-600 mt-1">{errors.current_password}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">New Password</Label>
                        <Input
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                        {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password_confirmation">Confirm New Password</Label>
                        <Input
                            id="password_confirmation"
                            type="password"
                            value={data.password_confirmation}
                            onChange={(e) => setData('password_confirmation', e.target.value)}
                            autoComplete="new-password"
                            required
                        />
                        {errors.password_confirmation && <p className="text-sm text-red-600 mt-1">{errors.password_confirmation}</p>}
                    </div>
                </CardContent>
                <CardFooter className="flex justify-end items-center gap-4">
                    {recentlySuccessful && (
                        <p className="text-sm text-gray-600 dark:text-gray-400">Saved.</p>
                    )}
                    <Button type="submit" disabled={processing}>
                        {processing ? 'Saving...' : 'Save'}
                    </Button>
                </CardFooter>
            </form>
        </Card>
    );
};

export default UpdatePasswordForm;
