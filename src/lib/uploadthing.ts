import { generateReactHelpers } from "@uploadthing/react";
import { createUploadthing } from "uploadthing/next";

export type FileRouterType = {
  imageUploader: {
    file: {
      url: string;
    };
    input: null;
  };
};

export const { useUploadThing, uploadFiles } = generateReactHelpers<FileRouterType>();

// Create an instance of UploadThing's API
// This can be used in server contexts
export const createUTApi = () => {
  const { UTApi } = require("uploadthing/server");
  return new UTApi();
};
