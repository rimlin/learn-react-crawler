import type { VercelRequest, VercelResponse } from '@vercel/node';
import * as cheerio from 'cheerio';

import sitesJson from '../data/sites.json' assert { type: 'json' };
import { ArticleInfo, SiteInfo, SiteMeta } from '../src/types/Crawler';

const sites = sitesJson.sites;

const getArticleUrl = (siteInfo: SiteMeta, href: string): string => {
  if (href.startsWith('http')) {
    return href;
  } else {
    return new URL(href, siteInfo.siteUrl).href;
  }
};

const parseArticles = (siteMeta: SiteMeta, html: string): ArticleInfo[] => {
  const $ = cheerio.load(html);

  const containedArticles = new Set();

  return $(siteMeta.selectors.article)
    .map((_, elem: cheerio.AnyNode) => {
      let date;
      if (siteMeta.selectors.datetime) {
        date =
          $(elem).find(siteMeta.selectors.datetime).attr('datetime') ||
          $(elem).find(siteMeta.selectors.datetime).text();
      }

      let href;
      if (siteMeta.selectors.link) {
        href = $(elem).find(siteMeta.selectors.link).prop('href');
      } else {
        href = $(elem).prop('href');
      }

      return {
        articleName: $(elem).find(siteMeta.selectors.title).text(),
        articleUrl: getArticleUrl(siteMeta, href),
        date,
        site: {
          name: siteMeta.name
        }
      };
    })
    .get()
    .filter(item => {
      if (containedArticles.has(item.articleUrl)) {
        return false;
      } else {
        containedArticles.add(item.articleUrl);

        return true;
      }
    });
};

export default async function handler(
  request: VercelRequest,
  response: VercelResponse
) {
  const { index } = request.query;

  const siteMeta: SiteMeta = sites[index as string];

  if (!siteMeta) {
    response.status(400).json({
      error: true
    });
  }

  try {
    const req = await fetch(siteMeta.blogUrl);
    const res = await req.text();

    const data = parseArticles(siteMeta, res);

    const json: SiteInfo = {
      name: siteMeta.name,
      blogUrl: siteMeta.blogUrl,
      data,
      success: data.length > 0
    };

    response.status(200).json(json);
  } catch (err: any) {
    const json: SiteInfo = {
      name: siteMeta.name,
      blogUrl: siteMeta.blogUrl,
      data: [],
      success: false,
      error: err.message || err
    };

    response.status(200).json(json);
  }
}
