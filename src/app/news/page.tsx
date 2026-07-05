"use client";

import { DetailPageShell } from "@/components/DetailPageShell";
import { useLocale } from "@/components/LocaleProvider";
import { news, pageMessages } from "@/data/portfolio";
import { assetPath } from "@/lib/assetPath";

export default function NewsPage() {
  const { locale } = useLocale();
  const isJa = locale === "ja";
  const sortedNews = [...news].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <DetailPageShell
      isJa={isJa}
      decoration={
        <>
          <img
            alt=""
            aria-hidden
            className="theme-light-decoration h-[58px] w-[58px] [image-rendering:pixelated]"
            src={assetPath("/decorations/kirakira_01_brown.png")}
          />
          <img
            alt=""
            aria-hidden
            className="theme-dark-decoration h-[58px] w-[58px] [image-rendering:pixelated]"
            src={assetPath("/decorations/mark_heart_pink_03.png")}
          />
        </>
      }
      message={isJa ? "新着情報はこちら。" : pageMessages.news}
      title={isJa ? "ニュース一覧" : "NEWS LOG"}
    >
      <div className="grid gap-5">
        {sortedNews.map((item) => {
          const content = (
            <>
              <p className="mb-3 text-sm text-rose">{item.date}</p>
              <p className="mb-3 text-2xl max-md:text-lg">{item.title}</p>
              <p className="leading-relaxed max-md:text-sm">{item.body}</p>
            </>
          );

          return item.url ? (
            <a
              className="pixel-panel block px-6 py-5 transition hover:-translate-y-1 hover:shadow-lift"
              href={item.url}
              key={item.id}
              rel="noopener noreferrer"
              target="_blank"
            >
              {content}
            </a>
          ) : (
            <article className="pixel-panel px-6 py-5" key={item.id}>
              {content}
            </article>
          );
        })}
      </div>
    </DetailPageShell>
  );
}
