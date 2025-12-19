import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import EditJobForm from "./EditJobForm"; 

type Props = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailsPage({ params }: Props) {
  const session = await auth();
  
  const { id } = await params; 

  if (!session?.user?.email) {
    redirect("/login");
  }

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