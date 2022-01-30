import { useCallback, useEffect, useMemo, useState } from 'react';
import { LinksFunction, LoaderFunction, useLoaderData } from 'remix';
import classNames from 'classnames';

import stylesUrl from '~/styles/index.css';
import { parseSites } from '~/services/crawler';
import { SiteArticle, SiteArticles } from '~/types/Crawler';
import { Feed } from '~/components/Feed';
import {
  getInitialReadStatus,
  markAsReaded,
  toggleRead
} from '~/services/readStatus';
import { ReadStatus } from '~/types/ReadStatus';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export const loader: LoaderFunction = async () => {
  return parseSites();
};

export default function Index() {
  const [readStatus, setReadStatus] = useState<ReadStatus>({});
  const [selectedSite, setSelectedSite] = useState<SiteArticles | undefined>(
    undefined
  );
  const data = useLoaderData<SiteArticles[]>();

  useEffect(() => {
    setReadStatus(getInitialReadStatus());
  }, []);

  const feedData = useMemo(() => {
    if (selectedSite) {
      return data.find(item => item === selectedSite)?.articles || [];
    } else {
      const unreadArticles: SiteArticle[] = [];

      for (const site of data) {
        for (const article of site.articles) {
          if (readStatus[article.articleUrl] !== true) {
            unreadArticles.push(article);
          }
        }
      }

      return unreadArticles;
    }
  }, [selectedSite, data, readStatus]);

  const onToggleRead = useCallback((href: string) => {
    setReadStatus(prevState => ({
      ...prevState,
      [href]: toggleRead(href)
    }));
  }, []);

  const onMarkAllAsReaded = useCallback(() => {
    const newState = markAsReaded(feedData.map(item => item.articleUrl));

    setReadStatus(prevState => ({ ...prevState, ...newState }));
  }, [feedData]);

  return (
    <main>
      <nav>
        <ul>
          <li
            className={classNames('unread-articles', {
              selected: selectedSite === undefined
            })}>
            <button onClick={() => setSelectedSite(undefined)} type="button">
              Unread articles
            </button>
          </li>
          {data.map(site => (
            <li
              key={site.blogUrl}
              className={classNames({
                selected: site === selectedSite
              })}>
              <button onClick={() => setSelectedSite(site)} type="button">
                {site.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <section>
        <Feed
          site={selectedSite}
          data={feedData}
          readStatus={readStatus}
          toggleRead={onToggleRead}
          markAllAsReaded={onMarkAllAsReaded}
        />
      </section>
    </main>
  );
}
