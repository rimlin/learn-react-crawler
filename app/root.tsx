import {
  Links,
  LinksFunction,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration
} from 'remix';
import type { MetaFunction } from 'remix';

import resetStylesUrl from './styles/reset.css';
import sharedStylesUrl from './styles/shared.css';

export const meta: MetaFunction = () => {
  return { title: 'Learn React Crawler' };
};

export const links: LinksFunction = () => {
  return [
    { rel: 'stylesheet', href: resetStylesUrl },
    { rel: 'stylesheet', href: sharedStylesUrl }
  ];
};

export default function App() {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width,initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        <Outlet />
        <ScrollRestoration />
        <Scripts />
        {process.env.NODE_ENV === 'development' && <LiveReload />}
      </body>
    </html>
  );
}
