import { useCallback, useEffect, useMemo, useState } from 'react';
import { LinksFunction, LoaderFunction, useLoaderData } from 'remix';
import classNames from 'classnames';

import stylesUrl from '~/styles/index.css';
import { parseSites } from '~/services/crawler';
import { ParsedArticle, SiteInfo } from '~/types/Crawler';
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
  const [selectedSite, setSelectedSite] = useState<SiteInfo | undefined>(
    undefined
  );
  const data = useLoaderData<SiteInfo[]>();

  useEffect(() => {
    setReadStatus(getInitialReadStatus());
  }, []);

  const feedData: ParsedArticle[] = useMemo(() => {
    if (selectedSite) {
      return data.find(item => item === selectedSite)?.data.articles || [];
    } else {
      const unreadArticles: ParsedArticle[] = [];

      for (const site of data) {
        for (const article of site.data.articles) {
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

  const parsingErrors: SiteInfo[] = useMemo(() => {
    return data.filter(siteInfo => !siteInfo.data.success);
  }, [data]);

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
        {parsingErrors.length > 0 && !selectedSite ? (
          <div className="parsing-errors">
            <h3>The problem with parsing the following sites:</h3>
            <ul>
              {parsingErrors.map(siteInfo => (
                <li>{siteInfo.blogUrl}</li>
              ))}
            </ul>
          </div>
        ) : null}

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
