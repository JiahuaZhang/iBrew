import { PrismaClient } from '@prisma/client';

export const prisma = new PrismaClient();

export const getUser = async (provider: 'facebook' | 'google', id: string) => {
  const socialUser = await prisma.socialUser.findUnique({
    where: { id_provider: { id, provider } },
    include: { mainUser: true, user: true }
  });

  if (!socialUser) {
    const newSocialUser = await prisma.socialUser.create({ data: { provider, id, } });

    const newUser = await prisma.user.create({
      data: { socialUserId: newSocialUser.id, socialUserProvider: newSocialUser.provider }
    });

    return newUser;
  }

  if (socialUser.mainUser) {
    return socialUser.mainUser;
  }

  if (socialUser.user) {
    return socialUser.user;
  }

  console.error(`Fail to find user of provider ${provider} and id ${id}`);
  throw new Error('User not found');
};