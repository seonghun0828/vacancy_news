import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Vacancy News',
  description: 'Vacancy News Website',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='ko'>
      <body>{children}</body>
    </html>
  );
}
