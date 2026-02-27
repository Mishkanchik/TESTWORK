// src/components/ApiConfigPage.tsx
import { useAllowedSources, useTopics } from "@/hooks/useNews";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ApiConfigPage() {
    const { data: sources, isLoading: sourcesLoading, error: sourcesError } = useAllowedSources();
    const { data: topics, isLoading: topicsLoading, error: topicsError } = useTopics();

    const isLoading = sourcesLoading || topicsLoading;
    const hasError = sourcesError || topicsError;

    return (
        <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
            {/* Header */}
            <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
                <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                    <h1 className="text-3xl font-bold tracking-tight">
                        Налаштування CMS
                        <span className="text-primary ml-1">.</span>
                    </h1>

                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="sm" asChild>
                            <Link to="/">Назад до новин</Link>
                        </Button>
                        <Button size="sm" variant="default">
                            <RefreshCw className="h-4 w-4 mr-2" />
                            Оновити
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8 max-w-6xl">
                {isLoading ? (
                    <div className="grid gap-8 md:grid-cols-2">
                        <Skeleton className="h-96 rounded-xl" />
                        <Skeleton className="h-96 rounded-xl" />
                    </div>
                ) : hasError ? (
                    <Alert variant="destructive" className="max-w-2xl mx-auto">
                        <AlertCircle className="h-5 w-5" />
                        <AlertTitle>Помилка завантаження конфігурації</AlertTitle>
                        <AlertDescription>
                            {sourcesError?.message || topicsError?.message || "Не вдалося завантажити дані з CMS. Перевірте підключення до Strapi."}
                        </AlertDescription>
                    </Alert>
                ) : (
                    <>
                        {/* Заголовок */}
                        <div className="mb-10 text-center">
                            <h2 className="text-4xl font-bold tracking-tight mb-3">
                                Налаштування з CMS (Strapi)
                            </h2>
                            <p className="text-muted-foreground max-w-2xl mx-auto">
                                Зміни в Strapi автоматично відображаються тут без перезапуску фронтенду.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2">
                            {/* Дозволені джерела */}
                            <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="bg-muted/30 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <Settings className="h-5 w-5 text-primary" />
                                        Дозволені джерела
                                    </CardTitle>
                                    <CardDescription>
                                        Список джерел, які відображаються в додатку
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6">
                                    {sources && sources.length > 0 ? (
                                        <div className="flex flex-wrap gap-3">
                                            {sources.map((source) => (
                                                <Badge
                                                    key={source.id}
                                                    variant="secondary"
                                                    className="text-base py-2 px-4 bg-primary/10 hover:bg-primary/20 transition-colors cursor-default"
                                                >
                                                    {source.name} <span className="ml-1.5 text-xs opacity-70">({source.id})</span>
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">
                                            Джерела не знайдено. Додайте їх у Strapi.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Теми */}

                            <Card className="overflow-hidden border-border/50 shadow-sm hover:shadow-md transition-shadow">
                                <CardHeader className="bg-muted/30 pb-4">
                                    <CardTitle className="flex items-center gap-2 text-xl">
                                        <span role="img" aria-label="sparkles">✨</span>
                                        Теми (класифікація за ключовими словами)
                                    </CardTitle>
                                    <CardDescription>
                                        Теми, за якими класифікуються новини
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-6 space-y-6">
                                    {topicsLoading ? (
                                        <Skeleton className="h-40 w-full rounded-lg" />
                                    ) : topicsError ? (
                                        <Alert variant="destructive">
                                            <AlertCircle className="h-4 w-4" />
                                            <AlertTitle>Помилка</AlertTitle>
                                            <AlertDescription>{topicsError.message}</AlertDescription>
                                        </Alert>
                                    ) : topics && topics.length > 0 ? (
                                        <div className="space-y-5">
                                            {topics.map((topic) => (
                                                <div key={topic.id} className="border-b pb-4 last:border-b-0">
                                                    <h3 className="font-semibold text-lg mb-2">{topic.name}</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {topic.keywords.map((kw, idx) => (
                                                            <Badge key={idx} variant="outline" className="text-sm px-3 py-1">
                                                                {kw}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-8">
                                            Теми не знайдено. Додайте їх у Strapi.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Підказка */}
                        <div className="mt-12 text-center text-sm text-muted-foreground">
                            Зміни в Strapi автоматично відображаються тут без перезапуску фронтенду.
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}