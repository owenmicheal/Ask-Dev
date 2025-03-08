"use client";

import React, { useEffect, useState } from "react";
import { Input } from "../ui/input";
import Image from "next/image";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { formUrlQuery, removeKeysFromUrlQuery } from "@/lib/url";

interface props {
  route: string;
  imgSrc: string;
  placeholder: string;
  otherClasses?: string;
}

const LocalSearch = ({ route, imgSrc, placeholder, otherClasses }: props) => {
  const pathname = usePathname();
  const router = useRouter();
  const searchparams = useSearchParams();
  const query = searchparams.get("query") || "";

  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    const delayDebouceFn = setTimeout(() => {
      if (searchQuery) {
        const newUrl = formUrlQuery({
          params: searchparams.toString(),
          key: "query",
          value: searchQuery,
        });

        router.push(newUrl, { scroll: false });
      } else {
        if (pathname === route) {
          const newUrl = removeKeysFromUrlQuery({
            params: searchparams.toString(),
            keysToRemove: ["query"],
          });

          router.push(newUrl, { scroll: false });
        }
      }
    }, 500);

    return () => clearTimeout(delayDebouceFn);
  }, [searchQuery, router, route, searchparams]);

  return (
    <div
      className={`background-light800_darkgradient flex min-h-[56px] grow items-center
    gap-4 rounded-[10px] px-4 ${otherClasses}`}
    >
      <Image
        src={imgSrc}
        alt="search icon"
        width={24}
        height={24}
        className="cursor-pointer"
      />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="paragraph_regular no-focus placeholder text-dark400_light700 border-none
        shadow-none outline-none "
      />
    </div>
  );
};

export default LocalSearch;
