import Image from "next/image";
import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

export const Navbar: React.FC = async () => {
    const session = await getServerAuthSession();

    const name = session?.user?.name ?? "";
    const src = session?.user?.image ?? "";

    return (
      <div className="h-12 navbar pl-2.5 py-2 pr-[18px] flex justify-between items-center  
        border-t border-solid border-[#333] absolute w-full">
        <Image src="/logo.png" alt="Logo" width={24} height={24} />
        <div className="dropdown ">
          {session?.user && (
            <Link href="/api/auth/signout">
              {src && <div className="w-7">
                <Image className="rounded-full"
                    src={src}
                    alt={name ?? ""}
                    width={28}
                    height={28} 
                />
              </div>}
            </Link>
          )}
        </div>
      </div>
    );
}
