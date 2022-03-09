import { setPreviewData, redirectToPreviewURL } from '@prismicio/next';
import { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '../../services/prismic';

function linkResolver(post): string {
  switch (post.type) {
    case !'posts':
      return '/';
    case 'posts':
      return `/post/${post.uid}`;
    default:
      return null;
  }
}

export default async (
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> => {
  const client = createClient({ req });
  await setPreviewData({ req, res });
  await redirectToPreviewURL({
    req,
    res,
    client,
    linkResolver,
  });
};
