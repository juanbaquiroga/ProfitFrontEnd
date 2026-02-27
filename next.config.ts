import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ["http://192.168.1.58", "http://192.168.1.58:3000", "192.168.1.58", "localhost", "*"]
};

export default nextConfig;
