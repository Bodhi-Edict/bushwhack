import "~/styles/globals.css";
import { Navbar } from "../_components/navbar";


export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <Navbar />
      <div className="pt-12">
        {children}
      </div>
    </div>
  );
}
