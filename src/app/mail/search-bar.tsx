"use client";

import React from "react";
import { atom, useAtom } from "jotai";
import { motion } from "framer-motion";
import { Loader2, Search, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useThreads } from "@/hooks/use-threads";

export const isSearchingAtom = atom(false);
export const searchValueAtom = atom("");

const SearchBar = () => {
  const { isFetching } = useThreads();
  const [searchValue, setSearchValue] = useAtom(searchValueAtom);
  const [isSearching, setIsSearching] = useAtom(isSearchingAtom);
  const ref = React.useRef<HTMLInputElement>(null);

  const handleBlur = () => {
    if (!!searchValue) return;
    setIsSearching(false);
  };
  // add escape key to close
  React.useEffect(() => {
    if (typeof window === "undefined") return;

    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        handleBlur();
        ref.current?.blur();
      }
      if (
        e.key === "/" &&
        !["INPUT", "TEXTAREA", "SELECT"].includes(
          document.activeElement?.tagName || "",
        )
      ) {
        e.preventDefault();
        ref.current?.focus();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [setIsSearching, searchValue, isSearching]);

  return (
    <div className="bg-background/95 supports-[backdrop-filter]:bg-background/60 p-4 backdrop-blur">
      <motion.div className="relative" layoutId="search-bar">
        <Search className="text-muted-foreground absolute top-2.5 left-2 h-4 w-4" />
        <Input
          ref={ref}
          placeholder="Search"
          className="pl-8"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          onFocus={() => setIsSearching(true)}
          onBlur={handleBlur}
        />
        <div className="absolute top-2.5 right-2 flex items-center gap-2">
          {isFetching && (
            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
          )}
          <button
            className="rounded-sm hover:bg-gray-800"
            onClick={() => {
              setSearchValue("");
              setIsSearching(false);
              ref.current?.blur();
            }}
          >
            <X className="size-4 text-gray-400" />
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export { SearchBar };
