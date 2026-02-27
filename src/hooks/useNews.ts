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
            // Fallback, якщо Strapi порожній
            return sources.length > 0
                ? sources
                : [
                    { id: "bbc-news", name: "BBC News" },
                    { id: "cnn", name: "CNN" },
                    { id: "reuters", name: "Reuters" },
                    { id: "techcrunch", name: "TechCrunch" },
                ];
        },
        staleTime: 1000 * 60 * 60, // 1 година
        gcTime: 1000 * 60 * 60 * 24,
    });
};

// ─── Хук для тем ─────────────────────────────────────────────────────────────
export const useTopics = () => {
    return useQuery<Topic[], Error>({
        queryKey: ["topics"],
        queryFn: getTopics,
        staleTime: 1000 * 60 * 60,
        gcTime: 1000 * 60 * 60 * 24,
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

            if (filters.search && filters.search.trim().length > 2) {
                result = await searchEverything({
                    q: filters.search.trim(),
                    sources: finalSources || undefined,
                    sortBy: filters.sortBy || "publishedAt",
                });
            } else {
                result = await getTopHeadlines({
                    sources: finalSources || undefined,
                    sortBy: filters.sortBy || "publishedAt",
                });
            }

            // 1. Фільтрація за темою (якщо вибрано)
            let filteredArticles = result.articles;
            if (filters.topic && filters.topic !== "all") {
                const selectedTopic = topics.find(t => t.name === filters.topic);
                if (selectedTopic) {
                    filteredArticles = filteredArticles.filter(article => {
                        const titleLower = article.title.toLowerCase();
                        return selectedTopic.keywords.some(kw =>
                            titleLower.includes(kw.toLowerCase())
                        );
                    });
                }
            }

            // 2. Збагачення статей темами (для бейджів на картках)
            const enrichedArticles = filteredArticles.map(article => {
                const titleLower = article.title.toLowerCase();
                const matchedTopic = topics.find(t =>
                    t.keywords.some(kw => titleLower.includes(kw.toLowerCase()))
                );
                return {
                    ...article,
                    topic: matchedTopic?.name,
                };
            });

            return {
                ...result,
                articles: enrichedArticles,
            };
        },

        enabled: isEnabled,
        staleTime: 1000 * 60 * 5, // 5 хвилин для новин
        gcTime: 1000 * 60 * 30,
    });
};