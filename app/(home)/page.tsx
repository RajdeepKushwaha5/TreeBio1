import { Button } from "@/components/ui/button";
import { onBoardUser } from "@/modules/auth/actions";
import ClaimLinkForm from "@/modules/home/components/claim-link-form";
import { getCurrentUsername } from "@/modules/profile/actions";

import Link from "next/link";
import { redirect } from "next/navigation";

// Force dynamic rendering since this page uses authentication
export const dynamic = 'force-dynamic';

export default async function Home() {
  try {
    const user = await onBoardUser();
    
    // If user onboarding fails, show debug information instead of crashing
    if (!user.success) {
      console.error("❌ User onboarding failed:", user.error);
      return (
        <div className="min-h-screen flex items-center justify-center p-8">
          <div className="max-w-md mx-auto text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
            <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
              Setup Required
            </h2>
            <p className="text-red-600 dark:text-red-300 mb-4">
              {user.error || "Unable to initialize user account"}
            </p>
            <p className="text-sm text-red-500 dark:text-red-400">
              Please check your database connection and try again.
            </p>
          </div>
        </div>
      );
    }

    const profile = await getCurrentUsername();
    
    if (!user.success) {
      return redirect("/sign-in");
    }

    return (
      <div className="min-h-screen">
        {/* Header */}

        {/* Main Content */}
        <main className="flex flex-col max-w-4xl mx-auto px-4 sm:px-6">
          <section className="text-center space-y-8 py-16 sm:py-24 lg:py-32">
            {/* Hero Text */}
            <div className="space-y-6">
              <h1 className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight text-zinc-700 dark:text-zinc-100">
                Everything you are.
                <br />
                <span className="text-[#41B313]">In one simple link.</span>
              </h1>

              <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-2xl mx-auto leading-relaxed px-4 sm:px-0">
                Join 70M+ people using TreeBio for their link in bio. One link to
                help you share everything you create, curate and sell from your
                social media profiles.
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              {
                user.success && profile?.username && (
                  <Link href="/admin/my-tree">
                    <Button size="lg" className="px-8 py-3 text-lg font-medium cursor-pointer">
                      TreeBio Dashboard
                    </Button>
                  </Link>
                )
              }
             
            </div>
          </section>

          {/* Claim Link Section */}
          <section className="pb-16 md:pb-24">
            <div className="max-w-md mx-auto">
              <ClaimLinkForm />
            </div>
          </section>
        </main>
      </div>
    );
    
  } catch (error) {
    console.error("❌ Home page error:", error);
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <div className="max-w-md mx-auto text-center bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6">
          <h2 className="text-xl font-semibold text-red-800 dark:text-red-200 mb-2">
            Application Error
          </h2>
          <p className="text-red-600 dark:text-red-300 mb-4">
            {error instanceof Error ? error.message : "An unexpected error occurred"}
          </p>
          <p className="text-sm text-red-500 dark:text-red-400 mb-4">
            Please refresh the page or try again later.
          </p>
          <Link href="/sign-in">
            <Button variant="outline" size="sm">
              Go to Sign In
            </Button>
          </Link>
        </div>
      </div>
    );
  }
}
