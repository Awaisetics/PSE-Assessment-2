// app/api/resumes/route.js
import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/authOptions';
import clientPromise from '@/lib/mongodb';
import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary using your environment variables
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function GET(request) {
    const url = new URL(request.url);
    const jobId = url.searchParams.get('jobId');
    if (!jobId) {
        return NextResponse.json({ error: 'Missing jobId' }, { status: 400 });
    }

    try {
        const client = await clientPromise;
        const db = client.db();
        const resumes = await db.collection('resumes').find({ jobId }).toArray();
        return NextResponse.json(resumes);
    } catch (error) {
        console.error('Error fetching resumes:', error);
        return NextResponse.json({ error: 'Failed to fetch resumes' }, { status: 500 });
    }
}

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    try {
        const formData = await request.formData();
        const file = formData.get('file');
        const jobId = formData.get('jobId');

        if (!file || !jobId) {
            return NextResponse.json({ error: 'Missing file or job id' }, { status: 400 });
        }

        // Preserve the original file name
        const originalFileName = file.name;

        // Convert the File object to a Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Upload to Cloudinary
        const uploadPromise = new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'resumes',
                    public_id: originalFileName, // keep file name unchanged
                    resource_type: 'auto',
                    type: 'upload', // ensure file is public
                    overwrite: true, // replace if file with same name exists
                },
                (error, result) => {
                    if (error) return reject(error);
                    resolve(result);
                }
            );
            uploadStream.end(buffer);
        });

        const result = await uploadPromise;

        // Save resume metadata in MongoDB
        const client = await clientPromise;
        const db = client.db();
        const resumeData = {
            jobId,
            userId: session.user.id,
            fileUrl: result.secure_url,
            originalFileName,
            createdAt: new Date(),
        };
        const dbResult = await db.collection('resumes').insertOne(resumeData);
        resumeData._id = dbResult.insertedId;

        return NextResponse.json({ success: true, resume: resumeData });
    } catch (error) {
        console.error('Resume upload error:', error);
        return NextResponse.json({ error: 'Failed to upload resume' }, { status: 500 });
    }
}
