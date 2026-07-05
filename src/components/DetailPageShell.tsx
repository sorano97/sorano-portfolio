import { PageNav } from "./PageNav";
import { GlobalControls } from "./GlobalControls";
import { TransitionLink } from "./TransitionLink";
import { assetPath } from "@/lib/assetPath";

export function DetailPageShell({
  title,
  message,
  isJa,
  decoration,
  children
}: {
  title: string;
  message: string;
  isJa: boolean;
  decoration?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-screen bg-soft px-12 pb-16 pt-28 font-best text-ink max-md:px-4 max-md:pt-24">
      <GlobalControls />
      <PageNav />
      <div className="mx-auto max-w-5xl">
        <div className="mb-8 grid grid-cols-[160px_1fr] items-end gap-5 max-md:grid-cols-[86px_1fr]">
          <img alt="" className="h-[150px] w-[150px] object-contain [image-rendering:pixelated] max-md:h-[82px] max-md:w-[82px]" src={assetPath("/character/1.png")} />
          <div className="pixel-panel relative px-6 py-5 text-xl max-md:px-4 max-md:py-3 max-md:text-sm">
            {decoration ? <div className="pointer-events-none absolute -right-4 -top-4 z-0 max-md:-right-3 max-md:-top-3">{decoration}</div> : null}
            <div className="relative z-10">{message}</div>
          </div>
        </div>
        <section className="pixel-panel relative px-10 py-9 max-md:px-5 max-md:py-6">
          <h1 className="mb-8 border-b-[3px] border-line pb-5 text-center text-4xl max-md:text-2xl">{title}</h1>
          {decoration ? <div className="pointer-events-none absolute right-6 top-6 max-md:right-4 max-md:top-4">{decoration}</div> : null}
          {children}
          <div className="mt-10 text-center">
            <TransitionLink className="pixel-button inline-block px-8 py-4 text-xl max-md:text-base" href="/">
              {isJa ? "トップへ戻る" : "BACK TO TOP"}
            </TransitionLink>
          </div>
        </section>
      </div>
    </main>
  );
}
