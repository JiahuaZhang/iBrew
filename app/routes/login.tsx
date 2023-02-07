import { useSubmit } from '@remix-run/react';
import type { LoaderFunction } from 'react-router';
import { FacebookLoginButton, GoogleLoginButton } from 'react-social-login-buttons';
import { SocialsProvider } from 'remix-auth-socials';
import { authenticator } from '~/services/auth.server';

export const loader: LoaderFunction = async ({ request }) => {
  return authenticator.isAuthenticated(request, {
    successRedirect: '/home'
  });
};

export default function Login() {
  const submit = useSubmit();

  return (
    <div className='max-w-sm mx-auto mt-32'>
      <GoogleLoginButton onClick={() => submit({}, { method: 'post', action: `/auth/${SocialsProvider.GOOGLE}` })} />
      <br />
      <FacebookLoginButton onClick={() => submit({}, { method: 'post', action: `/auth/${SocialsProvider.FACEBOOK}` })} />
    </div>
  );
}