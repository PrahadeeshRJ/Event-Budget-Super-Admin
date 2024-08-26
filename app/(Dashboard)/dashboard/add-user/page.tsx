'use client';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import { Input } from '@/components/ui/input';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useToast } from "@/components/ui/use-toast";
import { useEffect} from 'react';

const UserManagement: React.FC = () => {
    const [newUser, setNewUser] = useState({ username: '', email: '', access: 'user', status: 'TRUE' });
    const supabase = createClient();
    const router = useRouter();
    const { toast } = useToast();
    const [isAdmin, setIsAdmin] = useState(false);

    const handleAddUser = async (event: FormEvent) => {
        event.preventDefault();

        const { error } = await supabase.from('users').insert([
            {
                username: newUser.username,
                email: newUser.email,
                access: newUser.access ,
                status: newUser.status === 'TRUE', // Convert status to boolean
            },
        ]);

        if (error) {
            console.error('Error adding user:', error);
        } else {
            setNewUser({ username: '', email: '', access: 'user', status: 'TRUE' });
            toast({
                title: `User added successfully`,
                description: `Created at ${new Date().toLocaleString()}`,
              });
              router.push('/dashboard'); 
        }
    };
    console.log('newUser', newUser);

    useEffect(() => {
        const fetchUserAccess = async () => {
            console.log('fetchUserAccess');
          const { data } = await supabase.auth.getSession();
    
          if (data?.session) {
            const userEmail = data.session.user?.email;
    
            if (userEmail) {
              // Query the users table to check access
              const { data: userData, error } = await supabase
                .from('users')
                .select('access')
                .eq('email', userEmail)
                .single();
              console.log(userData?.access);
    
              if (userData?.access === 'super admin') {
                setIsAdmin(true);
              }
              
            }
          }
        };
    
        fetchUserAccess();
      }, []);

    return (
        isAdmin ? (
        <div className="p-4">
              <form onSubmit={handleAddUser}>
            <div className="border border-[#D4D4D8] rounded-[6px] h-[86vh]">
                <div className="flex justify-between bg-[#FAFAFA] p-2 rounded-t-[6px]">
                    <div className="flex flex-col gap-2">
                        <h1 className="text-[16px] font-bold text-primary-text_primary">Add Admin</h1>
                        <p className="text-sm">Enter the details to add a new admin.</p>
                    </div>
                    <div className="flex gap-4 justify-center items-center">
                        <Link href="/dashboard">
                            <button type='button' className="border rounded py-[10px] px-6 text-sm font-medium border-[#D4D4D8]">Cancel</button>
                        </Link>
                            <button type='submit'  className="border rounded text-white bg-primary-accent h-10 px-10 text-sm font-medium border-primary-accent hover:bg-[#32A0FF]">
                                Update
                            </button>
                    </div>
                </div>
                <div className="grid gap-4 p-2 mt-2">
                        <div className="flex flex-row gap-3">
                            <div className="grid items-center gap-2 w-[50%]">
                                <label htmlFor="user-username" className="block text-sm font-medium text-gray-700">Username</label>
                                <Input
                                    id="user-username"
                                    value={newUser.username}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewUser({ ...newUser, username: e.target.value })}
                                    placeholder="Username"
                                    className="h-10 border-[#D4D4D8] placeholder:text-[#A1A1AA] rounded-[6px]"
                                    required
                                />
                            </div>
                            <div className="grid items-center gap-2 w-[50%]">
                                <label htmlFor="user-email" className="block text-sm font-medium text-gray-700">Email</label>
                                <Input
                                    id="user-email"
                                    type="email"
                                    value={newUser.email}
                                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewUser({ ...newUser, email: e.target.value })}
                                    placeholder="Email"
                                    className="h-10 border-[#D4D4D8] placeholder:text-[#A1A1AA] rounded-[6px]"
                                    required
                                />
                            </div>
                        </div>
                        <div className="flex flex-row gap-3 mt-2">
                            <div className="grid items-center gap-2 w-[50%]">
                                <label htmlFor="user-role" className="block text-sm font-medium text-gray-700">Role</label>
                                <select
                                    id="user-role"
                                    value={newUser.access}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewUser({ ...newUser, access: e.target.value })}
                                    className="h-10 border border-[#D4D4D8] rounded-[6px] text-sm focus-visible:outline-none px-2"
                                    required
                                >
                                    <option value="admin" className='text-sm'>Admin</option>
                                    <option value="user" className='text-sm'>User</option>
                                </select>
                            </div>
                            <div className="grid items-center gap-2 w-[50%]">
                                <label htmlFor="user-status" className="block text-sm font-medium text-gray-700">Status</label>
                                <select
                                    id="user-status"
                                    value={newUser.status}
                                    onChange={(e: ChangeEvent<HTMLSelectElement>) => setNewUser({ ...newUser, status: e.target.value })}
                                    className="h-10 border border-[#D4D4D8] rounded-[6px] text-sm focus-visible:outline-none px-2"
                                    required
                                >
                                    <option value="FALSE" className='text-sm'>Inactive</option>
                                    <option value="TRUE" className='text-sm'>Active</option>
                                </select>
                            </div>
                        </div>
                       
                    
                </div>
            </div>
            </form>
        </div>):(null)
    );
};

export default UserManagement;
