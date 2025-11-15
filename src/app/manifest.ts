import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Sense",
    short_name: "Sense",
    description: "Sense is a next-gen wearable that fuses camera, audio, and AI into a single smart assistant you carry everywhere",
    start_url: "/",
    scope: "/",
    display: "standalone",
    background_color: "#04020D",
    theme_color: "#04020D",
    orientation: "portrait",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "48x48 96x96 144x144 192x192 256x256",
        type: "image/x-icon",
      },
    ],
    shortcuts: [
      {
        name: "Order Sense",
        short_name: "Order",
        url: "/order",
      },
      {
        name: "Hardware Overview",
        short_name: "Hardware",
        url: "/hardware",
      },
    ],
  };
}


