"use client";

import { DetailPageShell } from "@/components/DetailPageShell";
import { useLocale } from "@/components/LocaleProvider";
import { contacts, pageMessages } from "@/data/portfolio";
import { assetPath } from "@/lib/assetPath";

export default function ContactPage() {
  const { locale } = useLocale();
  const isJa = locale === "ja";

  return (
    <DetailPageShell
      isJa={isJa}
      decoration={
        <>
          <img
            alt=""
            aria-hidden
            className="theme-light-decoration h-[56px] w-[56px] [image-rendering:pixelated]"
            src={assetPath("/decorations/ribbon_brown_line_02.png")}
          />
          <img
            alt=""
            aria-hidden
            className="theme-dark-decoration h-[56px] w-[56px] [image-rendering:pixelated]"
            src={assetPath("/decorations/mark_heart_pink_02.png")}
          />
        </>
      }
      message={isJa ? "つながりましょう。" : pageMessages.contact}
      title={isJa ? "連絡先" : "CONTACT"}
    >
      <div className="mx-auto max-w-xl text-center">
        <p className="mb-8 text-3xl max-md:text-2xl">{isJa ? "つながりましょう！" : "Let's connect!"}</p>
        <div className="grid gap-4">
          {contacts.map((contact) => {
            const href = contact.label === "Mail" && contact.href ? `mailto:${contact.href}` : contact.href;
            return contact.enabled && href ? (
              <a className="pixel-button block px-8 py-5 text-2xl max-md:text-lg" href={href} key={contact.label} rel="noopener noreferrer" target="_blank">
                {contact.label}
              </a>
            ) : (
              <button className="pixel-button px-8 py-5 text-2xl max-md:text-lg" disabled key={contact.label} type="button">
                {contact.label}
              </button>
            );
          })}
        </div>
        <div className="mt-10 border-t-[3px] border-line pt-8">
          <p className="mb-3 text-sm uppercase tracking-[0.18em] text-rose">{isJa ? "対応状況" : "Availability"}</p>
          <p className="mb-8 text-xl">{isJa ? "お仕事のご相談を受け付けています。" : "Open for collaboration."}</p>
          <p className="text-2xl max-md:text-xl">{isJa ? "ご覧いただきありがとうございます。" : "Thank you for visiting!"}</p>
        </div>
      </div>
    </DetailPageShell>
  );
}
