import { Button } from "@/components/ui/button";


export interface SuggestionProps {
    id: string;
    text: string;
    onClick: (text: string) => void;
}

export default function Suggestion({ id, text, onClick }: SuggestionProps) {
    return (
        <Button
            key={id}
            variant="secondary"
            size="sm"
            className=""
            onClick={() => onClick(text)}
        >
            {text}
        </Button>
    )
}

export interface ChatInputSuggestionsProps {
    suggestions: SuggestionProps[];
}

export function ChatInputSuggestions({ suggestions }: ChatInputSuggestionsProps) {
    return (
        <div className="flex flex-row gap-2 overflow-x-auto">
            {suggestions.map((suggestion) => (
                <Suggestion
                    key={suggestion.id}
                    id={suggestion.id}
                    text={suggestion.text}
                    onClick={() => suggestion.onClick(suggestion.text)}
                />
            ))}
        </div>
    )
}