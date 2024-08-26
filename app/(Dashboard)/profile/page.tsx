"use client";

import React, { useEffect, useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import Link from 'next/link';
import { Eye, EyeOff, Pencil } from 'lucide-react';

import { useToast } from "@/components/ui/use-toast";

const defaultUserImage = '/images/cropped-favicon-180x180.png'; // Set your default image path

const ProfileSettings = () => {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [username, setUsername] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const supabase = createClient();
  const { toast } = useToast();

  const fetchUserProfileImage = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (user) {
      const { data, error } = await supabase.storage
        .from('Event-Budget')
        .download(`users/${user.id}.png`);

      if (error) {
        console.error('Error fetching image:', error);
        setImageUrl(null);
      } else {
        const url = URL.createObjectURL(data);
        setImageUrl(url);
      }

      // Fetch user's email and username
      setEmail(user.email!);
      const { data: userData, error: fetchError } = await supabase
        .from('users')
        .select('username')
        .eq('email', user.email)
        .single();

      if (fetchError) {
        console.error('Error fetching username:', fetchError);
      } else {
        setUsername(userData?.username || ''); // Set username if exists
      }

      // Set user email
      setUserEmail(user.email!);
    }
  };

  useEffect(() => {
    fetchUserProfileImage();
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0] || null;
    setFile(selectedFile);

    if (selectedFile) {
      const preview = URL.createObjectURL(selectedFile);
      setPreviewUrl(preview);
    } else {
      setPreviewUrl(null);
    }
  };

  const handleUpload = async (event: React.FormEvent) => {
    event.preventDefault();

    const { data: { user }, error: userError } = await supabase.auth.getUser();

    if (!user) {
      setMessage("User is not authenticated. Please log in.");
      return;
    }

    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    const { error } = await supabase.storage
      .from('Event-Budget')
      .upload(`users/${user.id}.png`, file);

    if (error) {
      console.error('Upload error:', error);
      setMessage(`Upload failed: ${error.message}`);
    } else {
      setMessage('Upload successful!');
      fetchUserProfileImage();
      setTimeout(() => {
        window.location.reload();
      }, 0);
      setPreviewUrl(null);
    }

    setFile(null);
  };

  const handleDelete = async () => {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (!user) {
      setMessage("User is not authenticated. Please log in.");
      return;
    }

    const { error } = await supabase.storage
      .from('Event-Budget')
      .remove([`users/${user.id}.png`]);

    if (error) {
      console.error('Delete error:', error);
      setMessage(`Delete failed: ${error.message}`);
    } else {
      setMessage('Image deleted successfully!');
      setPreviewUrl(null);
      setImageUrl(defaultUserImage);
    }
  };

  const handleUsernameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(event.target.value);
  };

  const handleUpdate = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      // Update username
      const { error } = await supabase
        .from('users')
        .update({ username })
        .eq('email', user.email);

      if (error) {
        console.error('Error updating username:', error);
        setMessage('Failed to update username.');
        return; // Exit the function if there is an error
      }

      if (newPassword != confirmPassword) {
        setMessage('New Passwords and Confirm New Password doesn\'t match.');
        return;
      }
      if (newPassword && newPassword === confirmPassword) {
        const passwordError = await supabase.auth.updateUser({
          password: newPassword,
        });
        if (passwordError.error) {
          setMessage(passwordError.error.message);
          return; // Exit the function if there is an error
        } else {
          setNewPassword(''); // Clear the input
          setConfirmPassword(''); // Clear confirm password input
        }
      }

      // Show toast notification only if both updates were successful
      toast({
        title: `Profile Updated Successfully!`,
        description: `Changes saved at ${new Date().toLocaleString()}`,
      });

      // Optionally, reload the page after a delay
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };


  return (
    <div className="p-4">
      <div className="border border-[#D4D4D8] h-[86vh] rounded-[6px]">
        <div className="flex justify-between bg-[#FAFAFA] p-2 rounded-t-[6px]">
          <div className="flex flex-col gap-2">
            <h1 className="text-[16px] font-bold text-primary-text_primary">
              Super Admin Profile Settings
            </h1>
            <p className="text-sm">
              Update your personal information and account details.
            </p>
          </div>
          <div className="flex gap-4 justify-center items-center">
            <Link
              href={"/dashboard"}
              className="border rounded py-[10px] px-6 text-sm font-medium border-[#D4D4D8]"
            >
              Cancel
            </Link>
            <button
              type="button"
              onClick={handleUpdate}
              className="border rounded text-white bg-primary-accent py-[9px] px-10 text-sm font-medium border-primary-accent hover:bg-[#32A0FF]"
            >
              Update
            </button>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg  flex flex-col items-center">
          <h3 className='text-lg text-primary-text_primary font-semibold'>Avatar</h3>
          <div className="relative mb-4">

            <img
              src={imageUrl ||previewUrl || defaultUserImage}
              alt="Profile"
              className="w-32 h-32 rounded-full mb-2 border object-cover border-gray-500"
            />

            <button
              onClick={() => setShowPopup(true)}
              className="absolute bottom-2 right-0 bg-white rounded-full p-2 border border-gray-500"
            >
              <Pencil className="text-gray-700" size={14} />
            </button>
          </div>
          {showPopup && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 ">
              <div className="bg-white p-4 w-80 rounded">
                <h2 className="text-base font-bold text-center mb-2">Change or Delete Profile Image</h2>
                <div className="flex flex-col items-center mb-2">
                  {previewUrl ? (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-32 h-32 rounded-full mb-2 border object-cover"
                    />
                  ) : (
                    <img
                      src={defaultUserImage}
                      alt="Default Preview"
                      className="w-32 h-32 rounded-full mb-2 border object-cover"
                    />
                  )}
                </div>
                <form onSubmit={handleUpload}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="border p-2 rounded w-full mt-2 text-sm focus-visible:border-none border-[#D4D4D8]"
                    required
                  />
                  <button
                    type="submit"
                    className="mt-2 bg-blue-500 text-white rounded p-2 w-full text-sm"
                  >
                    Upload Image
                  </button>
                </form>
                <button
                  onClick={handleDelete}
                  className="mt-2 bg-red-500 text-white rounded p-2 w-full text-sm"
                >
                  Delete Image
                </button>
                <button
                  onClick={() => setShowPopup(false)}
                  className="mt-2 border rounded p-2 w-full text-center text-sm border-[#D4D4D8]"
                >
                  Cancel
                </button>
                <p className='text-xs text-center py-1'>Note: Delete image before uploading new image</p>
                {message && <p className="mt-2 text-center text-sm text-semibold text-red-500">{message}</p>}
              </div>
            </div>
          )}


          <div className="flex flex-row gap-4 w-full">
            <div className='flex flex-col w-1/2'>
              <label className='text-sm font-semibold text-primary-text_primary'>Super Admin Name</label>
              <div >
                <input
                  type="text"
                  value={username}
                  onChange={handleUsernameChange}
                  placeholder="Username"
                  className="border p-2 rounded w-full text-sm border-[#D4D4D8]"
                />
              </div>
              <div className='mt-2'>
                <label className='text-sm font-semibold text-primary-text_primary '>New Password</label>
                <div className="relative mb-6">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="New Password"
                    className="border border-[#D4D4D8] p-2 rounded w-full z-0 text-sm"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-2.5 text-sm  border-[#D4D4D8]"
                  >
                    {showPassword ? <EyeOff size={18} className='text-gray-500' /> : <Eye size={18} className='text-gray-500' />}
                  </button>
                </div>
              </div>

            </div>
            <div className='flex flex-col w-1/2'>
              <label className='text-sm font-semibold text-primary-text_primary '>Super Admin Email</label>
              <div >

                <input
                  type="email"
                  value={userEmail || email}
                  readOnly
                  className="border p-2 rounded w-full text-sm border-[#D4D4D8] bg-gray-100 pointer-events-none"
                />
              </div>

              <div className='mt-2'>
                <label className='text-sm font-semibold text-primary-text_primary mt-4'>Confirm New Password</label>
                <div className="relative mb-6">
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm Password"
                  className="border p-2 rounded w-full z-0 text-sm border-[#D4D4D8]"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-2.5 text-sm border-[#D4D4D8]"
                >
                  {showConfirmPassword ? <EyeOff size={18} className='text-gray-500' /> : <Eye size={18} className='text-gray-500' />}
                </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className='flex justify-center'>
          {message && <p className="mt-2 mb-2 text-sm text-red-500 font-semibold">{message}</p>}
        </div>
      </div>

    </div>
  );
};

export default ProfileSettings;
