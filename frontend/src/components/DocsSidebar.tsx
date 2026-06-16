"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { DocCategory } from "@/lib/docs";
import { Book, ChevronRight, Folder } from "lucide-react";

export function DocsSidebar({ navigation }: { navigation: DocCategory[] }) {
  const pathname = usePathname();

  return (
    <div className="p-4 space-y-6">
      <div className="flex items-center gap-2 px-2 text-white">
        <Book className="w-5 h-5 text-blue-400" />
        <h2 className="font-bold text-lg">Curriculum Docs</h2>
      </div>

      <div className="space-y-4">
        {navigation.map((category) => (
          <div key={category.name} className="space-y-1">
            <div className="flex items-center gap-2 px-2 py-1.5 text-sm font-semibold text-gray-300">
              <Folder className="w-4 h-4 text-gray-500" />
              {category.name}
            </div>
            <div className="pl-4 space-y-0.5 border-l border-white/5 ml-4">
              {category.files.map((file) => {
                const href = `/docs/${file.slug.join('/')}`;
                const isActive = pathname === href;
                
                return (
                  <Link
                    key={href}
                    href={href}
                    className={cn(
                      "group flex items-center justify-between px-3 py-1.5 rounded-md text-sm transition-all",
                      isActive 
                        ? "bg-blue-600/10 text-blue-400 font-medium" 
                        : "text-gray-400 hover:text-white hover:bg-white/5"
                    )}
                  >
                    <span className="truncate">{file.title}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-50 shrink-0" />}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
