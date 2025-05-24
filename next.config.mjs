/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { hostname: "images.pexels.com" },
      { hostname: "res.cloudinary.com" },
      { hostname: "img.clerk.com" },
      { hostname: "sia.smakstpetrusende.sch.id" },
      { hostname: "145.79.13.76" },
    ],
  },
};

export default nextConfig;
