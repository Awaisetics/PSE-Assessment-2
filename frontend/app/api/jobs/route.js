// app/api/jobs/route.js
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import clientPromise from "@/lib/mongodb";
import { authOptions } from "@/lib/authOptions"; 

export async function GET() {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const client = await clientPromise;
        const db = client.db();
        const jobs = await db.collection("jobs").find({ userId: session.user.id }).toArray();
        return NextResponse.json(jobs);
    } catch (error) {
        console.error("Error fetching jobs:", error);
        return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
    }
}

export async function POST(request) {
    const session = await getServerSession(authOptions);
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    try {
        const { title, description } = await request.json();
        if (!title || !description) {
            return NextResponse.json({ error: "Missing fields" }, { status: 400 });
        }

        const newJob = {
            title,
            description,
            userId: session.user.id,
            createdAt: new Date(),
        };

        const client = await clientPromise;
        const db = client.db();
        const result = await db.collection("jobs").insertOne(newJob);
        newJob._id = result.insertedId;

        return NextResponse.json({ success: true, job: newJob });
    } catch (error) {
        console.error("Error creating job:", error);
        return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
    }
}
