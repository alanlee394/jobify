'use server'

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { auth } from "@/lib/auth"; 
import { revalidatePath } from "next/cache"; 
import OpenAI from "openai";

export async function signup(prevState: { error: string | null }, formData: FormData) {
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { error: "Email and password are required." };
  }
  
  try {
    // 1. Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { error: "A user with this email already exists." };
    }

    // 2. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Create user
    await prisma.user.create({
      data: {
        email,
        password: hashedPassword,
      },
    });

  } catch (e) {
      console.error("Signup failed:", e); 
      return { error: "An unexpected server error occurred." };
  }

  // >>> THE FIX: Move redirect HERE, outside the try/catch block <<<
  // If the code reaches here, it means no errors happened above.
  redirect("/login"); 
}

export async function createJob(prevState: any, formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.email) {
    return { error: "You must be logged in to add a job." };
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return { error: "User not found." };

  const company = formData.get("company") as string;
  const position = formData.get("position") as string;
  const status = formData.get("status") as string;
  const description = formData.get("description") as string;

  try {
    await prisma.job.create({
      data: {
        userId: user.id,
        company,
        position,
        status: status || "RESEARCHING",
      },
    });

    revalidatePath("/dashboard"); 

  } catch (e) {
    // We only want to catch ACTUAL errors (like database connection failing)
    console.error(e);
    return { error: "Failed to create job." };
  }

  redirect("/dashboard");
}


// 1. UPDATE JOB
// Notice: We removed 'jobId' from the arguments list
export async function updateJob(prevState: any, formData: FormData) {
  const session = await auth();
  
  if (!session?.user?.email) return { error: "Unauthorized" };

  // 1. Get the ID from the Hidden Input we will add later
  const jobId = formData.get("jobId") as string; 
  
  console.log("Attempting to update job:", jobId); // <--- Debug Log

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return { error: "User not found." };

  // 2. Security Check (Ownership)
  const existingJob = await prisma.job.findFirst({
    where: {
      id: jobId,
      userId: user.id 
    }
  });

  if (!existingJob) {
    console.log("Job not found or unauthorized");
    return { error: "Job not found." };
  }

  // 3. Extract Data
  const company = formData.get("company") as string;
  const position = formData.get("position") as string;
  const status = formData.get("status") as string;
  const description = formData.get("description") as string;

  try {
    // 4. Update
    await prisma.job.update({
      where: { id: jobId },
      data: {
        company,
        position,
        status,
        description,
      },
    });

    console.log("Update successful!");
    revalidatePath("/dashboard");

  } catch (e) {
    console.error("Update failed:", e);
    return { error: "Failed to update job." };
  }

  // 5. Redirect
  redirect("/dashboard");
}
// 2. DELETE JOB
export async function deleteJob(formData: FormData) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Unauthorized" };

  // FIX: Get ID from the form instead of argument
  const jobId = formData.get("jobId") as string;

  try {
    await prisma.job.delete({
      where: { 
        id: jobId,
        // Ensure the user owns this job before deleting
        userId: (await prisma.user.findUnique({ where: { email: session.user.email } }))?.id 
      },
    });
    
    revalidatePath("/dashboard");
  } catch (e) {
    return { error: "Failed to delete job" };
  }

  redirect("/dashboard");
}

export async function generateGlobalAdvice() {
  const session = await auth();
  if (!session?.user?.email) return { error: "Unauthorized" };

  // Fetch ALL jobs
  const jobs = await prisma.job.findMany({
    where: { user: { email: session.user.email } },
  });

  const total = jobs.length;
  const interviewing = jobs.filter(j => j.status === 'INTERVIEW').length;
  const offers = jobs.filter(j => j.status === 'OFFER').length;
  const rejected = jobs.filter(j => j.status === 'REJECTED').length;

  const prompt = `
    I am a job seeker in Singapore using a tracking app. Here is my current dashboard data:
    - Total Applications: ${total}
    - Interviews: ${interviewing}
    - Offers: ${offers}
    - Rejections: ${rejected}
    
    Here is a list of my recent activity:
    ${jobs.map(j => `- ${j.position} at ${j.company} (${j.status})`).join('\n')}

    Please act as a Senior Career Coach.
    1. Analyze my "Funnel" (Conversion rates).
    2. Identify any bottlenecks (e.g. if many applied but no interviews).
    3. Give me 3 strategic goals for next week.
    
    Format nicely with Markdown.
  `;

  const openai = new OpenAI();
  
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini", 
    });

    return { advice: completion.choices[0].message.content };
  } catch (e) {
    console.error("AI Error:", e);
    return { error: "Failed to generate global advice." };
  }
}

export async function generateJobSpecificAdvice(jobId: string) {
  const session = await auth();
  if (!session?.user?.email) return { error: "Unauthorized" };

  const job = await prisma.job.findUnique({
    where: { id: jobId, user: { email: session.user.email } },
  });

  if (!job) return { error: "Job not found" };

  const prompt = `
    I am applying for **${job.position}** at **${job.company} Singapore**.
    Status: ${job.status}.
    Description: "${job.description || "N/A"}"

    Give me:
    1. 3 Interview Questions specific to this role.
    2. Key keywords for my resume.
    3. One tactical tip to stand out.
  `;

  const openai = new OpenAI();
  
  try {
    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-4o-mini",
    });

    return { advice: completion.choices[0].message.content };
  } catch (e) {
    return { error: "Failed to generate specific advice." };
  }
}