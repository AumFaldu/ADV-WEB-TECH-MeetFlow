import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center px-6">
      <div className="max-w-5xl w-full">
        
        {/* Header */}
        <div className="text-center mb-14">
          <h1 className="text-4xl md:text-5xl font-semibold text-slate-900">
            MeetFlow
          </h1>
          <p className="mt-3 text-slate-600 text-lg">
            Minutes of Meeting Management System
          </p>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-14">
          <Feature
            title="Meeting Management"
            description="Create, schedule and manage meetings in a structured way."
          />
          <Feature
            title="Minutes of Meeting"
            description="Record discussions, decisions and action items clearly."
          />
          <Feature
            title="Reports & Tracking"
            description="Track attendance, responsibilities and meeting outcomes."
          />
        </div>

        {/* CTA */}
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            href="/register"
            className="px-6 py-3 rounded-lg bg-indigo-600 text-white text-center
                       font-medium hover:bg-indigo-700 transition"
          >
            Get Started
          </Link>

          <Link
            href="/login"
            className="px-6 py-3 rounded-lg border border-slate-300 text-slate-800
                       text-center font-medium hover:bg-slate-200 transition"
          >
            Login
          </Link>
        </div>

        {/* Footer */}
        <p className="mt-16 text-center text-sm text-slate-500">
          Secure • Role-based • Designed for academic & professional use
        </p>
      </div>
    </div>
  );
}

/* Feature Card */
function Feature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm">
      <h3 className="text-lg font-semibold text-slate-900 mb-2">
        {title}
      </h3>
      <p className="text-slate-600 text-sm">
        {description}
      </p>
    </div>
  );
}
