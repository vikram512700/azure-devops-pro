"use client";

import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { cn } from '@/lib/utils';
import { TerminalSquare, BookOpen, Lightbulb } from 'lucide-react';

const getText = (children: any): string => {
  if (typeof children === 'string') return children;
  if (Array.isArray(children)) return children.map(getText).join('');
  if (children?.props?.children) return getText(children.props.children);
  return '';
};

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <div className="prose prose-invert prose-blue max-w-none">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ node, ...props }) => <h1 className="text-4xl font-extrabold tracking-tight text-white mt-10 mb-6 border-b border-white/10 pb-4 font-serif" {...props} />,
          h2: ({ node, ...props }) => <h2 className="text-3xl font-bold text-blue-100 mt-10 mb-5 font-serif" {...props} />,
          h3: ({ node, children, ...props }) => {
            const text = getText(children);
            if (text.includes("Real-Time") || text.includes("Scenario")) {
              return (
                <div className="mt-10 mb-4 bg-gradient-to-r from-blue-900/40 to-transparent border-l-4 border-blue-500 rounded-r-lg p-4 shadow-lg flex items-center gap-3">
                  <TerminalSquare className="w-6 h-6 text-blue-400 shrink-0" />
                  <h3 className="text-xl font-bold text-blue-50 m-0 font-serif" {...props}>{children}</h3>
                </div>
              );
            }
            return <h3 className="text-2xl font-semibold text-gray-200 mt-8 mb-4 font-serif" {...props}>{children}</h3>;
          },
          p: ({ node, children, ...props }) => {
            const text = getText(children);
            if (text.trim().startsWith("Definition:") || text.trim().startsWith("**Definition:**")) {
              return (
                <div className="my-8 bg-emerald-950/30 border border-emerald-500/20 rounded-xl p-6 shadow-2xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full blur-3xl -mr-10 -mt-10 pointer-events-none group-hover:bg-emerald-500/20 transition-all duration-500" />
                  <div className="flex gap-4 relative z-10">
                    <BookOpen className="w-6 h-6 text-emerald-400 shrink-0 mt-1" />
                    <div className="text-emerald-50 text-lg leading-relaxed font-serif" {...props}>
                      {children}
                    </div>
                  </div>
                </div>
              );
            }
            return <div className="text-gray-300 leading-loose mb-6 font-serif text-lg" {...props}>{children}</div>;
          },
          ul: ({ node, ...props }) => <ul className="list-disc list-outside pl-6 space-y-3 text-gray-300 mb-6 font-serif text-lg leading-loose" {...props} />,
          ol: ({ node, ...props }) => <ol className="list-decimal list-outside pl-6 space-y-3 text-gray-300 mb-6 font-serif text-lg leading-loose" {...props} />,
          li: ({ node, ...props }) => <li className="pl-2 marker:text-blue-500" {...props} />,
          a: ({ node, ...props }) => <a className="text-blue-400 hover:text-blue-300 underline underline-offset-4 decoration-blue-400/30 hover:decoration-blue-400 font-medium" {...props} />,
          strong: ({ node, ...props }) => <strong className="font-bold text-white tracking-wide" {...props} />,
          blockquote: ({ node, children, ...props }) => {
            const text = getText(children);
            if (text.includes("[!TIP]") || text.includes("Pro Tip:")) {
              return (
                <div className="my-8 bg-amber-950/30 border border-amber-500/20 rounded-xl p-6 shadow-lg relative flex gap-4">
                  <Lightbulb className="w-6 h-6 text-amber-400 shrink-0 mt-1" />
                  <div className="text-amber-100/90 text-lg leading-relaxed font-serif italic" {...props}>
                    {children}
                  </div>
                </div>
              );
            }
            return (
              <blockquote className="border-l-4 border-blue-500/50 bg-blue-500/5 px-6 py-4 rounded-r-lg text-gray-300 my-8 italic font-serif text-lg leading-loose shadow-sm" {...props}>
                {children}
              </blockquote>
            );
          },
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
