import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { auth } from "@clerk/nextjs/server";

const f = createUploadthing();

export const ourFileRouter = {
  // Define file route for profile image uploads
  imageUploader: f({ image: { maxFileSize: "4MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const { userId } = await auth();

      // If you throw, the user will not be able to upload
      if (!userId) throw new UploadThingError("Unauthorized");

      // Whatever is returned here is accessible in onUploadComplete as `metadata`
      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code RUNS ON YOUR SERVER after upload
      console.log("Upload complete for userId:", metadata.userId);
      console.log("File URL:", file.url);

      // Return the file URL to be saved in the user metadata
      return { uploadedBy: metadata.userId, url: file.url };
    }),
    
  // New route for portfolio work samples
  portfolioUploader: f({ image: { maxFileSize: "8MB", maxFileCount: 1 } })
    .middleware(async ({ req }) => {
      // This code runs on your server before upload
      const { userId } = await auth();

      // If you throw, the user will not be able to upload
      if (!userId) throw new UploadThingError("Unauthorized");

      return { userId };
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Portfolio sample upload complete for userId:", metadata.userId);
      console.log("Sample File URL:", file.url);

      return { uploadedBy: metadata.userId, url: file.url };
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter; 