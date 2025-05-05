import { generateReactHelpers } from "@uploadthing/react";
import type { OurFileRouter } from "../app/api/uploadthing/core";

// Export react hooks
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>();

// Create an instance of UploadThing's API
// This can be used in server contexts
export const createUTApi = () => {
  const { UTApi } = require("uploadthing/server");
  return new UTApi();
};
