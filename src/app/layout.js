import "./globals.css";

export const metadata = {
  title: "TaskFlow | Manage your tasks",
  description: "A full-stack task management system",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      
      <body className="antialiased bg-gray-50 text-gray-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}