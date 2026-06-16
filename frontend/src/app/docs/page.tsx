import { getDocsNavigation } from "@/lib/docs";
import Link from "next/link";
import { Folder, BookOpen } from "lucide-react";

export default function DocsIndex() {
  const navigation = getDocsNavigation();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-white mb-4">Curriculum Documentation</h1>
        <p className="text-lg text-muted-foreground">
          Explore the comprehensive Markdown curriculum for Azure DevOps, Linux, Scripting, and more.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {navigation.map((category) => (
          <div key={category.name} className="p-6 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-lg bg-blue-500/10">
                <Folder className="w-5 h-5 text-blue-400" />
              </div>
              <h2 className="text-xl font-bold text-white">{category.name}</h2>
            </div>
            
            <ul className="space-y-2">
              {category.files.slice(0, 4).map((file) => (
                <li key={file.path}>
                  <Link href={`/docs/${file.slug.join('/')}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors">
                    <BookOpen className="w-3.5 h-3.5" />
                    {file.title}
                  </Link>
                </li>
              ))}
              {category.files.length > 4 && (
                <li className="text-xs text-muted-foreground pt-2 pl-6">
                  + {category.files.length - 4} more documents...
                </li>
              )}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
