import classNames from 'classnames';

import { ArticleInfo, SiteInfo } from 'types/Crawler';
import { ReadStatus } from 'types/ReadStatus';

interface Props {
  site: SiteInfo | undefined;
  data: ArticleInfo[];
  toggleRead: (href: string) => void;
  markAllAsReaded: () => void;
  readStatus: ReadStatus;
}

export const Feed = ({
  site,
  data,
  toggleRead,
  readStatus,
  markAllAsReaded
}: Props) => {
  return (
    <div className="feed">
      <div className="panel">
        {site ? (
          <>
            <a href={site.blogUrl} target="_blank">
              {site.blogUrl}
            </a>
            <div
              className={classNames('site-status', {
                success: site.success,
                error: site.success === false
              })}>
              {site.success ? 'OK' : 'Error'}
            </div>
            {site.success === false ? (
              <div className="site-status-error">{site.error}</div>
            ) : null}
          </>
        ) : null}
        <button onClick={() => markAllAsReaded()} type="button">
          Mark all as readed
        </button>
      </div>

      {data.length === 0 ? (
        <div className="empty">No articles in the list.</div>
      ) : null}

      <ul>
        {data.map(item => {
          const isReaded = readStatus[item.articleUrl] === true;

          return (
            <li
              className={classNames({
                readed: isReaded
              })}
              key={item.articleUrl}>
              <a href={item.articleUrl} target="_blank">
                {item.articleName}
              </a>

              <div className="info">
                <button
                  onClick={() => toggleRead(item.articleUrl)}
                  type="button">
                  {isReaded ? 'Unreaded' : 'Readed'}
                </button>
                {site === undefined ? (
                  <span className="info-label">{item.site.name}</span>
                ) : null}
                {item.date ? <span className="date">{item.date}</span> : null}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
