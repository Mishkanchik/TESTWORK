// src/pages/Home.tsx
import { useState } from "react";
import { Link } from "react-router-dom";
import { useNews, useTopics } from "@/hooks/useNews";
import Filters from "@/components/Filters";
import NewsList from "@/components/NewsList";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function Home() {
    const [search, setSearch] = useState("");
    const [source, setSource] = useState<string | undefined>(undefined);
    const [sort, setSort] = useState<"publishedAt" | "relevancy" | "popularity">("publishedAt");
    const [topicFilter, setTopicFilter] = useState<string>("all");

    const { data, isLoading, error } = useNews({
        search: search.trim(),
        sources: source ? [source] : undefined,
        sortBy: sort,
        topic: topicFilter !== "all" ? topicFilter : undefined,
    });

    const { data: topics = [] } = useTopics();

    const articles = data?.articles ?? [];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-5 flex items-center justify-between">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">
                        Новини<span className="text-primary">.</span>
                    </h1>

                    <Button variant="outline" size="lg" className="hidden sm:flex" asChild>
                        <Link to="/api-config">Налаштування API & теми</Link>
                    </Button>
                </div>
            </header>

            {/* Main */}
            <main className="container mx-auto px-4 py-10 text-center">
                {/* Фільтри + тема */}
                <div className="mb-12 flex flex-col md:flex-row items-center justify-center gap-6 flex-wrap">
                    <Filters
                        onSearchChange={setSearch}
                        onSourceChange={(v) => setSource(v === "all" ? undefined : v)}
                        onSortChange={(v) => setSort(v as any)}
                    />

                    {/* Фільтр за темою */}
                    <Select value={topicFilter} onValueChange={setTopicFilter}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Тема" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Всі теми</SelectItem>
                            {topics.map((topic) => (
                                <SelectItem key={topic.id} value={topic.name}>
                                    {topic.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>

                {/* Стани */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 md:gap-8 justify-items-center">
                        {[...Array(10)].map((_, i) => (
                            <Skeleton key={i} className="h-[480px] w-full max-w-md rounded-2xl" />
                        ))}
                    </div>
                ) : error ? (
                    <Alert variant="destructive" className="max-w-4xl mx-auto">
                        <AlertCircle className="h-6 w-6" />
                        <AlertTitle>Помилка</AlertTitle>
                        <AlertDescription>{error.message || "Не вдалося завантажити новини"}</AlertDescription>
                    </Alert>
                ) : articles.length === 0 ? (
                    <div className="max-w-3xl mx-auto py-20">
                        <h2 className="text-4xl font-bold mb-6">Немає новин</h2>
                        <p className="text-xl text-muted-foreground mb-10">
                            Оберіть інше джерело, тему або введіть ключове слово
                        </p>
                        <Button size="lg" asChild>
                            <Link to="/api-config">Налаштування CMS</Link>
                        </Button>
                    </div>
                ) : (
                    <NewsList articles={articles} />
                )}
            </main>
        </div>
    );
}