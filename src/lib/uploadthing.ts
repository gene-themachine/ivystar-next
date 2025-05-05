// Import types with a different syntax to avoid TS errors
import type { OurFileRouter } from "@/app/api/uploadthing/core";
// Use dynamic import with type assertion for the helper functions
import { generateReactHelpers } from "@uploadthing/react";

// Export react hooks with the proper typing
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();

// Create an instance of UploadThing's API
// This can be used in server contexts
export const createUTApi = () => {
  const { UTApi } = require("uploadthing/server");
  return new UTApi();
};
