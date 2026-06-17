import { getDocsNavigation } from "@/lib/docs";
import Link from "next/link";
import { 
  Folder, Terminal, Code, GitBranch, Cloud, 
  Settings, Rocket, LineChart, ShieldCheck, Trophy, Bot,
  Database, Network, FileText, ChevronRight, BookOpen
} from "lucide-react";

function getCategoryStyle(name: string) {
  const n = name.toLowerCase();
  if (n.includes('linux')) return { icon: Terminal, color: 'text-green-400', bg: 'bg-green-500/10', gradient: 'from-green-500/20 via-green-500/5 to-transparent', border: 'border-green-500/20' };
  if (n.includes('scripting') || n.includes('python')) return { icon: Code, color: 'text-yellow-400', bg: 'bg-yellow-500/10', gradient: 'from-yellow-500/20 via-yellow-500/5 to-transparent', border: 'border-yellow-500/20' };
  if (n.includes('git')) return { icon: GitBranch, color: 'text-orange-400', bg: 'bg-orange-500/10', gradient: 'from-orange-500/20 via-orange-500/5 to-transparent', border: 'border-orange-500/20' };
  if (n.includes('terraform') || n.includes('azure')) return { icon: Cloud, color: 'text-blue-400', bg: 'bg-blue-500/10', gradient: 'from-blue-500/20 via-blue-500/5 to-transparent', border: 'border-blue-500/20' };
  if (n.includes('ansible')) return { icon: Settings, color: 'text-red-400', bg: 'bg-red-500/10', gradient: 'from-red-500/20 via-red-500/5 to-transparent', border: 'border-red-500/20' };
  if (n.includes('cicd') || n.includes('ci_cd')) return { icon: Rocket, color: 'text-purple-400', bg: 'bg-purple-500/10', gradient: 'from-purple-500/20 via-purple-500/5 to-transparent', border: 'border-purple-500/20' };
  if (n.includes('monitoring')) return { icon: LineChart, color: 'text-cyan-400', bg: 'bg-cyan-500/10', gradient: 'from-cyan-500/20 via-cyan-500/5 to-transparent', border: 'border-cyan-500/20' };
  if (n.includes('devsecops') || n.includes('security')) return { icon: ShieldCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10', gradient: 'from-emerald-500/20 via-emerald-500/5 to-transparent', border: 'border-emerald-500/20' };
  if (n.includes('capstone') || n.includes('project')) return { icon: Trophy, color: 'text-amber-400', bg: 'bg-amber-500/10', gradient: 'from-amber-500/20 via-amber-500/5 to-transparent', border: 'border-amber-500/20' };
  if (n.includes('al ml') || n.includes('ai') || n.includes('machine learning')) return { icon: Bot, color: 'text-pink-400', bg: 'bg-pink-500/10', gradient: 'from-pink-500/20 via-pink-500/5 to-transparent', border: 'border-pink-500/20' };
  if (n.includes('database') || n.includes('sql')) return { icon: Database, color: 'text-indigo-400', bg: 'bg-indigo-500/10', gradient: 'from-indigo-500/20 via-indigo-500/5 to-transparent', border: 'border-indigo-500/20' };
  
  return { icon: Folder, color: 'text-gray-400', bg: 'bg-white/10', gradient: 'from-gray-500/20 via-gray-500/5 to-transparent', border: 'border-gray-500/20' };
}

export default function DocsIndex() {
  const navigation = getDocsNavigation();

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center relative">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-blue-500/20 blur-[100px] rounded-full pointer-events-none" />
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-blue-100 to-gray-400 mb-6 drop-shadow-sm">
          Enterprise Curriculum
        </h1>
        <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
          Select a learning track below to explore comprehensive production architectures, deep-dive notes, and SRE best practices.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {navigation.map((category) => {
          const { icon: Icon, color, bg, gradient, border } = getCategoryStyle(category.name);
          const rootHref = `/docs/${category.files[0]?.slug.join('/')}`;
          
          return (
            <div 
              key={category.name} 
              className={`group relative overflow-hidden flex flex-col p-8 rounded-3xl bg-[#0f1115] border ${border} hover:border-white/20 transition-all duration-500 hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.5)]`}
            >
              {/* Decorative background gradient */}
              <div className={`absolute inset-0 bg-gradient-to-br ${gradient} opacity-30 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none`} />
              
              <div className="relative z-10 flex flex-col gap-5 mb-6">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shrink-0 shadow-inner ${bg} backdrop-blur-md border border-white/5 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                  <Icon className={`w-8 h-8 ${color}`} />
                </div>
                <div>
                  <Link href={rootHref} className="text-2xl font-bold text-white group-hover:text-white transition-colors before:absolute before:inset-0">
                    {category.name.replace(/_/g, ' ')}
                  </Link>
                  <div className="flex items-center gap-2 mt-2">
                    <BookOpen className="w-4 h-4 text-gray-500" />
                    <p className="text-sm text-gray-400 font-medium">
                      {category.files.length} {category.files.length === 1 ? 'Module' : 'Modules'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative z-10 flex flex-col gap-3 flex-grow mt-2">
                {category.files.slice(0, 3).map((file) => (
                  <Link 
                    key={file.path} 
                    href={`/docs/${file.slug.join('/')}`}
                    className="relative z-20 flex items-center gap-3 p-3.5 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/10 hover:border-white/10 transition-all duration-200 group/link"
                  >
                    <FileText className={`w-4 h-4 ${color} opacity-60 group-hover/link:opacity-100`} />
                    <span className="text-sm text-gray-300 group-hover/link:text-white truncate font-medium">
                      {file.title}
                    </span>
                  </Link>
                ))}
                
                {category.files.length > 3 && (
                  <Link 
                    href={rootHref}
                    className="relative z-20 flex items-center gap-2 p-3 mt-2 text-sm text-gray-400 font-medium hover:text-white hover:bg-white/5 rounded-xl transition-colors w-fit group/more"
                  >
                    <span>View all {category.files.length} modules</span>
                    <ChevronRight className="w-4 h-4 group-hover/more:translate-x-1 transition-transform" />
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
