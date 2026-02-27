import NewsCard from "./NewsCard";
import type { NewsArticle } from "@/types";

interface NewsListProps {
    articles: NewsArticle[];
}

export default function NewsList({ articles }: NewsListProps) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {articles.map((article, index) => (
                <NewsCard key={`${article.url}-${index}`} article={article} />
            ))}
        </div>
    );
}