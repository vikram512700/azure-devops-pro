"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { modulesData } from "@/data/modules";
import { BookOpen, Terminal, Rocket, Search, FileText } from "lucide-react";
import type { DocCategory } from "@/lib/docs";

export function CommandMenu({ docsNavigation = [] }: { docsNavigation?: DocCategory[] }) {
  const [open, setOpen] = React.useState(false);
  const router = useRouter();

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };

    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false);
    command();
  }, []);

  // Convert modules dictionary to array for search
  const modulesArray = Object.values(modulesData);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="hidden md:flex items-center gap-2 px-4 py-2 text-sm text-gray-400 bg-white/5 border border-white/10 rounded-full hover:bg-white/10 hover:text-white transition-all ml-4"
      >
        <Search className="w-4 h-4" />
        Search curriculum...
        <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border border-white/20 bg-white/10 px-1.5 font-mono text-[10px] font-medium text-white opacity-100">
          <span className="text-xs">⌘</span>K
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search modules & docs..." />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          
          <CommandGroup heading="Tools">
            <CommandItem value="dashboard tools" onSelect={() => runCommand(() => router.push("/dashboard"))}>
              <Rocket className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </CommandItem>
            <CommandItem value="ai interviewer mock interview" onSelect={() => runCommand(() => router.push("/interview"))}>
              <Terminal className="mr-2 h-4 w-4" />
              <span>AI Interviewer</span>
            </CommandItem>
            <CommandItem value="jd analyzer resume" onSelect={() => runCommand(() => router.push("/jd-analyzer"))}>
              <BookOpen className="mr-2 h-4 w-4" />
              <span>JD Analyzer</span>
            </CommandItem>
          </CommandGroup>

          {docsNavigation.length > 0 && (
            <CommandGroup heading="Curriculum Docs">
              {docsNavigation.flatMap(category => 
                category.files.map(file => (
                  <CommandItem
                    key={file.path}
                    value={`docs ${category.name} ${file.title}`}
                    onSelect={() => runCommand(() => router.push(`/docs/${file.slug.join('/')}`))}
                  >
                    <FileText className="mr-2 h-4 w-4 text-emerald-400" />
                    <span>{category.name.replace(/_/g, ' ')}: {file.title}</span>
                  </CommandItem>
                ))
              )}
            </CommandGroup>
          )}

          <CommandGroup heading="Interactive Labs">
            {modulesArray.map((mod) => (
              <CommandItem
                key={mod.id}
                value={`module ${mod.id} ${mod.title}`}
                onSelect={() => runCommand(() => router.push(`/module/${mod.id}`))}
              >
                <BookOpen className="mr-2 h-4 w-4 text-blue-400" />
                <span>Interactive Lab {mod.id}: {mod.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>

        </CommandList>
      </CommandDialog>
    </>
  );
}
