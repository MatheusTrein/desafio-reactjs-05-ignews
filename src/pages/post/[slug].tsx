import { GetStaticPaths, GetStaticProps } from 'next';
import Head from 'next/head';
import { RichText } from 'prismic-dom';

import { FiClock } from 'react-icons/fi';
import { useRouter } from 'next/router';
import { CreateClientConfig } from '@prismicio/next';
import Link from 'next/link';
import { createClient } from '../../services/prismic';
import { dateFormat } from '../../util/dateFormat';

import styles from './post.module.scss';
import CalendarIcon from '../../../public/calendar.svg';
import UserIcon from '../../../public/user.svg';
import NavigationBetweenPosts from '../../components/NavigationBetweenPosts';
import Comments from '../../components/Comments/Comments';

interface Post {
  uid: string;
  first_publication_date: string | null;
  last_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    banner: {
      url: string;
    };
    author: string;
    content: {
      heading: string;
      body: {
        text: string;
      }[];
    }[];
  };
}

interface NavigationPost {
  title: string;
  slug: string;
}

interface PostProps {
  post: Post;
  preview?: boolean;
  nextPost?: NavigationPost | null;
  prevPost?: NavigationPost | null;
}

export default function Post({
  post,
  preview,
  nextPost,
  prevPost,
}: PostProps): JSX.Element {
  const router = useRouter();

  if (router.isFallback) {
    return (
      <div style={{ maxWidth: '768px', margin: '0 auto', padding: '0 0.5rem' }}>
        Carregando...
      </div>
    );
  }

  const html =
    post &&
    post.data.content.reduce((acc, content) => {
      const chunkHtml = `<h2>${content.heading}</h2>${RichText.asHtml(
        content.body
      )}`;

      return acc + chunkHtml;
    }, '');

  const regex = /<.+?>/g;

  return (
    <>
      {post && (
        <>
          <Head>
            <title>{post.data.title} | Spacetraveling</title>
          </Head>
          <main className={styles.post}>
            <img src={post.data.banner.url} alt="banner" />
            <div className={`${styles.postHeader} container`}>
              <h1>{post.data.title}</h1>
              <div className={styles.postInfo}>
                <span>
                  <CalendarIcon />
                  {dateFormat(post.first_publication_date).date}
                </span>
                <span>
                  <UserIcon />
                  {post.data.author}
                </span>
                <span>
                  <FiClock />
                  {(() => {
                    const parsedText = html.replace(regex, '');
                    const estimatedReadingTime = Math.ceil(
                      parsedText.split(' ').length / 200
                    );

                    return `${estimatedReadingTime} ${
                      estimatedReadingTime > 1 && 'min'
                    }`;
                  })()}
                </span>
              </div>
              {post.last_publication_date && (
                <span className={styles.timeOfEdition}>
                  *editado em{' '}
                  {dateFormat(post.last_publication_date).dateAndTime}
                </span>
              )}
            </div>
            <div
              className={styles.postContent}
              // eslint-disable-next-line react/no-danger
              dangerouslySetInnerHTML={{
                __html: html,
              }}
            />
            {preview && (
              <aside>
                <Link href="/api/exit-preview">
                  <a className={styles.exitPreview}>Sair do modo Preview</a>
                </Link>
              </aside>
            )}
            {!preview && (
              <NavigationBetweenPosts prevPost={prevPost} nextPost={nextPost} />
            )}
            <Comments />
          </main>
        </>
      )}
    </>
  );
}

export const getStaticPaths: GetStaticPaths = async context => {
  const prismic = createClient(context as CreateClientConfig);
  const { results: posts } = await prismic.getByType('posts', {
    pageSize: 1,
    orderings: ['document.first_publication_date desc'],
  });

  return {
    paths: posts.map(post => {
      return {
        params: {
          slug: post.uid,
        },
      };
    }),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({
  previewData,
  preview = false,
  params,
}) => {
  const prismic = createClient({ previewData });
  const response = await prismic.getByUID('posts', String(params.slug), {
    ref: previewData?.ref ?? null,
  });

  const post: Post = {
    uid: response.uid,
    data: {
      author: response.data.author,
      subtitle: response.data.subtitle,
      banner: response.data.banner,
      content: response.data.content,
      title: response.data.title,
    },
    first_publication_date: response.first_publication_date,
    last_publication_date:
      response.last_publication_date === response.first_publication_date
        ? null
        : response.last_publication_date,
  };

  const prevPost = (
    await prismic.getByType('posts', {
      pageSize: 1,
      after: `${response.id}`,
      orderings: ['document.first_publication_date desc'],
    })
  ).results[0];

  const nextPost = (
    await prismic.getByType('posts', {
      pageSize: 1,
      after: `${response.id}`,
      orderings: ['document.first_publication_date'],
    })
  ).results[0];

  return {
    props: {
      post,
      preview,
      prevPost: prevPost
        ? {
            title: prevPost?.data?.title,
            slug: prevPost?.uid,
          }
        : null,
      nextPost: nextPost
        ? {
            title: nextPost?.data?.title,
            slug: nextPost.uid,
          }
        : null,
    },
    revalidate: 60 * 60,
  };
};
