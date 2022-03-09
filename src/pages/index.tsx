import { GetStaticProps } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import PostOverview from '../components/PostOverview';
import { createClient } from '../services/prismic';
import styles from './home.module.scss';
import { postFormat } from '../util/postFormat';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

interface PostPagination {
  next_page: string;
  results: Post[];
}

interface HomeProps {
  postsPagination: PostPagination;
}

export default function Home({ postsPagination }: HomeProps): JSX.Element {
  const [posts, setPosts] = useState(postFormat(postsPagination.results));
  const [nextPage, setNextPage] = useState(postsPagination.next_page);

  async function loadMorePosts(): Promise<void> {
    const response = await fetch(nextPage);
    const data = await response.json();

    const newPosts = postFormat(data.results);

    setNextPage(data.next_page);
    setPosts([...posts, ...newPosts]);
  }

  return (
    <>
      <Head>
        <title>Home | Spacetraveling</title>
      </Head>
      <main className={`${styles.content} container`}>
        {posts.map(({ uid, data, first_publication_date }) => (
          <PostOverview
            key={uid}
            slug={uid}
            data={data}
            first_publication_date={first_publication_date}
          />
        ))}
        {nextPage && (
          <button type="button" onClick={loadMorePosts}>
            Carregar mais posts
          </button>
        )}
      </main>
    </>
  );
}

export const getStaticProps: GetStaticProps = async context => {
  const prismic = createClient(context);
  const { next_page, results } = await prismic.getByType('posts', {
    pageSize: 1,
    orderings: ['document.first_publication_date desc'],
  });

  const postsPagination = { next_page, results };

  return {
    props: {
      postsPagination,
    },
    revalidate: 60 * 60,
  };
};
