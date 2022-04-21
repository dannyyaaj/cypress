import { decodeToken } from '$lib/utilities/jwt';
import * as cookie from 'cookie';

/** @type {import('@sveltejs/kit').Handle} */
export async function handle({ event, resolve }) {
  const cookies = cookie.parse(event.request.headers.cookie || '');
  const jwt = cookies.jwt && decodeToken(cookies.jwt);
  event.locals.user = jwt ? JSON.parse(jwt) : null;
  return await resolve(event);
}

export function getSession({ locals }) {
  return {
    user: locals.user && {
      id: +locals.user.id,
      email: locals.user.email,
    },
  };
}
