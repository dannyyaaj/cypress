import { prisma } from '$lib/utilities/database';
import type { RequestHandler } from '@sveltejs/kit';
import type { ReadOnlyFormData } from '@sveltejs/kit/types/helper';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';

export const get: RequestHandler = async (event) => {
  if (event.url.searchParams.get('_method')?.toLowerCase() === 'delete') return del(event);

  const post = await prisma.post.findUnique({
    where: {
      id: event.params.id,
    },
    include: {
      author: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  if (post) {
    return {
      body: {
        post,
      },
    };
  }
};

export const post = async (request: ServerRequest<Record<string, any>, ReadOnlyFormData>) => {
  const { url } = request;

  if (url.searchParams.get('_method')?.toLowerCase() === 'patch') return patch(request);
  if (url.searchParams.get('_method')?.toLowerCase() === 'delete') return del(request);

  return { status: 404 };
};

export const patch = async (event: ServerRequest<Record<string, any>, ReadOnlyFormData>) => {
  const content = await event.request.json().get('content');

  const post = await prisma.post.update({
    data: {
      content,
    },
    where: {
      id: event.request.params.id,
    },
  });

  if (event.request.headers.accept !== 'application/json') {
    return {
      headers: { Location: `/echo-chamber/posts/${post.id}` },
      status: 303,
    };
  }

  return {
    status: 200,
    body: { post },
  };
};

export const del: RequestHandler = async (event) => {
  const id = event.params.id;

  console.log('Delete');

  await prisma.post.delete({
    where: {
      id,
    },
  });

  if (event.request.method.toLowerCase() === 'post') {
    return {
      headers: { Location: '/echo-chamber/posts' },
      status: 303,
    };
  }

  return {
    status: 200,
  };
};
