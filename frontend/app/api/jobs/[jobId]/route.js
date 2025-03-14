// app/api/jobs/[jobId]/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/lib/authOptions"; 

export async function GET(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { jobId } = params;
        const client = await clientPromise;
        const db = client.db();
        const job = await db.collection("jobs").findOne({
            _id: new ObjectId(jobId),
            userId: session.user.id,
        });
        if (!job) return NextResponse.json({ error: "Job not found" }, { status: 404 });
        return NextResponse.json(job);
    } catch (error) {
        console.error("Error fetching job details:", error);
        return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
    }
}

export async function DELETE(request, { params }) {
    const session = await getServerSession(authOptions);
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { jobId } = params;
        const client = await clientPromise;
        const db = client.db();

        const result = await db.collection("jobs").deleteOne({
            _id: new ObjectId(jobId),
            userId: session.user.id,
        });

        if (result.deletedCount === 0) {
            return NextResponse.json(
                { error: "Job not found or unauthorized" },
                { status: 404 }
            );
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error deleting job:", error);
        return NextResponse.json(
            { error: "Failed to delete job" },
            { status: 500 }
        );
    }
}