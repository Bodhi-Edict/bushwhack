import Image from "next/image";
import logo from '~/../public/logo.png'

import Link from "next/link";
import { getServerAuthSession } from "~/server/auth";

export const Navbar: React.FC = async () => {
    const session = await getServerAuthSession();

    const name = session?.user?.name ?? "";
    const src = session?.user?.image ?? "";

    return (
      <div className="h-12 px-2.5 py-2 flex justify-between items-center absolute w-full border-b border-slate-100">
        <Link href="/">
          <Image priority src={logo} alt="Logo" height={32} width={40} />
        </Link>
        <div className="dropdown ">
          {session?.user && (
            <Link href="/api/auth/signout">
              {src && <div className="w-7">
                <Image className="rounded-full"
                    src={src}
                    alt={name ?? ""}
                    width={32}
                    height={32} 
                />
              </div>}
            </Link>
          )}
        </div>
      </div>
    );
}
