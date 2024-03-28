import "~/styles/globals.css";
import { UnsavedChangesProvider } from "~/app/_components/unsaved-changes-provider";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <UnsavedChangesProvider>
      {children}
    </UnsavedChangesProvider>
  );
}
