import { Metadata } from 'next';
import { Error } from '@/widgets/error/error';

export const metadata: Metadata = {
  title: '404 - Page Not Found',
};

export default function NotFound() {
  return (
    <Error errorSubText="Page not found" errorText="404"/>
  );
}

