import { prisma } from '$lib/utilities/database';
import type { RequestHandler } from '@sveltejs/kit';
import type { ServerRequest } from '@sveltejs/kit/types/hooks';

export const get: RequestHandler = async () => {
  const posts = await prisma.post.findMany({
    include: {
      author: {
        select: {
          id: true,
          email: true,
        },
      },
    },
  });

  if (posts) {
    return {
      body: {
        posts,
      },
    };
  }
};

export const post = async (event: ServerRequest<Record<string, any>>) => {
  let content: string;
  let authorId: number;

  if (typeof await event.request.json() === 'string') {
    content = await event.request.json().content;
    authorId = await event.request.json().authorId;
  } else if (await event.request.json() instanceof Uint8Array) {
    content = await event.request.json().toString().content;
    authorId = await event.request.json().toString().authorId;
  } else {
    content = await event.request.json().get('content');
    authorId = await event.request.json().get('authorId');
  }

  const post = await prisma.post.create({
    data: {
      authorId,
      content,
    },
  });

  if (event.request.headers.accept !== 'application/json') {
    return {
      headers: { Location: `/echo-chamber/posts/${post.id}` },
      status: 303,
    };
  }

  return {
    status: 201,
    body: { post },
  };
};
