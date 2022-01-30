export interface SiteParseInfo {
  name: string;
  siteUrl: string;
  blogUrl: string;
  selectors: {
    article: string;
    title: string;
    link: string | undefined;
    datetime: string | undefined;
  };
}

export interface SiteArticle {
  articleName: string;
  articleUrl: string;
  date: string | undefined;
  site: {
    name: string;
  };
}

export interface SiteArticles {
  name: string;
  blogUrl: string;
  articles: SiteArticle[];
}
