import { UTApi } from "uploadthing/server";
import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
// Import your database client if you have one
// import { db } from "@/lib/db";

export async function POST(request: Request) {
  // Verify user is authenticated
  const { userId } = await auth();
  if (!userId) {
    return new Response("Unauthorized", { status: 401 });
  }

  try {
    // Parse the request body to get the fileKey and any additional info
    const body = await request.json();
    const { fileKey, fileUrl } = body;

    if (!fileKey && !fileUrl) {
      return NextResponse.json({ error: "Either fileKey or fileUrl is required" }, { status: 400 });
    }

    // Initialize the UploadThing API
    const utapi = new UTApi();
    
    let keyToDelete = fileKey;
    
    // Extract key from URL if we only have the URL
    if (!keyToDelete && fileUrl) {
      try {
        const url = new URL(fileUrl);
        // The key is typically the last part of the path
        const pathParts = url.pathname.split('/');
        keyToDelete = pathParts[pathParts.length - 1];
      } catch (e) {
        console.error("Failed to parse URL:", e);
        return NextResponse.json({ error: "Invalid file URL format" }, { status: 400 });
      }
    }
    
    console.log("Attempting to delete file with key:", keyToDelete);
    
    // Delete the file from UploadThing
    const result = await utapi.deleteFiles(keyToDelete);
    console.log("Delete result:", result);
    
    // If you have a separate database storing file references,
    // you would delete those references here
    
    /* Example database operations (uncomment and adapt if needed)
    
    if (fileUrl) {
      // If using a SQL database like Prisma
      // await db.files.deleteMany({
      //   where: { url: fileUrl }
      // });
      
      // If using a NoSQL database like MongoDB
      // await db.collection('files').deleteMany({ url: fileUrl });
    }
    
    */
    
    // Since we're only using Clerk metadata for file references,
    // and those are updated in the profile page when replacing the image,
    // no additional database operations are needed here.

    return NextResponse.json({ success: true, deletedKey: keyToDelete });
  } catch (error) {
    console.error("Error deleting file:", error);
    return NextResponse.json(
      { error: "Failed to delete file", details: (error as Error).message },
      { status: 500 }
    );
  }
} 