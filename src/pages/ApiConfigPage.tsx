// src/components/ApiConfigPage.tsx
import { useAllowedSources, useTopics } from "@/hooks/useNews";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle, RefreshCw, Settings, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function ApiConfigPage() {
    const { data: sources, isLoading: sourcesLoading, error: sourcesError, refetch: refetchSources } = useAllowedSources();
    const { data: topics, isLoading: topicsLoading, error: topicsError, refetch: refetchTopics } = useTopics();

    const isLoading = sourcesLoading || topicsLoading;
    const hasError = sourcesError || topicsError;

    const handleRefresh = () => {
        refetchSources();
        refetchTopics();
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
            {/* Header */}
            <header className="border-b border-border/50 bg-background/80 backdrop-blur-xl sticky top-0 z-50 shadow-sm">
                <div className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-6 flex items-center justify-between">
                    <h1 className="text-4xl md:text-5xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                        Налаштування CMS<span className="text-primary/60">.</span>
                    </h1>

                    <div className="flex items-center gap-5">
                        <Button
                            variant="outline"
                            size="lg"
                            className="font-medium shadow-lg hover:shadow-xl transition-all"
                            asChild
                        >
                            <Link to="/">Назад до новин</Link>
                        </Button>

                        <Button
                            size="lg"
                            variant="default"
                            onClick={handleRefresh}
                            className="font-medium shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
                        >
                            <RefreshCw className="h-5 w-5" />
                            Оновити
                        </Button>
                    </div>
                </div>
            </header>

            {/* Main */}
            <main className="max-w-screen-2xl mx-auto px-6 lg:px-12 py-12">
                {isLoading ? (
                    <div className="grid gap-8 md:grid-cols-2">
                        <Skeleton className="h-[520px] rounded-3xl shadow-2xl" />
                        <Skeleton className="h-[520px] rounded-3xl shadow-2xl" />
                    </div>
                ) : hasError ? (
                    <Alert variant="destructive" className="max-w-4xl mx-auto bg-destructive/10 border-destructive/30 backdrop-blur-sm rounded-2xl p-8">
                        <AlertCircle className="h-8 w-8" />
                        <AlertTitle className="text-2xl font-bold">Помилка завантаження</AlertTitle>
                        <AlertDescription className="text-lg mt-4">
                            {sourcesError?.message || topicsError?.message || "Не вдалося завантажити дані з CMS. Перевірте підключення до Strapi."}
                        </AlertDescription>
                    </Alert>
                ) : (
                    <>
                        {/* Заголовок */}
                        <div className="mb-16 text-center space-y-4">
                            <h2 className="text-5xl md:text-6xl font-black tracking-tight bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                Налаштування з CMS (Strapi)
                            </h2>
                            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                                Зміни в Strapi автоматично відображаються тут без перезапуску фронтенду
                            </p>
                        </div>

                        <div className="grid gap-10 md:grid-cols-2">
                            {/* Дозволені джерела */}
                            <Card className="overflow-hidden border-0 bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                                <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-primary/10">
                                    <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                                        <Settings className="h-7 w-7 text-primary" />
                                        Дозволені джерела
                                    </CardTitle>
                                    <CardDescription className="text-base mt-2">
                                        Список джерел, які відображаються в додатку
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-8 pb-10 px-8">
                                    {sources && sources.length > 0 ? (
                                        <div className="flex flex-wrap gap-4">
                                            {sources.map((source) => (
                                                <Badge
                                                    key={source.id}
                                                    variant="secondary"
                                                    className="text-base py-3 px-6 bg-primary/10 hover:bg-primary/20 transition-all duration-300 cursor-default shadow-md hover:shadow-lg rounded-full"
                                                >
                                                    {source.name}
                                                    <span className="ml-2 text-sm opacity-70">({source.id})</span>
                                                </Badge>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-12 text-lg">
                                            Джерела не знайдено. Додайте їх у Strapi.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>

                            {/* Теми */}
                            <Card className="overflow-hidden border-0 bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl rounded-3xl shadow-2xl hover:shadow-3xl transition-shadow duration-500">
                                <CardHeader className="pb-4 bg-gradient-to-r from-primary/5 to-primary/10">
                                    <CardTitle className="flex items-center gap-3 text-2xl font-bold">
                                        <Sparkles className="h-7 w-7 text-primary" />
                                        Теми (класифікація за ключовими словами)
                                    </CardTitle>
                                    <CardDescription className="text-base mt-2">
                                        Теми, за якими класифікуються новини
                                    </CardDescription>
                                </CardHeader>
                                <CardContent className="pt-8 pb-10 px-8 space-y-8">
                                    {topicsLoading ? (
                                        <Skeleton className="h-64 rounded-2xl shadow-md" />
                                    ) : topicsError ? (
                                        <Alert variant="destructive" className="rounded-2xl backdrop-blur-sm">
                                            <AlertCircle className="h-6 w-6" />
                                            <AlertTitle className="text-xl">Помилка</AlertTitle>
                                            <AlertDescription className="text-lg">
                                                {topicsError.message}
                                            </AlertDescription>
                                        </Alert>
                                    ) : topics && topics.length > 0 ? (
                                        <div className="space-y-8">
                                            {topics.map((topic) => (
                                                <div
                                                    key={topic.id}
                                                    className="p-6 bg-card/50 backdrop-blur-sm rounded-2xl border border-border/50 shadow-md hover:shadow-xl transition-all duration-300"
                                                >
                                                    <h3 className="font-bold text-2xl mb-4 bg-gradient-to-r from-primary to-primary/70 bg-clip-text text-transparent">
                                                        {topic.name}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-3">
                                                        {topic.keywords.length > 0 ? (
                                                            topic.keywords.map((kw, idx) => (
                                                                <Badge
                                                                    key={idx}
                                                                    variant="outline"
                                                                    className="text-base px-5 py-2 border-primary/30 bg-primary/5 hover:bg-primary/10 transition-all duration-300 rounded-full"
                                                                >
                                                                    {kw}
                                                                </Badge>
                                                            ))
                                                        ) : (
                                                            <p className="text-muted-foreground italic">Ключові слова відсутні</p>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-muted-foreground text-center py-12 text-xl">
                                            Теми не знайдено. Додайте їх у Strapi.
                                        </p>
                                    )}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Підказка */}
                        <div className="mt-16 text-center">
                            <p className="text-lg text-muted-foreground/80 max-w-3xl mx-auto">
                                Зміни в Strapi автоматично відображаються тут без перезапуску фронтенду
                            </p>
                        </div>
                    </>
                )}
            </main>
        </div>
    );
}