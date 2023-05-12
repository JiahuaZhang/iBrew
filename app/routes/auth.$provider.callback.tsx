import type { LoaderFunction } from 'react-router';
import { authenticator } from '~/services/auth.server';

export const loader: LoaderFunction = ({ request, params }) =>
  authenticator.authenticate(params.provider ?? '', request, {
    successRedirect: '/home',
    failureRedirect: '/login'
  });