/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ["randomuser.me"], // Allow images from randomuser.me
      },
    experimental:{
      serverActions:{
        bodySizeLimit:"5mb",
      },
    }
};

export default nextConfig;
