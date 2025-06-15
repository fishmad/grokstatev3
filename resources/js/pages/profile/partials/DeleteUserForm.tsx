import React, { FormEvent, useState } from 'react';
import { useForm } from '@inertiajs/react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from "@/components/ui/dialog"

interface DeleteUserFormProps {
    className?: string;
}

const DeleteUserForm: React.FC<DeleteUserFormProps> = ({ className }) => {
    const [confirmingUserDeletion, setConfirmingUserDeletion] = useState(false);
    const { data, setData, delete: destroy, processing, errors, reset } = useForm({
        password: '',
    });

    const confirmUserDeletion = () => {
        setConfirmingUserDeletion(true);
    };

    const closeModal = () => {
        setConfirmingUserDeletion(false);
        reset();
    };

    const deleteUser = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        destroy(route('profile.destroy'), {
            preserveScroll: true,
            onSuccess: () => closeModal(),
            // onError: () => { /* Focus password input or show error */ },
            // onFinish: () => reset(), // Reset form on finish regardless of success/error
        });
    };

    return (
        <Card className={className}>
            <CardHeader>
                <CardTitle>Delete Account</CardTitle>
                <CardDescription>
                    Once your account is deleted, all of its resources and data will be permanently deleted.
                    Before deleting your account, please download any data or information that you wish to retain.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Dialog open={confirmingUserDeletion} onOpenChange={setConfirmingUserDeletion}>
                    <DialogTrigger asChild>
                        <Button variant="destructive" onClick={confirmUserDeletion}>Delete Account</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <form onSubmit={deleteUser}>
                            <DialogHeader>
                                <DialogTitle>Are you sure you want to delete your account?</DialogTitle>
                                <DialogDescription>
                                    Once your account is deleted, all of its resources and data will be permanently deleted.
                                    Please enter your password to confirm you would like to permanently delete your account.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="py-4">
                                <Label htmlFor="password_delete_account" className="sr-only">Password</Label>
                                <Input
                                    id="password_delete_account"
                                    type="password"
                                    name="password"
                                    value={data.password}
                                    onChange={(e) => setData('password', e.target.value)}
                                    placeholder="Password"
                                    required
                                    autoFocus
                                />
                                {errors.password && <p className="text-sm text-red-600 mt-1">{errors.password}</p>}
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button type="button" variant="outline" onClick={closeModal}>Cancel</Button>
                                </DialogClose>
                                <Button type="submit" variant="destructive" disabled={processing} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                    {processing ? 'Deleting...' : 'Delete Account'}
                                </Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card>
    );
};

export default DeleteUserForm;
