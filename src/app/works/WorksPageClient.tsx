"use client";

import { useMemo, useState } from "react";
import { useLocale } from "@/components/LocaleProvider";
import { works, type WorkCategory } from "@/data/portfolio";
import { assetPath } from "@/lib/assetPath";

const filters = ["ALL", "Art & Design", "Software & Hardware"] as const;

export function WorksPageClient() {
  const { locale } = useLocale();
  const isJa = locale === "ja";
  const [filter, setFilter] = useState<(typeof filters)[number]>("ALL");
  const visibleWorks = useMemo(
    () => (filter === "ALL" ? works : works.filter((work) => work.category === filter)),
    [filter]
  );

  return (
    <>
      <div className="mb-6 grid place-items-center">
        <div className="pixel-panel relative h-[64px] w-[64px] overflow-hidden">
          <img
            alt=""
            aria-hidden
            className="theme-light-decoration h-full w-full object-contain [image-rendering:pixelated]"
            src={assetPath("/decorations/kirakira_02_brown.png")}
          />
          <img
            alt=""
            aria-hidden
            className="theme-dark-decoration h-full w-full object-contain [image-rendering:pixelated]"
            src={assetPath("/decorations/mark_heart_pink_03.png")}
          />
        </div>
      </div>
      <div className="mb-8 flex flex-wrap justify-center gap-3">
        {filters.map((item) => (
          <button
            className={`pixel-button px-5 py-3 text-base max-md:px-3 max-md:text-xs ${filter === item ? "bg-blush" : ""}`}
            key={item}
            onClick={() => setFilter(item)}
            type="button"
          >
            {item === "ALL" ? (isJa ? "すべて" : "ALL") : isJa ? (item === "Art & Design" ? "アート・デザイン" : "ソフトウェア・ハードウェア") : item.toUpperCase()}
          </button>
        ))}
      </div>
      <div className="grid gap-8">
        {(["Art & Design", "Software & Hardware"] as WorkCategory[]).map((category) => {
          const categoryWorks = visibleWorks.filter((work) => work.category === category);
          if (categoryWorks.length === 0) return null;

          return (
            <section key={category}>
              <h2 className="mb-4 text-2xl max-md:text-xl">
                {isJa && category === "Art & Design" ? "アート・デザイン" : isJa && category === "Software & Hardware" ? "ソフトウェア・ハードウェア" : category}
              </h2>
              <div className="grid grid-cols-2 gap-5 max-md:grid-cols-1">
                {categoryWorks.map((work) => {
                  const content = (
                    <>
                      <div className="mb-5 flex aspect-square items-center justify-center border-[3px] border-line bg-soft text-sm">
                        {work.thumbnail ? (
                          <img alt="" className="h-full w-full object-cover [image-rendering:pixelated]" src={work.thumbnail} />
                        ) : (
                          "NO IMAGE"
                        )}
                      </div>
                      <p className="mb-3 text-xl">{work.title}</p>
                      <p className="mb-4 text-sm leading-relaxed">{work.description}</p>
                      <div className="flex flex-wrap gap-2">
                        {work.tags.map((tag) => (
                          <span className="border-2 border-blush bg-surface px-2 py-1 text-xs" key={tag}>
                            {tag}
                          </span>
                        ))}
                      </div>
                    </>
                  );

                  return work.url ? (
                    <a
                      className="pixel-panel block px-5 py-5 transition duration-150 hover:-translate-y-1 hover:shadow-lift"
                      href={work.url}
                      key={work.id}
                      rel="noopener noreferrer"
                      target="_blank"
                    >
                      {content}
                    </a>
                  ) : (
                    <article className="pixel-panel px-5 py-5" key={work.id}>
                      {content}
                    </article>
                  );
                })}
              </div>
            </section>
          );
        })}
      </div>
    </>
  );
}
