import { Analytics } from '@vercel/analytics/react';
import { Metadata } from 'next';
import '../styles/globals.css';

const title = 'Tony Template Generator';
const description = 'Generate your Tony Template™ in seconds.';

export const metadata: Metadata = {
  metadataBase: new URL('https://tony-gpt-alpha.vercel.app/'),
  title,
  description
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
