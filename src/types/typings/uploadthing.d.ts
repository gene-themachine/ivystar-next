// Type declarations for @uploadthing packages
declare module "@uploadthing/react" {
  import type { FileRouter } from "uploadthing/next";
  
  export function generateReactHelpers<T extends FileRouter>(): {
    useUploadThing: (fileRoute?: keyof T) => {
      startUpload: (files: File[]) => Promise<any>;
      permittedFileInfo: any;
      isUploading: boolean;
    };
    uploadFiles: (input: { endpoint: keyof T; files: File[] }) => Promise<any>;
  };
}

declare module "uploadthing/server" {
  export class UTApi {
    deleteFiles: (fileKeys: string[]) => Promise<any>;
  }
  
  export class UploadThingError extends Error {
    constructor(message: string);
  }
} 