import ReactMarkdown from 'react-markdown';
import rehypeRaw from 'rehype-raw';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export default function MarkdownRenderer({ content, className }: MarkdownRendererProps) {
  return (
    <div className={cn("text-sm xl:text-[16px] leading-relaxed prose prose-sm max-w-full [&>*]:text-inherit [&>p]:mb-2 [&>p:last-child]:mb-0 break-words", className)}>
      <ReactMarkdown 
        rehypePlugins={[rehypeRaw]}
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-lg xl:text-xl font-bold mb-3 mt-4 first:mt-0 break-words">{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-base xl:text-lg font-semibold mb-2 mt-3 first:mt-0 break-words">{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-sm xl:text-base font-semibold mb-2 mt-3 first:mt-0 break-words">{children}</h3>
          ),
          h4: ({ children }) => (
            <h4 className="text-sm xl:text-base font-medium mb-2 mt-2 first:mt-0 break-words">{children}</h4>
          ),
          h5: ({ children }) => (
            <h5 className="text-sm xl:text-base font-medium mb-2 mt-2 first:mt-0 break-words">{children}</h5>
          ),
          h6: ({ children }) => (
            <h6 className="text-sm xl:text-base font-medium mb-2 mt-2 first:mt-0 break-words">{children}</h6>
          ),

          // Paragraphs
          p: ({ children }) => (
            <p className="break-words mb-2 last:mb-0">{children}</p>
          ),

          // Lists
          ul: ({ children }) => (
            <ul className="list-disc list-inside mb-3 space-y-1 break-words">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="list-decimal list-inside mb-3 space-y-2 break-words">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="break-words">{children}</li>
          ),

          // Code
          code: ({ children, className: codeClassName }) => {
            const isInline = !codeClassName?.includes('language-');
            return isInline ? (
              <code className="bg-gray-700/50 px-1 py-0.5 rounded text-xs xl:text-[16px] break-words font-mono">
                {children}
              </code>
            ) : (
              <code className="text-xs xl:text-[16px] break-words font-mono">{children}</code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-gray-800 p-3 rounded-lg overflow-x-auto text-xs xl:text-[16px] whitespace-pre-wrap break-words font-mono mb-3">
              {children}
            </pre>
          ),

          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-gray-600 pl-4 py-2 my-3 italic text-gray-300 break-words">
              {children}
            </blockquote>
          ),

          // Links
          a: ({ children, href }) => (
            <a 
              href={href} 
              className="text-blue-400 hover:text-blue-300 underline break-words"
              target="_blank"
              rel="noopener noreferrer"
            >
              {children}
            </a>
          ),

          // Strong and emphasis
          strong: ({ children }) => (
            <strong className="font-semibold break-words">{children}</strong>
          ),
          em: ({ children }) => (
            <em className="italic break-words">{children}</em>
          ),
          
          // Underline (using u tag for markdown __text__)
          u: ({ children }) => (
            <u className="underline break-words">{children}</u>
          ),
          
          // Strikethrough (GFM)
          del: ({ children }) => (
            <del className="line-through break-words opacity-70">{children}</del>
          ),

          // Horizontal rule
          hr: () => (
            <hr className="border-border my-2" />
          ),

          // Tables
          table: ({ children }) => (
            <div className="overflow-x-auto my-4 rounded-lg border border-border">
              <table className="w-full border-collapse bg-transparent">
                {children}
              </table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-chat-assistant">{children}</thead>
          ),
          tbody: ({ children }) => (
            <tbody className="divide-y divide-border">{children}</tbody>
          ),
          tr: ({ children }) => (
            <tr className="hover:bg-[#e3dfd8]/20 transition-colors">{children}</tr>
          ),
          th: ({ children }) => (
            <th className="px-4 py-3 text-left font-normal text-sm xl:text-base text-foreground border-r border-border last:border-r-0">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-3 text-sm font-light xl:text-base text-foreground/90 border-r border-border last:border-r-0 align-top">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
