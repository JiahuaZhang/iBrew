import type { ActionFunction } from '@remix-run/node';
import type { LoaderFunction } from 'react-router';
import { authenticator } from '../../services/auth.server';

export const loader: LoaderFunction = async ({ request }) =>
  await authenticator.logout(request, { redirectTo: '/home' });

export const action: ActionFunction = async ({ request }) =>
  await authenticator.logout(request, { redirectTo: '/home' });