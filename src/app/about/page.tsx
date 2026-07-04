import { DetailPageShell } from "@/components/DetailPageShell";
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
  return (
    <DetailPageShell message={pageMessages.about} title="CHARACTER PROFILE">
      <div className="grid grid-cols-[280px_1fr] gap-10 max-md:grid-cols-1">
        <div className="grid place-items-center">
          <img
            alt="sorano pixel character"
            className="h-[260px] w-[260px] object-contain [image-rendering:pixelated] max-md:h-[180px] max-md:w-[180px]"
            src={assetPath("/character/1.png")}
          />
        </div>
        <div>
          <DetailRow label="Name">{profile.name}</DetailRow>
          <DetailRow label="Role">{profile.role}</DetailRow>
          <DetailRow label="About">{profileDetail.about}</DetailRow>
          <DetailRow label="Dream">{profile.dream}</DetailRow>
          <DetailRow label="Focus">
            <div className="flex flex-wrap gap-3">
              {profile.focus.map((item) => (
                <span className="border-2 border-line bg-soft px-3 py-2 text-base" key={item}>
                  {item}
                </span>
              ))}
            </div>
          </DetailRow>
          <DetailRow label="Current Quest">{profileDetail.currentQuest}</DetailRow>
          <DetailRow label="Favorite">
            <div className="grid grid-cols-2 gap-3 max-md:grid-cols-1">
              {profileDetail.favorites.map((item) => (
                <span key={item}>{item}</span>
              ))}
            </div>
          </DetailRow>
          <DetailRow label="Tools">
            <div className="flex flex-wrap gap-3">
              {profileDetail.tools.map((tool) => (
                <span className="border-2 border-blush bg-surface px-3 py-2 text-base" key={tool}>
                  {tool}
                </span>
              ))}
            </div>
          </DetailRow>
          <DetailRow label="Timeline">
            {profileDetail.timeline.map((item) => (
              <p key={item.year}>
                {item.year} / {item.text}
              </p>
            ))}
          </DetailRow>
        </div>
      </div>
    </DetailPageShell>
  );
}
