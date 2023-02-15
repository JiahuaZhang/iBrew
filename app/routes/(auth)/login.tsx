import { useSubmit } from '@remix-run/react';
import type { LoaderFunction } from 'react-router';
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons';
import { SocialsProvider } from 'remix-auth-socials';
import { authenticator } from '~/services/auth.server';

export const loader: LoaderFunction = async ({ request }) => authenticator
  .isAuthenticated(request, { successRedirect: '/' });

export const LoginPanel = ({ className }: { className?: string; }) => {
  const submit = useSubmit();

  return <div className={className}>
    <GoogleLoginButton onClick={() => submit({}, { method: 'post', action: `/auth/${SocialsProvider.GOOGLE}` })} />
    <FacebookLoginButton onClick={() => submit({}, { method: 'post', action: `/auth/${SocialsProvider.FACEBOOK}` })} />
  </div>;
};

export default function Login() {
  return <LoginPanel className="max-w-sm mx-auto mt-32 grid gap-4" />;
}