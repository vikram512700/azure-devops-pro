import { getDocsNavigation } from "@/lib/docs";
import Link from "next/link";
import { 
  Folder, Terminal, Code, GitBranch, Cloud, 
  Settings, Rocket, LineChart, ShieldCheck, Trophy, Bot,
  Database, Network, FileText, ChevronRight
} from "lucide-react";

function getCategoryStyle(name: string) {
  const n = name.toLowerCase();
  if (n.includes('linux')) return { icon: Terminal, color: 'text-green-400', bg: 'bg-green-500/10' };
  if (n.includes('scripting') || n.includes('python')) return { icon: Code, color: 'text-yellow-400', bg: 'bg-yellow-500/10' };
  if (n.includes('git')) return { icon: GitBranch, color: 'text-orange-400', bg: 'bg-orange-500/10' };
  if (n.includes('terraform') || n.includes('azure')) return { icon: Cloud, color: 'text-blue-400', bg: 'bg-blue-500/10' };
  if (n.includes('ansible')) return { icon: Settings, color: 'text-red-400', bg: 'bg-red-500/10' };
  if (n.includes('cicd') || n.includes('ci_cd')) return { icon: Rocket, color: 'text-purple-400', bg: 'bg-purple-500/10' };
  if (n.includes('monitoring')) return { icon: LineChart, color: 'text-cyan-400', bg: 'bg-cyan-500/10' };
  if (n.includes('devsecops') || n.includes('security')) return { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' };
  if (n.includes('capstone') || n.includes('project')) return { icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10' };
  if (n.includes('al ml') || n.includes('ai') || n.includes('machine learning')) return { icon: Bot, color: 'text-pink-400', bg: 'bg-pink-500/10' };
  if (n.includes('database') || n.includes('sql')) return { icon: Database, color: 'text-indigo-400', bg: 'bg-indigo-500/10' };
  
  return { icon: Folder, color: 'text-gray-400', bg: 'bg-white/10' };
}

export default function DocsIndex() {
  const navigation = getDocsNavigation();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-6xl mx-auto">
      <div className="text-center py-8">
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-white mb-4">
          Enterprise Curriculum
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Select a learning track below to explore comprehensive production architectures, deep-dive notes, and SRE best practices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {navigation.map((category) => {
          const { icon: Icon, color, bg } = getCategoryStyle(category.name);
          const rootHref = `/docs/${category.files[0]?.slug.join('/')}`;
          
          return (
            <div 
              key={category.name} 
              className="group flex flex-col p-6 rounded-2xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] hover:border-white/10 transition-all duration-300 shadow-lg"
            >
              <div className="flex items-center gap-4 mb-6">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center shrink-0 shadow-sm ${bg} group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className={`w-7 h-7 ${color}`} />
                </div>
                <div>
                  <Link href={rootHref} className="text-xl font-bold text-white hover:text-blue-400 transition-colors">
                    {category.name.replace(/_/g, ' ')}
                  </Link>
                  <p className="text-sm text-gray-400 font-medium mt-1">
                    {category.files.length} {category.files.length === 1 ? 'Document' : 'Documents'}
                  </p>
                </div>
              </div>

              <div className="flex flex-col gap-2 flex-grow">
                {category.files.slice(0, 4).map((file) => (
                  <Link 
                    key={file.path} 
                    href={`/docs/${file.slug.join('/')}`}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-white/5 transition-colors group/link"
                  >
                    <FileText className="w-4 h-4 text-gray-500 group-hover/link:text-blue-400 shrink-0" />
                    <span className="text-sm text-gray-300 group-hover/link:text-white truncate">
                      {file.title}
                    </span>
                  </Link>
                ))}
                
                {category.files.length > 4 && (
                  <Link 
                    href={rootHref}
                    className="flex items-center gap-2 p-2.5 mt-2 text-sm text-blue-400/80 hover:text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                  >
                    <span>+ {category.files.length - 4} more documents</span>
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
