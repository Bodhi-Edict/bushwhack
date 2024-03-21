import { unstable_noStore as noStore } from "next/cache";
import Image from "next/image";
import { getServerAuthSession } from "~/server/auth";
import { SignInWithGoogle } from "../_components/sign-in-with-google";
import { redirect } from 'next/navigation';

export default async function SignIn({}) {
  noStore();
  const session = await getServerAuthSession();

  if(session !== null) {
    redirect('/');
  }
  
  return (
    <>
      <main className="min-h-screen grid grid-cols-3 bg-homepage">
        <div className="col-span-2 flex flex-col justify-center relative">
          <div className="w-inherit absolute right-0">
            <h1 className="text-4xl leading-[48px] font-medium">
              Learn by teaching <br /> your AI buddy{" "}      
            </h1>
            <div className="relative mt-[30px] pt-[54.25%] w-[60vw]">
              <Image src="/logo.png" alt="login" fill style={{objectFit: "fill", position: "absolute", borderRadius: "12px 0 0 12px"}} />
            </div>
          </div>
        </div>

        <div className="col-span-1 py-[80px] px-[70px] border-l
            border-solid shadow-[-12px_0px_16px_0px_rgba(10,10,10,0.1)] z-10">
          <div className="h-[100%] w-[95%] grid grid-cols-1 grid-rows-[1fr_max-content] gap-10 justify-center">
            <div className="flex flex-col gap-[48px]">
              <Image src="/logo.png" alt="Logo" width={42} height={42} />
              <div className="pt-[22px]">
                <h2 className="text-2xl font-medium">Login to the <span className="text-accent-1-500">Ira Project </span></h2>
                <p className="pt-[8px] text-sm font-medium text-[#747474]">
                  If you do not have an account, we will create one for you upon sign in. 
                </p>
              </div>
              <div className="flex flex-col gap-[24px]">
                <SignInWithGoogle />
              </div>
            </div>
            <div className="flex flex-row gap-2 items-start">
              <p className="text-sm font-medium text-[#747474]">
                By signing in you agree to the Terms & Conditions & Privacy Policy
              </p>
            </div>
          </div>
        </div>        
      </main>
    </>
  );
};