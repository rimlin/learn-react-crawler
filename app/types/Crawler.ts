export interface SiteInfo {
	siteUrl: string;
	blogUrl: string;
	selectors: {
		article: string;
		title: string;
		link: string;
		datetime: string | undefined;
	};
}

export interface SiteArticle {
	articleName: string;
	articleUrl: string;
	date: string | undefined;
}

export interface ArticlesBySite {
	[site: string]: SiteArticle[];
}
