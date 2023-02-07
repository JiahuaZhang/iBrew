import { Authenticator } from 'remix-auth';
import { FacebookStrategy, GoogleStrategy, SocialsProvider } from 'remix-auth-socials';
import { sessionStorage } from './session.server';

export const authenticator = new Authenticator(sessionStorage);

const getCallback = (provider: string) => `/auth/${provider}/callback`;

authenticator.use(new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    callbackURL: getCallback(SocialsProvider.GOOGLE)
  },
  async ({ profile }) => {
    return profile;
  })
);

authenticator.use(new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_CLIENT_ID!,
    clientSecret: process.env.FACEBOOK_SECRET!,
    callbackURL: getCallback(SocialsProvider.FACEBOOK)
  },
  async ({ profile }) => {
    return profile;
  })
);