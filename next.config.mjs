/** @type {import('next').NextConfig} */
const nextConfig = {
  trailingSlash: false, // <- Ensure this
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
