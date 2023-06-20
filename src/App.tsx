import { useCallback, useEffect, useMemo, useState } from 'react';
import classNames from 'classnames';

import { ArticleInfo, SiteInfo } from 'types/Crawler';
import { Feed } from 'components/Feed';
import {
  getInitialReadStatus,
  markAsReaded,
  toggleRead
} from 'services/readStatus';
import { ReadStatus } from 'types/ReadStatus';
import { useParseSites } from 'hooks/useParseSites';
import './App.css';
import { Progress } from 'components/Progress';

export default function App() {
  const [readStatus, setReadStatus] = useState<ReadStatus>({});
  const [selectedSite, setSelectedSite] = useState<SiteInfo | undefined>(
    undefined
  );

  const [data, total] = useParseSites();

  useEffect(() => {
    setReadStatus(getInitialReadStatus());
  }, []);

  const feedData: ArticleInfo[] = useMemo(() => {
    if (selectedSite) {
      return data.find(item => item === selectedSite)?.data || [];
    } else {
      const unreadArticles: ArticleInfo[] = [];

      for (const site of data) {
        for (const article of site.data) {
          if (readStatus[article.articleUrl] !== true) {
            unreadArticles.push(article);
          }
        }
      }

      return unreadArticles;
    }
  }, [selectedSite, data, readStatus]);

  const onToggleRead = useCallback((href: string) => {
    const status = toggleRead(href);

    setReadStatus(prevState => ({
      ...prevState,
      [href]: status
    }));
  }, []);

  const onMarkAllAsReaded = useCallback(() => {
    const newState = markAsReaded(feedData.map(item => item.articleUrl));

    setReadStatus(prevState => ({ ...prevState, ...newState }));
  }, [feedData]);

  const parsingErrors: SiteInfo[] = useMemo(() => {
    return data.filter(siteInfo => !siteInfo.success);
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
        {data.length < total ? (
          <Progress className="progress" value={data.length} total={total} />
        ) : null}

        {parsingErrors.length > 0 && !selectedSite ? (
          <div className="parsing-errors">
            <h3>The problem with parsing the following sites:</h3>
            <ul>
              {parsingErrors.map(siteInfo => (
                <li key={siteInfo.name}>
                  {siteInfo.name} ({siteInfo.blogUrl})
                </li>
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
