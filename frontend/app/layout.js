import { AuthProvider } from './providers/AuthProvider';
import './globals.css';

export const metadata = {
  title: 'Resume Screening System',
  description: 'AI-Based Resume Screening and Ranking System',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}