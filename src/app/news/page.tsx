import { DetailPageShell } from "@/components/DetailPageShell";
import { news, pageMessages } from "@/data/portfolio";

export default function NewsPage() {
  const sortedNews = [...news].sort((a, b) => b.date.localeCompare(a.date));

  return (
    <DetailPageShell message={pageMessages.news} title="NEWS LOG">
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
