import { getDocContent, getDocsNavigation } from "@/lib/docs";
import { MarkdownRenderer } from "@/components/MarkdownRenderer";
import { notFound } from "next/navigation";
import { ChevronRight } from "lucide-react";

interface PageProps {
  params: Promise<{ slug: string[] }>;
}

export async function generateStaticParams() {
  const navigation = getDocsNavigation();
  const paths: { slug: string[] }[] = [];
  
  for (const category of navigation) {
    for (const file of category.files) {
      paths.push({ slug: file.slug });
    }
  }
  
  return paths;
}

export default async function DocPage({ params }: PageProps) {
  // Await the params since this is Next.js 15+ App Router behavior expected by the user config
  const resolvedParams = await params;
  const slug = resolvedParams.slug;
  
  const content = getDocContent(slug);

  if (!content) {
    notFound();
  }

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <span>Docs</span>
        <ChevronRight className="w-4 h-4" />
        {slug.map((part, index) => (
          <span key={index} className="flex items-center gap-2">
            <span className={index === slug.length - 1 ? "text-blue-400 font-medium" : ""}>
              {part.replace(/_/g, ' ')}
            </span>
            {index < slug.length - 1 && <ChevronRight className="w-4 h-4" />}
          </span>
        ))}
      </div>
      
      <MarkdownRenderer content={content} />
    </div>
  );
}
