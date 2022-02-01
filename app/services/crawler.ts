import * as cheerio from 'cheerio';

import { SiteInfo, SiteMeta, ParsedSite } from '~/types/Crawler';

const sites: SiteMeta[] = require('~/data/sites').sites;

const getArticleUrl = (siteInfo: SiteMeta, href: string): string => {
  if (href.startsWith('http')) {
    return href;
  } else {
    return new URL(href, siteInfo.siteUrl).href;
  }
};

const parseSite = async (siteInfo: SiteMeta): Promise<ParsedSite> => {
  const parseArticles = (html: string) => {
    const $ = cheerio.load(html);

    return $(siteInfo.selectors.article)
      .map((index: number, elem: cheerio.Node) => {
        let date;
        if (siteInfo.selectors.datetime) {
          date =
            $(elem).find(siteInfo.selectors.datetime).attr('datetime') ||
            $(elem).find(siteInfo.selectors.datetime).text();
        }

        let href;
        if (siteInfo.selectors.link) {
          href = $(elem).find(siteInfo.selectors.link).prop('href');
        } else {
          href = $(elem).prop('href');
        }

        return {
          articleName: $(elem).find(siteInfo.selectors.title).text(),
          articleUrl: getArticleUrl(siteInfo, href),
          date,
          site: {
            name: siteInfo.name
          }
        };
      })
      .get();
  };

  try {
    const req = await fetch(siteInfo.blogUrl);
    const res = await req.text();

    return {
      articles: parseArticles(res),
      success: true
    };
  } catch (err: any) {
    return {
      articles: [],
      success: false,
      error: err.message || err
    };
  }
};

export const parseSites = async (): Promise<SiteInfo[]> => {
  const res = await Promise.all(
    sites.map(async site => ({
      name: site.name,
      blogUrl: site.blogUrl,
      data: await parseSite(site)
    }))
  );

  return res;
};
