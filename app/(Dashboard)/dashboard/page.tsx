'use client';
import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import { redirect, useRouter } from 'next/navigation';
import { ChevronsUpDown, Trash2, Pencil, Search } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/components/ui/use-toast";

const UserManagement = () => {
  const [users, setUsers] = useState<any[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: string; direction: string } | null>(null);
  const [pendingUpdates, setPendingUpdates] = useState<{ email: string; newStatus?: boolean }[]>([]);
  const supabase = createClient();
  const router = useRouter();
  const { toast } = useToast();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserAccess = async () => {
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
          else {
            toast({
              title: `Access Restricted`,
              description: `You have no access to the application.`,
            });
            await supabase.auth.signOut();
            return router.push("/login");
          }

        }
      }
    };

    fetchUserAccess();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data, error } = await supabase.from('users').select('id, username, email, access, status');
      if (error) {
        console.error('Error fetching users:', error);
      } else {
        const formattedUsers = data
          .filter(user => user.access !== 'super admin') // Filter out super admin users
          .map((user, index) => ({
            id: user.id,
            name: user.username || `User${index + 1}`,
            email: user.email,
            role: user.access,
            status: user.status,
          }));

        setUsers(formattedUsers);
        setFilteredUsers(formattedUsers);
      }
    };
    fetchUsers();
  }, [supabase]);

  useEffect(() => {
    const results = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(results);
  }, [searchTerm, users]);


  const handleToggleStatus = (index: number) => {
    const updatedUser = filteredUsers[index];
    if (updatedUser.role === 'super admin') return;
    const newStatus = !updatedUser.status;

    // Update pendingUpdates state
    setPendingUpdates((prev) => {
      const existingUpdate = prev.find((update) => update.email === updatedUser.email);
      if (existingUpdate) {
        return prev.map((update) =>
          update.email === updatedUser.email ? { ...update, newStatus } : update
        );
      }
      return [...prev, { email: updatedUser.email, newStatus }];
    });

    // Update the status in the filteredUsers state immediately for UI feedback
    setFilteredUsers((prev) => {
      const updatedUsers = [...prev];
      updatedUsers[index].status = newStatus;
      return updatedUsers;
    });
  };

  const handleDeleteUser = (email: string) => {
    // Update pendingUpdates state for deletion
    setPendingUpdates((prev) => [...prev, { email }]);

    // Update the filteredUsers state immediately for UI feedback
    setFilteredUsers((prev) => prev.filter((user) => user.email !== email));
  };

  const handleEditUser = (id: string) => {
    const user = filteredUsers.find(user => user.id === id);
    if (user && user.role === 'super admin') return;
    router.push(`/dashboard/${id}`);
  };

  const handleSort = (key: string) => {
    let direction = 'ascending';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
    setFilteredUsers((prev) =>
      [...prev].sort((a, b) => {
        if (a[key] < b[key]) {
          return direction === 'ascending' ? -1 : 1;
        }
        if (a[key] > b[key]) {
          return direction === 'ascending' ? 1 : -1;
        }
        return 0;
      })
    );
  };

  const handlecancel = async () => {
    window.location.reload();
  }

  const handleUpdate = async () => {
    // Process all pending updates
    for (const update of pendingUpdates) {
      if (update.newStatus !== undefined) {
        const { error } = await supabase
          .from('users')
          .update({ status: update.newStatus })
          .eq('email', update.email);
        toast({
          title: `Status updated successfully`,
          description: `Updated at ${new Date().toLocaleString()}`,
        });

        if (error) {
          console.error('Error updating status:', error);
        }
      } else {
        const { error } = await supabase
          .from('users')
          .delete()
          .eq('email', update.email);
        toast({
          title: `User deleted successfully`,
          description: `Deleted at ${new Date().toLocaleString()}`,
        });

        if (error) {
          console.error('Error deleting user:', error);
        }
      }
    }

    // Re-fetch users after processing updates
    const { data, error } = await supabase.from('users').select('id, username, email, access, status');
    if (error) {
      console.error('Error fetching users:', error);
    } else {
      const formattedUsers = data.filter(user => user.access !== 'super admin').map((user, index) => ({
        id: user.id,
        name: user.username || `User${index + 1}`,
        email: user.email,
        role: user.access,
        status: user.status,
      }));
      setUsers(formattedUsers);
      setFilteredUsers(formattedUsers);
    }

    // Clear pending updates
    setPendingUpdates([]);
  };

  return (
    isAdmin ? (
      <div className="p-4">
        <div className="border border-[#D4D4D8] rounded-[6px]">
          <div className="flex justify-between bg-[#FAFAFA] p-2 rounded-t-[6px]">
            <div className="flex flex-col gap-2">
              <h1 className="text-[16px] font-bold text-primary-text_primary">Super Admin Settings</h1>
              <p className="text-sm">Manage user permissions and administrative controls</p>
            </div>
            <div className="flex gap-4 justify-center items-center">

              <button type='button' onClick={handlecancel} className="border rounded py-[10px] px-6 text-sm font-medium border-[#D4D4D8]">Discard changes</button>

              <button onClick={handleUpdate} className="border rounded text-white bg-primary-accent h-10 px-10 text-sm font-medium border-primary-accent hover:bg-[#32A0FF]">
                Update
              </button>
            </div>
          </div>
          <div className='p-2'>
            <div className="my-4 flex flex-row justify-between items-center gap-2">
              <div className="relative ">
                <Search size={18} className="text-gray-500 absolute left-3 top-3" />
                <input
                  type="text"
                  placeholder="Search by username or email"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full border border-gray-300 rounded px-10 text-sm h-10 py-1 focus:outline-none focus:ring-1 focus:ring-primary-accent"
                />
              </div>
              <Link href="/dashboard/add-user">
                <button
                  type="button"
                  className="py-2 px-4 border text-sm  rounded text-grey whitespace-nowrap text-primary-accent flex items-center gap-2"
                >
                  Add New User
                </button>
              </Link>
            </div>

            <table className="w-full border rounded-[6px] border-[#D4D4D8] font-semibold">
              <thead>
                <tr>
                  <th className="px-2 py-1 border-r border-b h-10 border-[#D4D4D8] w-[20%]">
                    <div className="flex items-center gap-2 px-2">
                      <span className="text-sm text-[#71717A] font-normal">Name</span>
                      <button type="button" onClick={() => handleSort('name')} className="flex items-center gap-2">
                        <ChevronsUpDown size={10} />
                      </button>
                    </div>
                  </th>
                  <th className="px-2 py-1 border-r border-b border-[#D4D4D8] w-[30%]">
                    <div className="flex items-center gap-2 px-2">
                      <span className="text-sm text-[#71717A] font-normal">Email</span>
                      <button type="button" onClick={() => handleSort('email')} className="flex items-center gap-2">
                        <ChevronsUpDown size={10} />
                      </button>
                    </div>
                  </th>
                  <th className="px-2 py-1 border-r border-b border-[#D4D4D8] w-[20%]">
                    <div className="flex items-center gap-2 px-2">
                      <span className="text-sm text-[#71717A] font-normal">Role</span>
                      <button type="button" onClick={() => handleSort('role')} className="flex items-center gap-2">
                        <ChevronsUpDown size={10} />
                      </button>
                    </div>
                  </th>
                  <th className="px-2 py-1 border-r border-b border-[#D4D4D8] w-[20%] text-center">
                    <div className="flex items-center gap-2 px-2 justify-center">
                      <span className="text-sm text-[#71717A] font-normal">Status</span>
                      <button type="button" onClick={() => handleSort('status')} className="flex items-center gap-2">
                        <ChevronsUpDown size={10} />
                      </button>
                    </div>
                  </th>
                  <th className="px-2 py-1 text-sm text-[#71717A] border-b border-[#D4D4D8] font-normal w-[10%] text-center">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user, index) => (
                  <tr key={user.email} className={user.status ? '' : 'bg-gray-100'}>
                    <td className={`p-3 border-b border-[#D4D4D8] text-sm ${user.status ? 'text-primary-text_primary' : 'text-gray-500'}`}>
                      {user.name}
                    </td>
                    <td className={`p-3 border-b border-[#D4D4D8] text-sm ${user.status ? 'text-primary-text_primary' : 'text-gray-500'}`}>
                      {user.email}
                    </td>
                    <td className={`p-3 border-b border-[#D4D4D8] text-sm ${user.status ? 'text-primary-text_primary' : 'text-gray-500'}`}>
                      {user.role}
                    </td>
                    <td className={`p-3 border-b border-[#D4D4D8] text-sm text-center ${user.status ? 'text-primary-text_primary' : 'text-gray-500'}`}>
                      <label className="inline-flex relative items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={user.status}
                          onChange={() => handleToggleStatus(index)}
                          className="sr-only peer"
                          disabled={user.role === 'super admin'}
                        />
                        <div className={`w-11 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none  transition duration-200 ease-in-out ${user.status ? 'bg-primary-accent' : ''}`} >
                          <span className={`absolute w-5 h-5 -ml-5 mt-[2px] bg-white rounded-full shadow transition-transform duration-200 ease-in-out ${user.status ? 'translate-x-5' : 'translate-x-0'}`} />
                        </div>
                      </label>
                    </td>
                    <td className="p-3 border-b border-[#D4D4D8] text-center">
                      <button onClick={() => handleEditUser(user.id)} disabled={user.role === 'super admin'} className="text-primary-text_primary mr-3">
                        <Pencil size={18} />
                      </button>
                      <button onClick={() => handleDeleteUser(user.email)} disabled={user.role === 'super admin'} className="text-primary-text_primary">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    ) : (null));
};

export default UserManagement;
