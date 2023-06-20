export interface SiteMeta {
  name: string;
  siteUrl: string;
  blogUrl: string;
  selectors: {
    article: string;
    title: string;
    link?: string;
    datetime?: string;
  };
}

export interface ArticleInfo {
  articleName: string;
  articleUrl: string;
  date: string | undefined;
  site: {
    name: string;
  };
}

export interface SiteInfo {
  name: string;
  blogUrl: string;
  data: ArticleInfo[];
  success: boolean;
  error?: any;
}
