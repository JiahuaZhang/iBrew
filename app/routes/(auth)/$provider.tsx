import type { ActionFunction } from '@remix-run/node';
import { LoaderFunction, redirect } from 'react-router';
import { authenticator } from '../../services/auth.server';

export const loader: LoaderFunction = () => redirect('/login');

export const action: ActionFunction = ({ request, params }) =>
  authenticator.authenticate(params.provider ?? '', request);