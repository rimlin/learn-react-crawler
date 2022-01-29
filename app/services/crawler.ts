import * as cheerio from 'cheerio';
import { join } from 'path';
import { ArticlesBySite, SiteArticle, SiteInfo } from '~/types/Crawler';

const sites: SiteInfo[] = [
  {
    siteUrl: 'https://blog.isquaredsoftware.com/',
    blogUrl: 'https://blog.isquaredsoftware.com/',
    selectors: {
      article: '.article-list article',
      title: 'h2 a',
      link: 'h2 a',
      datetime: 'time'
    }
  },
  {
    siteUrl: 'https://kentcdodds.com/',
    blogUrl: 'https://kentcdodds.com/blog',
    selectors: {
      article: 'body > div:nth-child(2) > div:nth-child(4) > div > div',
      link: 'div > a',
      title: 'div > a > div:nth-child(3)',
      datetime: 'div > a > div:nth-child(2)'
    }
  },
  {
    siteUrl: 'https://www.joshwcomeau.com/',
    blogUrl: 'https://www.joshwcomeau.com/',
    selectors: {
      article: 'main article',
      link: 'a',
      title: 'a > h3',
      datetime: undefined
    }
  },
  {
    siteUrl: 'https://overreacted.io/',
    blogUrl: 'https://overreacted.io/',
    selectors: {
      article: 'main article',
      link: 'h3 a',
      title: 'h3 a',
      datetime: 'header > small'
    }
  },
  {
    siteUrl: 'https://thoughtspile.github.io/',
    blogUrl: 'https://thoughtspile.github.io/',
    selectors: {
      article: '.post-list .post-item',
      link: 'a',
      title: 'a span:nth-child(2)',
      datetime: undefined
    }
  },
  {
    siteUrl: 'https://kyleshevlin.com/',
    blogUrl: 'https://kyleshevlin.com/tags/react',
    selectors: {
      article: 'main > div > div',
      link: 'a',
      title: 'a',
      datetime: undefined
    }
  },
  {
    siteUrl: 'https://theodorusclarence.com/',
    blogUrl: 'https://theodorusclarence.com/blog',
    selectors: {
      article: 'main ul li',
      link: 'a',
      title: 'h4',
      datetime: 'a div:nth-child(2) p span'
    }
  }
];

const getArticleUrl = (siteInfo: SiteInfo, href: string): string => {
  if (href.startsWith('http')) {
    return href;
  } else {
    return join(siteInfo.siteUrl, href);
  }
};

const parseSite = async (siteInfo: SiteInfo): Promise<SiteArticle[]> => {
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

      return {
        articleName: $(elem).find(siteInfo.selectors.title).text(),
        articleUrl: getArticleUrl(
          siteInfo,
          $(elem).find(siteInfo.selectors.link).prop('href')
        ),
        date
      };
    })
    .get();
};

export const parseSites = async (): Promise<ArticlesBySite> => {
  const sitesArticles = await Promise.all(
    sites.map(async site => ({
      siteUrl: site.siteUrl,
      articles: await parseSite(site)
    }))
  );

  const res: ArticlesBySite = {};

  for (const item of sitesArticles) {
    res[item.siteUrl] = item.articles;
  }

  return res;
};
