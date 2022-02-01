export interface SiteMeta {
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

export interface ParsedArticle {
  articleName: string;
  articleUrl: string;
  date: string | undefined;
  site: {
    name: string;
  };
}

export interface ParsedSite {
  articles: ParsedArticle[];
  success: boolean;
  error?: any;
}

export interface SiteInfo {
  name: string;
  blogUrl: string;
  data: ParsedSite;
}
