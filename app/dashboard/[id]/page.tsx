import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import EditJobForm from "./EditJobForm"; 

// Update the type definition to wrap params in a Promise
type Props = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailsPage({ params }: Props) {
  const session = await auth();
  
  // 1. >>> FIX: Await the params before using them <<<
  const { id } = await params; 

  if (!session?.user?.email) {
    redirect("/login");
  }

  // 2. >>> FIX: Use findFirst instead of findUnique <<<
  // This allows us to securely check both ID and User Ownership at the same time
  const job = await prisma.job.findFirst({
    where: { 
      id: id,
      user: { email: session.user.email } 
    },
  });

  if (!job) {
    // If job doesn't exist OR doesn't belong to this user
    redirect("/dashboard"); 
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-6 text-gray-900">Edit Job Details</h1>
      {/* Pass the plain job object to the client component */}
      <EditJobForm job={job} />
    </div>
  );
}