'use client'

import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import Link from "next/link";


export default function SignIn() {
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      router.push("/");
    }
  }, [session, router]);

  if (session) {
    return null;
  }

  return (
    // <div className="flex items-center justify-center min-h-screen bg-gray-100">
    //   <div className="p-6 max-w-sm w-full bg-white shadow-md rounded-md">
    //     <h1 className="text-2xl font-semibold text-center text-gray-700 mt-8 mb-6">Sign in</h1>
    //     <div className="mt-8">
    //       <button
    //         onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
    //         className="w-full flex items-center justify-center mt-4 text-white rounded-lg shadow-md hover:bg-gray-100"
    //       >
    //         <div className="px-4 py-3">
    //           <svg className="h-6 w-6" viewBox="0 0 40 40">
    //             <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.045 27.2142 24.3525 30 20 30C14.4775 30 10 25.5225 10 20C10 14.4775 14.4775 9.99999 20 9.99999C22.5492 9.99999 24.8683 10.9617 26.6342 12.5325L31.3483 7.81833C28.3717 5.04416 24.39 3.33333 20 3.33333C10.7958 3.33333 3.33335 10.7958 3.33335 20C3.33335 29.2042 10.7958 36.6667 20 36.6667C29.2042 36.6667 36.6667 29.2042 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#FFC107"/>
    //             <path d="M5.25497 12.2425L10.7308 16.2583C12.2125 12.59 15.8008 9.99999 20 9.99999C22.5491 9.99999 24.8683 10.9617 26.6341 12.5325L31.3483 7.81833C28.3716 5.04416 24.39 3.33333 20 3.33333C13.5983 3.33333 8.04663 6.94749 5.25497 12.2425Z" fill="#FF3D00"/>
    //             <path d="M20 36.6667C24.305 36.6667 28.2167 35.0192 31.1742 32.34L26.0159 27.975C24.3425 29.2425 22.2625 30 20 30C15.665 30 11.9842 27.2359 10.5975 23.3784L5.16254 27.5659C7.92087 32.9634 13.5225 36.6667 20 36.6667Z" fill="#4CAF50"/>
    //             <path d="M36.3425 16.7358H35V16.6667H20V23.3333H29.4192C28.7592 25.1975 27.56 26.805 26.0133 27.9758C26.0142 27.975 26.015 27.975 26.0158 27.9742L31.1742 32.3392C30.8092 32.6708 36.6667 28.3333 36.6667 20C36.6667 18.8825 36.5517 17.7917 36.3425 16.7358Z" fill="#1976D2"/>
    //           </svg>
    //         </div>
    //         <h1 className="px-4 py-3 w-5/6 text-center text-gray-600 font-bold">Sign in with Google</h1>
    //       </button>
    //     </div>
    //   </div>
    // </div>

    <div className="min-h-screen  flex justify-center items-center p-4">

   
    <div className="relative">
        <div className="absolute h-full opacity-30 w-full bg-gradient-to-r from-indigo-700 to-purple-700 blur-3xl animate-pulse duration-2000"></div>
        <div className="relative dark:bg-zinc-950/80 bg-white max-w-md  w-full flex flex-col gap-2 items-center p-6 border rounded-lg shadow-lg">
          <Image
            src={'/logo.png'}
            height={130}
            width={130}
            alt="Logo"
            className="drop-shadow-xl mt-6 "
          />
          <div className="text-lg md:text-3xl font-extrabold tracking-wide mt-4`">
            Welcome to Flow Mail
          </div>
          <div className="text-zinc-500 text-center text-xs md:text-base">
          Orchestrate powerful email campaigns with ease. Design, automate, and optimize your sequences. Welcome to FlowMail – where every message moves your audience
          </div>
          <div className="w-full h-1 border-b my-4 "></div>
            
          <div className="w-full flex flex-row gap-2">
            <Button
              onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
              className="w-full flex flex-row gap-2 "
            >
              <FcGoogle size={30} /> Continue with Google
            </Button>
          </div>
            
        </div>
      </div>
      </div>
  );
}