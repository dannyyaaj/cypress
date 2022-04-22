import { prisma } from '$lib/utilities/database';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';

export const post = async (event: ServerRequest<Record<string, any>>) => {
  let user;
  let email: string;
  let password: string;

  if (typeof await event.request.json() === 'string') {
    email = await event.request.json().email;
    password = await event.request.json().password;
  } else if (await event.request.json() instanceof Uint8Array) {
    email = await event.request.json().toString().email;
    password = await event.request.json().toString().password;
  } else {
    email = await event.request.json().get('email');
    password = await event.request.json().get('password');

    console.log(email, password, 'email, password')
  }

  try {
    user = await prisma.user.create({
      data: {
        email,
        password,
      },
    });
  } catch (error) {
    return {
      headers: { Location: `/echo-chamber/sign-up?error=A+user+already+exists+with+that+email.` },
      status: 303,
    };
  }

  if (!user) {
    return {
      headers: { Location: `/echo-chamber/sign-up?error=No+such+user+exists.` },
      status: 303,
    };
  }

  return {
    status: 302,
    headers: {
      Location: '/echo-chamber',
    },
    body: {
      user: {
        id: user.id,
        email: user.email,
      },
    },
  };
};
