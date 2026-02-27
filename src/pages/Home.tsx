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
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
            {/* Header — преміум скло + градієнт */}
            <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
                <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        Новини<span className="text-primary/60">.</span>
                    </h1>

                    <Button
                        variant="default"
                        size="lg"
                        className="hidden md:flex font-medium shadow-lg hover:shadow-xl transition-all"
                        asChild
                    >
                        <Link to="/api-config">Налаштування API & теми</Link>
                    </Button>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12">
                {/* Фільтри — красивий блок, без стрибків */}
                <div className="mb-16 flex flex-col md:flex-row items-center justify-center gap-6 lg:gap-8 flex-wrap">
                    <div className="w-full max-w-4xl flex flex-col sm:flex-row items-center gap-4 bg-card/50 backdrop-blur-sm p-4 rounded-2xl border border-border/50 shadow-sm">
                        <Filters
                            onSearchChange={setSearch}
                            onSourceChange={(v) => setSource(v === "all" ? undefined : v)}
                            onSortChange={(v) => setSort(v as any)}
                            className="flex-1 w-full sm:w-auto"
                        />

                        {/* Фільтр за темою */}
                        <Select value={topicFilter} onValueChange={setTopicFilter}>
                            <SelectTrigger className="w-full sm:w-[220px] bg-background/80 border-primary/30 focus:ring-primary/50">
                                <SelectValue placeholder="Тема" />
                            </SelectTrigger>
                            <SelectContent className="bg-card border-border/50 backdrop-blur-xl">
                                <SelectItem value="all" className="focus:bg-primary/10">Всі теми</SelectItem>
                                {topics.map((topic) => (
                                    <SelectItem key={topic.id} value={topic.name} className="focus:bg-primary/10">
                                        {topic.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {/* Стани */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6 lg:gap-8 justify-items-center">
                        {[...Array(10)].map((_, i) => (
                            <Skeleton key={i} className="h-[520px] w-full max-w-lg rounded-3xl shadow-md" />
                        ))}
                    </div>
                ) : error ? (
                    <Alert variant="destructive" className="max-w-4xl mx-auto bg-destructive/10 border-destructive/30 backdrop-blur-sm">
                        <AlertCircle className="h-6 w-6" />
                        <AlertTitle className="text-xl">Помилка завантаження</AlertTitle>
                        <AlertDescription className="text-lg">
                            {error.message || "Не вдалося завантажити новини. Перевірте підключення або налаштування."}
                        </AlertDescription>
                    </Alert>
                ) : articles.length === 0 ? (
                    <div className="max-w-4xl mx-auto py-24 text-center space-y-8">
                        <h2 className="text-5xl md:text-6xl font-bold bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                            Немає новин
                        </h2>
                        <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
                            Оберіть інше джерело, тему або введіть ключове слово
                        </p>
                        <Button size="xl" className="text-lg px-10 py-7 shadow-2xl hover:shadow-3xl transition-all" asChild>
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