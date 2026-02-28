// src/pages/Home.tsx
import { useState, useEffect } from "react";
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

    const { data: topics = [] } = useTopics();

    // Автоматичний пошук по темі — ключовий фікс
    useEffect(() => {
        if (topicFilter === "all") {
            setSearch(""); // скидаємо пошук
        } else {
            const selectedTopic = topics.find(t => t.name === topicFilter);
            if (selectedTopic && selectedTopic.keywords.length > 0) {
                // Беремо перше ключове слово теми і запускаємо пошук
                const keyword = selectedTopic.keywords[0];
                setSearch(keyword);
                console.log(`Автоматичний пошук за темою "${topicFilter}": q=${keyword}`);
            }
        }
    }, [topicFilter, topics]);

    const { data, isLoading, error } = useNews({
        search: search.trim(),
        sources: source ? [source] : undefined,
        sortBy: sort,
        // topic: topicFilter !== "all" ? topicFilter : undefined, // можна залишити або видалити
    });

    const articles = data?.articles ?? [];

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-5 flex items-center justify-between">
                    <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-black">
                        Новини<span className="text-primary">.</span>
                    </h1>

                    <Button variant="outline" size="lg" className="hidden sm:flex" asChild>
                        <Link to="/api-config">Налаштування API & теми</Link>
                    </Button>
                </div>
            </header>

            <main className="container mx-auto px-4 py-10 text-center">
                <div className="mb-12 flex flex-col md:flex-row items-center justify-center gap-6 flex-wrap">
                    <Filters
                        onSearchChange={setSearch}
                        onSourceChange={(v) => setSource(v === "all" ? undefined : v)}
                        onSortChange={(v) => setSort(v as any)}
                    />

                    <Select value={topicFilter} onValueChange={setTopicFilter}>
                        <SelectTrigger className="w-[200px]">
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

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 justify-items-center">
                        {[...Array(8)].map((_, i) => (
                            <Skeleton key={i} className="h-[480px] w-full max-w-md rounded-2xl" />
                        ))}
                    </div>
                ) : error ? (
                    <Alert variant="destructive" className="max-w-4xl mx-auto">
                        <AlertCircle className="h-6 w-6" />
                        <AlertTitle>Помилка</AlertTitle>
                        <AlertDescription>{error.message}</AlertDescription>
                    </Alert>
                ) : articles.length === 0 ? (
                    <div className="max-w-3xl mx-auto py-20">
                        <h2 className="text-4xl font-bold mb-6">Немає новин</h2>
                        <p className="text-xl text-muted-foreground">Спробуйте іншу тему або джерело</p>
                    </div>
                ) : (
                    <NewsList articles={articles} />
                )}
            </main>
        </div>
    );
}