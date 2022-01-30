import * as cheerio from 'cheerio';

import { SiteArticles, SiteArticle, SiteParseInfo } from '~/types/Crawler';

const sites: SiteParseInfo[] = require('~/data/sites').sites;

const getArticleUrl = (siteInfo: SiteParseInfo, href: string): string => {
  if (href.startsWith('http')) {
    return href;
  } else {
    return new URL(href, siteInfo.siteUrl).href;
  }
};

const parseSite = async (siteInfo: SiteParseInfo): Promise<SiteArticle[]> => {
  const req = await fetch(siteInfo.blogUrl);
  const res = await req.text();
  const $ = cheerio.load(res);

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
        date
      };
    })
    .get();
};

export const parseSites = async (): Promise<SiteArticles[]> => {
  const res = await Promise.all(
    sites.map(async site => ({
      name: site.name,
      blogUrl: site.blogUrl,
      articles: await parseSite(site)
    }))
  );

  return res;
};
