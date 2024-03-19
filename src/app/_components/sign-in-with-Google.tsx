'use client'
// import Image from "next/image"
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";

export const SignInWithGoogle: React.FC = () => {

  const searchParams = useSearchParams();
  const error = searchParams.get('error');

  return (
    <>
      <button className="w-full h-[40px] px-2 flex-row gap-2 items-center justify-center rounded-md 
      hover:cursor-pointer border-[#888] border-solid border-2" 
        onClick={() => {
          console.log("BRUH");
          void signIn('google', { callbackUrl: '/' })
          console.log("BRUH2");
        }
      }
      >
        {/* <Image src="/svg/google_g_icon.svg" alt="Google icon" width={40} height={40} /> */}
        <text className="text-sm">Sign in with Google</text>
      </button>
      {error && <span className="text-red-600">Error Logging In</span>}
    </>
  )
}