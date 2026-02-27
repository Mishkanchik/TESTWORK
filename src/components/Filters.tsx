import { Input } from "../components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { useAllowedSources } from "../hooks/useNews";
import { cn } from "@/lib/utils";

interface Props {
    onSearchChange: (val: string) => void;
    onSourceChange: (val: string) => void;
    onSortChange: (val: string) => void;
    className?: string;
}

export default function Filters({ onSearchChange, onSourceChange, onSortChange, className }: Props) {
    const { data: sources } = useAllowedSources();

    return (
        <div className={cn("flex flex-col sm:flex-row gap-4", className)}>
            <Input
                placeholder="Пошук за назвою..."
                onChange={(e) => onSearchChange(e.target.value)}
                className="max-w-sm"
            />

            <Select onValueChange={onSourceChange}>
                <SelectTrigger className="w-[220px]">
                    <SelectValue placeholder="Джерело" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="all">Всі дозволені</SelectItem>
                    {sources?.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                            {s.name}
                        </SelectItem>
                    ))}
                </SelectContent>
            </Select>

            <Select onValueChange={onSortChange} defaultValue="publishedAt">
                <SelectTrigger className="w-full sm:w-[180px]">
                    <SelectValue placeholder="Сортування" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="publishedAt">За датою</SelectItem>
                    <SelectItem value="relevancy">За релевантністю</SelectItem>
                    <SelectItem value="popularity">За популярністю</SelectItem>
                </SelectContent>
            </Select>
        </div>
    );
}