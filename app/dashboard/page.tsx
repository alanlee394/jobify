import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user?.email) {
    redirect("/login");
  }

  const jobs = await prisma.job.findMany({
    where: { user: { email: session.user.email } },
    orderBy: { createdAt: 'desc' }
  });

  const getJobsByStatus = (status: string) => jobs.filter(j => j.status === status);

  const columns = [
    { title: "Applied", status: "APPLIED", color: "bg-blue-50" },
    { title: "Interview", status: "INTERVIEW", color: "bg-yellow-50" },
    { title: "Offer", status: "OFFER", color: "bg-green-50" },
    { title: "Rejected", status: "REJECTED", color: "bg-red-50" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      {/* --- HEADER SECTION START --- */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-blue-900">Jobify</h1>
        
        {/* We wrap the buttons in a flex container to group them */}
        <div className="flex gap-2">
          {/* New AI Coach Button */}
          <Link 
            href="/dashboard/coach" 
            className="bg-white text-black border border-gray-300 px-4 py-2 rounded hover:bg-gray-50 shadow-sm"
          >
            Jobify Coach
          </Link>

          {/* Existing Add Job Button */}
          <Link 
            href="/dashboard/new" 
            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 shadow-sm"
          >
            + Add Job
          </Link>
        </div>
      </div>
      {/* --- HEADER SECTION END --- */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {columns.map((col) => (
          <div key={col.status} className={`p-4 rounded-lg shadow-sm ${col.color}`}>
            <h2 className="font-bold text-gray-700 mb-4 flex justify-between">
              {col.title}
              <span className="bg-white text-xs px-2 py-1 rounded-full shadow-sm text-gray-500">
                {getJobsByStatus(col.status).length}
              </span>
            </h2>
            
            <div className="space-y-3">
              {getJobsByStatus(col.status).map((job) => (
                <Link 
                  href={`/dashboard/${job.id}`} 
                  key={job.id} 
                  className="block group"
                >
                  <div className="bg-white p-4 rounded shadow-sm border border-gray-100 group-hover:shadow-md transition cursor-pointer">
                    <h3 className="font-semibold text-gray-900">{job.position}</h3>
                    <p className="text-sm text-gray-600">{job.company}</p>
                    <p className="text-xs text-gray-400 mt-2">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </Link>
              ))}
              
              {getJobsByStatus(col.status).length === 0 && (
                <p className="text-sm text-gray-400 text-center py-8 italic">No jobs yet</p>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}