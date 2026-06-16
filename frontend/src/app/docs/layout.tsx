import { DocsSidebar } from "@/components/DocsSidebar";
import { getDocsNavigation } from "@/lib/docs";

export default function DocsLayout({ children }: { children: React.ReactNode }) {
  const navigation = getDocsNavigation();

  return (
    <div className="flex min-h-screen pt-16 bg-background">
      {/* Sidebar - hidden on mobile, visible on lg screens */}
      <aside className="hidden lg:block w-72 border-r border-white/10 shrink-0 h-[calc(100vh-4rem)] sticky top-16 overflow-y-auto custom-scrollbar">
        <DocsSidebar navigation={navigation} />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0">
        <div className="max-w-4xl mx-auto p-6 md:p-10 pb-24">
          {children}
        </div>
      </main>
    </div>
  );
}
