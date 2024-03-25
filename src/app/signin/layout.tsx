import Image from "next/image";

export const metadata = {
  title: "Ira Project",
  description: "Learn by teaching your AI buddy",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen grid grid-cols-3 bg-homepage">
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
        </div>
        {children}
      </body>
    </html>
  )
}
