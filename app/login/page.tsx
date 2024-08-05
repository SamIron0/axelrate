import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { SubmitButton } from "./submit-button";
import { cookies } from "next/headers";

export default async function Login({
  searchParams,
}: {
  searchParams: {
    message?: string;
    role?: "driver" | "rider";
    callbackUrl?: string;
  };
}) {
  const supabase = createClient(cookies());
  const session = await supabase.auth.getSession();
  if (session.data.session) {
    return redirect(searchParams.callbackUrl || "/dashboard");
  }
  const signIn = async (formData: FormData) => {
    "use server";

    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      const loginUrl =
        searchParams.role === "driver"
          ? "/login?role=driver"
          : "/login?role=rider";
      const callbackParam = searchParams.callbackUrl
        ? `&callbackUrl=${searchParams.callbackUrl}`
        : "";
      return redirect(`${loginUrl}${callbackParam}&message=${error.message}`);
    }
    return redirect(
      searchParams.callbackUrl ? searchParams.callbackUrl : "/dashboard"
    );
  };

  return (
    <div className="flex-1 flex flex-col w-full px-8 sm:max-w-md justify-center gap-2">
      <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground">
        <label className="text-md" htmlFor="email">
          Email
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          name="email"
          placeholder="you@example.com"
          required
        />

        <label className="text-md" htmlFor="password">
          Password
        </label>
        <input
          className="rounded-md px-4 py-2 bg-inherit border mb-6"
          type="password"
          name="password"
          placeholder="••••••••"
          required
        />
        <SubmitButton
          formAction={signIn}
          className="bg-primary rounded-md px-4 py-2 text-foreground mb-7"
          pendingText="Signing In..."
        >
          Sign In
        </SubmitButton>
        <p className="text-sm font-light text-zinc-500">
          Don&apos;t have an account?{" "}
          <a
            href={`/signup?${
              searchParams.role ? `role=${searchParams.role}` : ""
            }${
              searchParams.callbackUrl
                ? `&callbackUrl=${searchParams.callbackUrl}`
                : ""
            }`}
            className="font-medium hover:underline text-primary-500 mb-3"
          >
            Sign Up
          </a>
        </p>
        {searchParams?.message && (
          <p className="mt-4 p-4 bg-background/10 text-foreground text-center ">
            {searchParams.message}
          </p>
        )}
      </form>
    </div>
  );
}
