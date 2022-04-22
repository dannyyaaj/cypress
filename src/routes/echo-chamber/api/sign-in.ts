import { prisma } from '$lib/utilities/database';
import { respond } from './_respond';

export const post = async (event) => {
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
  }

  const user = await prisma.user.findFirst({
    where: {
      email,
    },
  });

  if (!user) {
    return {
      headers: { Location: `/echo-chamber/sign-in?error=No+such+user+exists` },
      status: 303,
    };
  }

  if (user.password !== password) {
    return {
      headers: { Location: `/echo-chamber/sign-in?error=Incorrect+password` },
      status: 303,
    };
  }

  return respond({ user });
};
