import Link from 'next/link';
import CalendarIcon from '../../../public/calendar.svg';
import UserIcon from '../../../public/user.svg';
import { dateFormat } from '../../util/dateFormat';
import styles from './postOverview.module.scss';

interface PostOverviewProps {
  slug: string;
  data: {
    title: string;
    subtitle: string;
    author: string;
  };
  first_publication_date: string;
}

export default function PostOverview({
  data,
  first_publication_date,
  slug,
}: PostOverviewProps): JSX.Element {
  return (
    <Link href={`/post/${slug}`}>
      <a className={`${styles.postWrapper} showSoftly`}>
        <h1>{data.title}</h1>
        <p>{data.subtitle}</p>
        <div className={styles.postInfo}>
          <span>
            <CalendarIcon />
            {first_publication_date}
          </span>
          <span>
            <UserIcon />
            {data.author}
          </span>
        </div>
      </a>
    </Link>
  );
}
