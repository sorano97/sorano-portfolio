import { DetailPageShell } from "@/components/DetailPageShell";
import { contacts, pageMessages } from "@/data/portfolio";

export default function ContactPage() {
  return (
    <DetailPageShell message={pageMessages.contact} title="CONTACT">
      <div className="mx-auto max-w-xl text-center">
        <p className="mb-8 text-3xl max-md:text-2xl">Let's connect!</p>
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
          <p className="mb-3 text-sm uppercase tracking-[0.18em] text-rose">Availability</p>
          <p className="mb-8 text-xl">Open for collaboration.</p>
          <p className="text-2xl max-md:text-xl">Thank you for visiting!</p>
        </div>
      </div>
    </DetailPageShell>
  );
}
