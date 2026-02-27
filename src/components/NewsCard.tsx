// src/components/NewsCard.tsx
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { uk } from "date-fns/locale";
import type { NewsArticle } from "@/types";

interface NewsCardProps {
    article: NewsArticle & { topic?: string };
}

export default function NewsCard({ article }: NewsCardProps) {
    const publishedDate = new Date(article.publishedAt);

    return (
        <Card className="group relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:shadow-primary/20 hover:scale-[1.03] border-0 bg-gradient-to-br from-card/95 to-card/80 backdrop-blur-xl rounded-3xl h-full flex flex-col">
            {/* Зображення з градієнтним оверлеєм */}
            {article.urlToImage ? (
                <div className="relative aspect-[16/9] overflow-hidden">
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10" />
                    <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/600x400/0f172a/ffffff?text=Новина";
                            e.currentTarget.alt = "Зображення недоступне";
                        }}
                    />

                    {/* Бейдж теми — градієнтний, з легким блюром */}
                    {article.topic && (
                        <Badge
                            className="absolute top-4 left-4 z-20 px-4 py-2 text-sm font-semibold shadow-lg backdrop-blur-md border border-primary/40 bg-gradient-to-r from-primary/90 to-primary/70 text-primary-foreground"
                        >
                            {article.topic}
                        </Badge>
                    )}
                </div>
            ) : (
                <div className="aspect-[16/9] bg-gradient-to-br from-muted/80 to-muted/50 flex items-center justify-center">
                    <span className="text-muted-foreground/70 text-xl font-medium">Зображення відсутнє</span>
                </div>
            )}

            {/* Контент */}
            <CardHeader className="flex-grow pt-6 pb-3 px-6 md:px-8">
                <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-xl md:text-2xl lg:text-3xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline decoration-primary decoration-2 underline-offset-4"
                        >
                            {article.title}
                        </a>
                    </CardTitle>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="mt-1 opacity-70 group-hover:opacity-100 transition-all hover:bg-primary/10 hover:text-primary"
                        asChild
                    >
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-6 w-6" />
                        </a>
                    </Button>
                </div>

                <CardDescription className="flex flex-wrap items-center gap-3 text-sm mt-4 text-muted-foreground">
                    <span className="font-semibold text-primary tracking-wide">{article.source.name}</span>
                    <span className="text-muted-foreground/60">•</span>
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4 opacity-80" />
                        <time dateTime={article.publishedAt} className="italic">
                            {formatDistanceToNow(publishedDate, { addSuffix: true, locale: uk })}
                        </time>
                    </div>
                </CardDescription>
            </CardHeader>

            <CardContent className="px-6 md:px-8 pb-4 flex-grow">
                <p className="text-base md:text-lg text-muted-foreground/90 line-clamp-3 leading-relaxed">
                    {article.description || article.content?.substring(0, 200) || "Короткий опис відсутній..."}
                </p>
            </CardContent>

            <CardFooter className="px-6 md:px-8 pb-8 pt-2 border-t border-border/30">
                <Button
                    variant="default"
                    size="lg"
                    className="w-full font-semibold text-base shadow-lg hover:shadow-xl hover:bg-primary/90 transition-all duration-300"
                    asChild
                >
                    <a href={article.url} target="_blank" rel="noopener noreferrer">
                        Читати повністю
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
}