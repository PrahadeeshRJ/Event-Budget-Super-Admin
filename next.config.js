/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        remotePatterns: [
          {
            protocol: 'https',
            hostname: 'hasquqqqinpeknygoxmh.supabase.co',
            port: '', 
            pathname: '/storage/v1/object/public/Event-Budget/**',
          },
        ],
      },

};

module.exports = nextConfig;
