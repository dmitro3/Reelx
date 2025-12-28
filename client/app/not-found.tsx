import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
};

export default function NotFound() {
  return (
    <div style={{ padding: '2rem', textAlign: 'center' }}>
      <h1>404</h1>
      <p>Page not found</p>
      <a href='/profile'>Go to home</a>
    </div>
  );
}

