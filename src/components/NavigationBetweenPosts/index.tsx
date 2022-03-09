import Link from 'next/link';

import styles from './navigationBetweenPosts.module.scss';

interface NavigationPost {
  title: string;
  slug: string;
}

interface NavigationBetweenPostsProps {
  prevPost: NavigationPost | null;
  nextPost: NavigationPost | null;
}

export default function NavigationBetweenPosts({
  nextPost,
  prevPost,
}: NavigationBetweenPostsProps): JSX.Element {
  if (prevPost || nextPost) {
    return (
      <div className={`${styles.navigationPosts} container`}>
        {prevPost && (
          <div>
            <span>{prevPost.title}</span>
            <Link href={`/post/${prevPost.slug}`}>
              <a>Post anterior</a>
            </Link>
          </div>
        )}
        {nextPost && (
          <div>
            <span>{nextPost.title}</span>
            <Link href={`/post/${nextPost.slug}`}>
              <a>Próximo post</a>
            </Link>
          </div>
        )}
      </div>
    );
  }
  return null;
}
