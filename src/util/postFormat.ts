import { dateFormat } from './dateFormat';

interface Post {
  uid?: string;
  first_publication_date: string | null;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
}

export const postFormat = (posts: Post[]): Post[] => {
  const postsFormated = posts.map(post => {
    return {
      uid: post.uid,
      first_publication_date: dateFormat(post.first_publication_date).date,
      data: {
        title: post.data.title,
        subtitle: post.data.subtitle,
        author: post.data.author,
      },
    };
  });

  return postsFormated;
};
