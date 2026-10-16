import { Aesthetic } from "../aesthetics/types";
export default function extractChunks(
    streamText: string,
    delimiter: string = "####CHUNK_DELIMITER####"
) {
    const chunks: string[] = streamText.split(delimiter);
    return chunks.map(chunk => chunk).filter(chunk => chunk.length > 0);
}

export function capitaliseToolName(toolName: string): string {
  return toolName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

export function writeAestheticsMessage(liked: Aesthetic[], disliked: Aesthetic[]): string {
    const likedNames = liked.map(aesthetic => aesthetic.label).join(", ") || "None";
    const dislikedNames = disliked.map(aesthetic => aesthetic.label).join(", ") || "None";
    return `Liked: ${likedNames}.\n\n Disliked: ${dislikedNames}.`;
}