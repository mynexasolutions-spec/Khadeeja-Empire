import type { Metadata } from "next";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/layout/ContactForm";
import { siteConfig } from "@/content/site";
import { MapPin, Phone, Mail, Instagram, ExternalLink, Clock } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with Khadeeja Empire or visit our store in Varanasi.",
};

const locationQuery = encodeURIComponent(
  "B16/35 Pandey Haveli, Varanasi, Uttar Pradesh 221001"
);

export default function ContactPage() {
  return (
    <div className="py-10 md:py-16">
      <Container className="max-w-[1460px]">
        {/* Header */}
        <div className="max-w-2xl mb-10 md:mb-14">
          <span className="text-xs uppercase tracking-[0.2em] font-semibold text-primary mb-2 block">
            Get In Touch
          </span>
          <h1 className="text-h1 text-ink mb-4 font-serif">Contact Khadeeja Empire</h1>
          <p className="text-muted text-base md:text-lg">
            Have a question about a product, an order, or custom sizing? We would love to hear from you.
          </p>
        </div>

        {/* Top Grid: Form + Address Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 mb-16 md:mb-20 items-start">
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-surface p-6 sm:p-8 rounded-2xl border border-border/80 shadow-sm">
            <h2 className="text-xl font-serif font-semibold text-ink mb-6 pb-5">Send Us a Message</h2>
            <ContactForm />
          </div>

          {/* Right: Store Details Card */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <div className="bg-surface/80 p-6 sm:p-8 rounded-2xl border border-border/80 shadow-sm space-y-6">
              <h2 className="text-xl font-serif font-semibold text-ink border-b border-border/60 pb-4">
                Store &amp; Contact Info
              </h2>

              <div className="flex items-start gap-3.5 text-sm text-ink mt-4">
                <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-ink">Store Address</h3>
                  <address className="not-italic text-muted mt-1 leading-relaxed">
                    B16/35 Pandey Haveli, Varanasi<br />
                    Uttar Pradesh, 221001<br />
                    <span className="text-xs text-primary font-medium">Landmark: Kohinoor Guest House</span>
                  </address>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-sm text-ink">
                <Phone className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-ink">Phone Support</h3>
                  <a href={`tel:${siteConfig.phone}`} className="text-muted hover:text-primary transition-colors block mt-0.5">
                    {siteConfig.phone}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-sm text-ink">
                <Mail className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-ink">Email Us</h3>
                  <a href={`mailto:${siteConfig.email}`} className="text-muted hover:text-primary transition-colors block mt-0.5">
                    {siteConfig.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3.5 text-sm text-ink">
                <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-ink">Working Hours</h3>
                  <p className="text-muted mt-0.5">Mon – Sat: 10:00 AM – 8:00 PM IST</p>
                </div>
              </div>

              {siteConfig.instagram && (
                <div className="pt-2 border-t border-border/60">
                  <a
                    href={siteConfig.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline mt-3.5"
                  >
                    <Instagram size={18} />
                    Follow us @khadeeja_empireofficial
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section: Map Embed */}
        <section className="bg-surface p-6 sm:p-8 rounded-2xl border border-border/80 shadow-sm" aria-labelledby="contact-map-title">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
            <div>
              <span className="text-xs uppercase tracking-[0.18em] font-bold text-primary mb-1 block">
                Find Our Location
              </span>
              <h2 id="contact-map-title" className="text-2xl font-serif font-semibold text-ink">
                Visit Us in Varanasi
              </h2>
              <p className="text-muted text-sm mt-1">
                B16/35 Pandey Haveli, Varanasi, Uttar Pradesh 221001
              </p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${locationQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-border bg-surface text-ink text-sm font-semibold hover:bg-primary hover:text-white hover:border-primary transition-all shadow-sm shrink-0"
            >
              <span className="group-hover:text-white transition-colors">Open in Google Maps</span>
              <ExternalLink size={15} className="group-hover:text-white transition-colors" />
            </a>
          </div>

          <div className="w-full aspect-[4/3] sm:aspect-[16/9] md:aspect-[21/9] rounded-xl overflow-hidden border border-border/80 shadow-inner bg-bg">
            <iframe
              title="Khadeeja Empire location map"
              src={`https://www.google.com/maps?q=${locationQuery}&output=embed`}
              className="w-full h-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>
      </Container>
    </div>
  );
}
