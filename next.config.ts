import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow phone / other devices on the same Wi‑Fi to load the dev server.
  // Update this if your PC’s Wi‑Fi IP changes (ipconfig → Wi‑Fi IPv4).
  allowedDevOrigins: ["192.168.1.3"],
};

export default nextConfig;
