"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert prose-blue max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-3xl font-extrabold tracking-tight text-white mt-8 mb-4 border-b border-white/10 pb-4" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-2xl font-bold text-white mt-8 mb-4" {...props} />,
          h3: ({ node, ...props }) => <h3 className="text-xl font-semibold text-gray-200 mt-6 mb-3" {...props} />,
          p: ({ node, ...props }) => <div className="text-gray-300 leading-relaxed mb-4" {...props} />,
          ul: ({ node, ...props }) => <ul className="list-disc list-outside pl-6 space-y-2 text-gray-300 mb-4" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-outside pl-6 space-y-2 text-gray-300 mb-4" {...props} />,
          li: ({ node, ...props }) => <li className="pl-2" {...props} />,
          a: ({ node, ...props }) => <a className="text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-400/30 hover:decoration-blue-400" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-semibold text-white" {...props} />,
          blockquote: ({ node, ...props }) => (
            <blockquote className="border-l-4 border-blue-500/50 bg-blue-500/5 px-4 py-3 rounded-r-lg text-gray-300 my-6 italic" {...props} />
          ),
          code: ({ node, inline, className, children, ...props }: any) => {
            if (inline) {
              return (
                <code className="bg-white/10 text-blue-200 px-1.5 py-0.5 rounded-md text-sm font-mono" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <div className="relative group my-6">
                <div className="absolute -top-3 left-4 px-2 py-0.5 text-xs font-mono text-gray-400 bg-[#0d1117] border border-white/10 rounded-md">
                  {className?.replace('language-', '') || 'code'}
                </div>
                <pre className="p-4 pt-6 rounded-lg bg-[#0d1117] border border-white/10 overflow-x-auto text-sm text-gray-300 font-mono leading-relaxed" {...props}>
                  <code className={className}>{children}</code>
                </pre>
              </div>
            );
          },
          table: ({ node, ...props }) => (
            <div className="overflow-x-auto my-6 rounded-lg border border-white/10">
              <table className="w-full text-left text-sm text-gray-300" {...props} />
            </div>
          ),
          thead: ({ node, ...props }) => <thead className="bg-white/5 text-gray-200 border-b border-white/10" {...props} />,
          tbody: ({ node, ...props }) => <tbody className="divide-y divide-white/5" {...props} />,
          tr: ({ node, ...props }) => <tr className="hover:bg-white/[0.02] transition-colors" {...props} />,
          th: ({ node, ...props }) => <th className="px-4 py-3 font-semibold whitespace-nowrap" {...props} />,
          td: ({ node, ...props }) => <td className="px-4 py-3" {...props} />,
          hr: ({ node, ...props }) => <hr className="border-white/10 my-8" {...props} />,
          img: ({ node, ...props }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img className="rounded-lg border border-white/10 shadow-lg max-w-full my-6" {...props} alt={props.alt || "Markdown image"} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
