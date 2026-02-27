// src/components/NewsCard.tsx
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
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
        <Card className="group overflow-hidden transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border-border/50 bg-card/95 backdrop-blur-sm h-full flex flex-col rounded-2xl">
            {/* Зображення */}
            {article.urlToImage ? (
                <div className="relative aspect-[16/9] overflow-hidden">
                    <img
                        src={article.urlToImage}
                        alt={article.title}
                        className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-110"
                        loading="lazy"
                        onError={(e) => {
                            e.currentTarget.src = "https://placehold.co/600x400/111827/ffffff?text=Новина";
                            e.currentTarget.alt = "Зображення недоступне";
                        }}
                    />

                    {/* Бейдж теми */}
                    {article.topic && (
                        <Badge
                            className="absolute top-4 left-4 z-10 px-3 py-1.5 text-sm font-medium bg-primary/90 text-primary-foreground shadow-lg backdrop-blur-sm border border-primary/30"
                        >
                            {article.topic}
                        </Badge>
                    )}
                </div>
            ) : (
                <div className="aspect-[16/9] bg-gradient-to-br from-muted/80 to-muted/50 flex items-center justify-center">
                    <span className="text-muted-foreground text-lg font-medium">Зображення відсутнє</span>
                </div>
            )}

            {/* Контент */}
            <CardHeader className="flex-grow pb-3 pt-5 px-6">
                <div className="flex items-start justify-between gap-4">
                    <CardTitle className="text-xl md:text-2xl font-bold leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        <a
                            href={article.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:underline"
                        >
                            {article.title}
                        </a>
                    </CardTitle>

                    <Button
                        variant="ghost"
                        size="icon"
                        className="mt-1 opacity-70 hover:opacity-100 transition-opacity"
                        asChild
                    >
                        <a href={article.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-5 w-5" />
                        </a>
                    </Button>
                </div>

                <CardDescription className="flex items-center gap-3 text-sm mt-3 text-muted-foreground">
                    <span className="font-semibold text-primary">{article.source.name}</span>
                    <span className="text-muted-foreground/70">•</span>
                    <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        <time dateTime={article.publishedAt}>
                            {formatDistanceToNow(publishedDate, { addSuffix: true, locale: uk })}
                        </time>
                    </div>
                </CardDescription>
            </CardHeader>

            <CardContent className="px-6 pb-4 flex-grow">
                <p className="text-base text-muted-foreground line-clamp-3 leading-relaxed">
                    {article.description || article.content?.substring(0, 200) || "Короткий опис відсутній..."}
                </p>
            </CardContent>

            <CardFooter className="px-6 pb-6 pt-2 border-t border-border/50">
                <Button
                    variant="default"
                    size="lg"
                    className="w-full font-medium"
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