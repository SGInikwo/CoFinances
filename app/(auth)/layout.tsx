import { getLoggedInUser } from "@/lib/actions/user.actions";
import { redirect } from "next/navigation";

export default async function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    const loggedIn = await getLoggedInUser();
    
    if (loggedIn) {
      // Ensure the redirect happens correctly with Next.js behavior
      redirect('/'); // This works, but remember it's important to handle async redirects correctly
    }

    return (
      <main>
          {children}
      </main>
    );
  }
  