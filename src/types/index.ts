export interface Topic {
    id: string | number;
    name: string;
    keywords: string[];
}

export interface NewsArticle {
    title: string;
    description?: string;
    content?: string;
    url: string;
    urlToImage?: string;
    publishedAt: string;
    source: { id?: string; name: string };
}
export interface NewsResponse {
    status: string;
    totalResults: number;
    articles: NewsArticle[];
}

export interface AllowedSource {
    id: string;
    name: string;
    // можна додати category, country, тощо
}


