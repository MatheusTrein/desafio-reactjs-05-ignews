import * as Prismic from '@prismicio/client';
import { enableAutoPreviews, CreateClientConfig } from '@prismicio/next';

export function createClient({
  previewData,
  req,
}: CreateClientConfig): Prismic.Client {
  const client = Prismic.createClient(process.env.PRISMIC_API_ENDPOINT, {
    accessToken: process.env.PRISMIC_ACCESS_TOKEN,
  });

  enableAutoPreviews({
    client,
    previewData,
    req,
  });

  return client;
}
