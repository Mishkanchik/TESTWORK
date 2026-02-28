// src/hooks/useNews.ts
import { useQuery } from "@tanstack/react-query";
import { getTopHeadlines, searchEverything } from "@/api/newsApi";
import { getAllowedSources, getTopics } from "@/api/cmsApi";
import type { NewsResponse, AllowedSource, Topic, NewsArticle } from "@/types";

// ─── Хук для дозволених джерел ──────────────────────────────────────────────
export const useAllowedSources = () => {
    return useQuery<AllowedSource[], Error>({
        queryKey: ["allowed-sources"],
        queryFn: async () => {
            const sources = await getAllowedSources();
            return sources.length > 0
                ? sources
                : [
                    { id: "bbc-news", name: "BBC News" },
                    { id: "cnn", name: "CNN" },
                    { id: "reuters", name: "Reuters" },
                    { id: "the-verge", name: "The Verge" },
                ];
        },
        staleTime: 1000 * 60 * 60, // 1 година
    });
};

// ─── Хук для тем ─────────────────────────────────────────────────────────────
export const useTopics = () => {
    return useQuery<Topic[], Error>({
        queryKey: ["topics"],
        queryFn: getTopics,
        staleTime: 1000 * 60 * 60,
    });
};

// ─── Основний хук для новин ──────────────────────────────────────────────────
export const useNews = (filters: {
    search?: string;
    sources?: string[];
    sortBy?: "publishedAt" | "relevancy" | "popularity";
    topic?: string;
}) => {
    const { data: allowedSources = [] } = useAllowedSources();
    const { data: topics = [] } = useTopics();

    const allowedSourcesStr = allowedSources.map(s => s.id).join(",") || "";

    const finalSources = filters.sources?.length
        ? filters.sources.join(",")
        : allowedSourcesStr;

    const isEnabled = !!finalSources || !!filters.search?.trim();

    return useQuery<NewsResponse & { articles: (NewsArticle & { topic?: string })[] }, Error>({
        queryKey: ["news", filters.search?.trim(), finalSources, filters.sortBy, filters.topic],

        queryFn: async () => {
            let result: NewsResponse;

            // Якщо є тема — додаємо її ключові слова до пошуку
            let effectiveSearch = filters.search || "";
            if (filters.topic && filters.topic !== "all") {
                const selectedTopic = topics.find(t => t.name === filters.topic);
                if (selectedTopic && selectedTopic.keywords.length > 0) {
                    effectiveSearch = selectedTopic.keywords.join(" OR ");
                    console.log(`Автоматичний пошук за темою "${filters.topic}": q=${effectiveSearch}`);
                }
            }

            if (effectiveSearch.trim().length > 2) {
                result = await searchEverything({
                    q: effectiveSearch.trim(),
                    sources: finalSources || undefined,
                    sortBy: filters.sortBy || "relevancy", // relevancy краще для ключових слів
                });
            } else {
                result = await getTopHeadlines({
                    sources: finalSources || undefined,
                    sortBy: filters.sortBy || "publishedAt",
                });
            }

            console.log(`Отримано статей: ${result.articles.length}`);

            // Збагачення темами
            const enrichedArticles = result.articles.map(article => {
                const text = [
                    article.title || "",
                    article.description || "",
                    article.content || "",
                ].join(" ").toLowerCase();

                const matched = topics.find(t =>
                    t.keywords.some(kw => text.includes(kw.toLowerCase()))
                );

                return {
                    ...article,
                    topic: matched?.name,
                };
            });

            return {
                ...result,
                articles: enrichedArticles,
            };
        },

        enabled: isEnabled,
        staleTime: 1000 * 60 * 5,
    });
};