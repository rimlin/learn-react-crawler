import { LinksFunction, LoaderFunction, useLoaderData } from 'remix';

import stylesUrl from '~/styles/index.css';
import { parseSites } from '~/services/crawler';
import { ArticlesBySite } from '~/types/Crawler';

export const links: LinksFunction = () => {
  return [{ rel: 'stylesheet', href: stylesUrl }];
};

export const loader: LoaderFunction = async () => {
  return parseSites();
};

export default function Index() {
  const data = useLoaderData<ArticlesBySite>();

  return (
    <main>
      <nav>
        <ul>
          {Object.keys(data).map(siteLink => (
            <li>{siteLink}</li>
          ))}
        </ul>
      </nav>
    </main>
  );
}
