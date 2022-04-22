import type { RequestHandler } from '@sveltejs/kit';
import data from './pokemon.json';

export const get: RequestHandler = async (request) => {
  const { url } = request;
  const name = url.searchParams.get('name')?.toLowerCase();

  const pokemon = data.filter((p) => p.name?.toLowerCase()?.startsWith(name));

  return {
    body: {
      pokemon,
    },
  };
};
