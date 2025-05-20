import './globals.css';
import { ClientLayout } from './ClientLayout';

export const metadata = {
  title: 'Premier Healthcare Platform',
  description: 'A complete healthcare platform for scheduling, patient intake, and referral management',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-neutral-50">
        <ClientLayout>
          {children}
        </ClientLayout>
      </body>
    </html>
  );
}