"use client";

import { DetailPageShell } from "@/components/DetailPageShell";
import { useLocale } from "@/components/LocaleProvider";
import { pageMessages, profile, profileDetail } from "@/data/portfolio";
import { assetPath } from "@/lib/assetPath";

function DetailRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="border-b-[3px] border-line py-5">
      <p className="mb-3 text-sm uppercase tracking-[0.18em] text-rose">{label}</p>
      <div className="whitespace-pre-line text-xl leading-relaxed max-md:text-base">{children}</div>
    </div>
  );
}

export default function AboutPage() {
  const { locale } = useLocale();
  const isJa = locale === "ja";
  const aboutText = isJa
    ? "ソフトウェア、ハードウェア、デザインを通して、\nかわいいものを作るのが好きです。"
    : profileDetail.about;
  const roleText = isJa ? "学生クリエイター" : profile.role;
  const currentQuestText = isJa ? "ものづくりを通して、\n誰かを笑顔にすること。" : profileDetail.currentQuest;
  const favorites = isJa ? ["🍊 オレンジ", "🎮 ゲーム", "☕ 紅茶", "🐈 猫"] : profileDetail.favorites;
  const dreamText = isJa ? "「かわいい」を世界に広めたいです。" : profile.dream;
  const focusItems = isJa ? ["ソフトウェア", "ハードウェア", "デザイン", "ドット絵"] : profile.focus;
  const timelineText = isJa ? "sorano portfolio を公開しました。" : profileDetail.timeline[0].text;

  return (
    <DetailPageShell
      isJa={isJa}
      decoration={
        <>
          <img
            alt=""
            aria-hidden
            className="theme-light-decoration h-[62px] w-[62px] [image-rendering:pixelated]"
            src={assetPath("/decorations/ribbon_brown_line_01.png")}
          />
          <img
            alt=""
            aria-hidden
            className="theme-dark-decoration h-[62px] w-[62px] [image-rendering:pixelated]"
            src={assetPath("/decorations/ribbon_pink_01.png")}
          />
        </>
      }
      message={isJa ? "プロフィールページへようこそ。" : pageMessages.about}
      title={isJa ? "キャラクタープロフィール" : "CHARACTER PROFILE"}
    >
      <div className="grid grid-cols-[280px_1fr] gap-10 max-md:grid-cols-1">
        <div className="grid place-items-center">
          <img
            alt="sorano pixel character"
            className="h-[260px] w-[260px] object-contain [image-rendering:pixelated] max-md:h-[180px] max-md:w-[180px]"
            src={assetPath("/character/1.png")}
          />
        </div>
        <div>
          <DetailRow label={isJa ? "名前" : "Name"}>{profile.name}</DetailRow>
          <DetailRow label={isJa ? "役割" : "Role"}>{roleText}</DetailRow>
          <DetailRow label={isJa ? "自己紹介" : "About"}>{aboutText}</DetailRow>
          <DetailRow label={isJa ? "夢" : "Dream"}>{dreamText}</DetailRow>
          <DetailRow label={isJa ? "得意分野" : "Focus"}>
            <div className="flex flex-wrap gap-3">
              {focusItems.map((item) => (
                <span className="border-2 border-line bg-soft px-3 py-2 text-base" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </DetailRow>
          <DetailRow label={isJa ? "現在のクエスト" : "Current Quest"}>{currentQuestText}</DetailRow>
          <DetailRow label={isJa ? "お気に入り" : "Favorite"}>
            <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
              {favorites.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </DetailRow>
          <DetailRow label={isJa ? "ツール" : "Tools"}>
            <div className="flex flex-wrap gap-3">
              {profileDetail.tools.map((tool) => (
                <span className="border-2 border-blush bg-surface px-3 py-2 text-base" key={tool}>
                  {tool}
                </span>
              ))}
            </div>
          </DetailRow>
          <DetailRow label={isJa ? "タイムライン" : "Timeline"}>
            {profileDetail.timeline.map((item) => (
              <p key={item.year}>
                {item.year} / {isJa ? timelineText : item.text}
              </p>
            ))}
          </DetailRow>
        </div>
      </div>
    </DetailPageShell>
  );
}
