import React from 'react';
import Navbar from '@/components/navbar';
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className='h-max' >
      <Navbar />
      {children}
    </div>
  );

}
