'use client';
import React, { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";

const EditUser: React.FC<{ params: { id: string } }> = ({ params }) => {
    const { id } = params;
    const [userDetails, setUserDetails] = useState({ username: '', email: '', access: '', status: 'TRUE' });
    const supabase = createClient();
    const router = useRouter();
    const { toast } = useToast();

    // Fetch user details based on ID
    useEffect(() => {
        const fetchUser = async () => {
            if (id) {
                const { data, error } = await supabase
                    .from('users')
                    .select('username, email, access, status')
                    .eq('id', id)
                    .single();

                if (error) {
                    console.error('Error fetching user:', error);
                } else if (data) {
                    setUserDetails({
                        username: data.username || '',
                        email: data.email || '',
                        access: data.access || '',
                        status: data.status ? 'TRUE' : 'FALSE',
                    });
                }
            }
        };

        fetchUser();
    }, [id, supabase]);
    const handleUpdateUser = async (event: FormEvent) => {
        event.preventDefault();

        const { error } = await supabase
            .from('users')
            .update({
                username: userDetails.username,
                email: userDetails.email,
                access: userDetails.access,
                status: userDetails.status === 'TRUE',
            })
            .eq('id', id);

        if (error) {
            console.error('Error updating user:', error);
        } else {
            toast({
                title: `User updated successfully!`,
                description: `Updated at ${new Date().toLocaleString()}`,
              });
            router.push('/dashboard'); 
           
        }
    };

    return (
        <div className="p-4">
            <div className="border border-[#D4D4D8] rounded-[6px] h-[86vh]">
                <div className="flex justify-between bg-[#FAFAFA] p-2 rounded-t-[6px]">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-[16px] font-bold text-primary-text_primary">Edit User</h1>
                        <p className="text-sm">Modify the details of the user.</p>
                    </div>
                    <div className="flex gap-4 justify-center items-center">
                        <Link href="/dashboard">
                            <button type="button" className="border rounded py-[10px] px-6 text-sm font-medium border-[#D4D4D8]">
                                Cancel
                            </button>
                        </Link>
                            <button
                                type="submit"
                                onClick={handleUpdateUser}
                                className="border rounded text-white bg-primary-accent h-10 px-10 text-sm font-medium border-primary-accent hover:bg-[#32A0FF]"
                            >
                                Update
                            </button>
                    </div>
                </div>
                <div className="grid gap-4 p-2 mt-2">
                    <form>
                        <div className="flex flex-row gap-3">
                            <div className="grid items-center gap-2 w-[50%]">
                                <label htmlFor="user-username" className="block text-sm font-semibold text-primary-text_primary">
                                    Username
                                </label>
                                <Input
                                    id="user-username"
                                    value={userDetails.username}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        setUserDetails({ ...userDetails, username: e.target.value })
                                    }
                                    placeholder="Username"
                                    className="h-10 border-[#D4D4D8] placeholder:text-[#A1A1AA] rounded-[6px]"
                                    required
                                />
                            </div>
                            <div className="grid items-center gap-2 w-[50%]">
                                <label htmlFor="user-email" className="block text-sm font-semibold text-primary-text_primary">
                                    Email
                                </label>
                                <Input
                                    id="user-email"
                                    type="email"
                                    value={userDetails.email}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                                        setUserDetails({ ...userDetails, email: e.target.value })
                                    }
                                    placeholder="Email"
                                    className="h-10 border-[#D4D4D8] placeholder:text-[#A1A1AA] rounded-[6px]"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex flex-row gap-3 mt-4">
                            <div className="grid items-center gap-2 w-[50%]">
                                <label htmlFor="user-role" className="block text-sm font-semibold text-primary-text_primary">
                                    Role
                                </label>
                                <select
                                    id="user-role"
                                    value={userDetails.access}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                        setUserDetails({ ...userDetails, access: e.target.value })
                                    }
                                    className="h-10 border border-[#D4D4D8] rounded-[6px] text-sm focus-visible:outline-none px-2"
                                    required
                                >
                                    <option value="admin" className="text-sm">
                                        Admin
                                    </option>
                                    <option value="user" className="text-sm">
                                        User
                                    </option>
                                </select>
                            </div>
                            <div className="grid items-center gap-2 w-[50%]">
                                <label htmlFor="user-status" className="block text-sm font-semibold text-primary-text_primary">
                                    Status
                                </label>
                                <select
                                    id="user-status"
                                    value={userDetails.status}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                                        setUserDetails({ ...userDetails, status: e.target.value })
                                    }
                                    className="h-10 border border-[#D4D4D8] rounded-[6px] text-sm focus-visible:outline-none px-2"
                                    required
                                >
                                    <option value="FALSE" className="text-sm">
                                        Inactive
                                    </option>
                                    <option value="TRUE" className="text-sm">
                                        Active
                                    </option>
                                </select>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default EditUser;
