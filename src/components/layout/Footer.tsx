import Link from "next/link";
import { Instagram, Mail, MapPin } from "lucide-react";
import { siteConfig } from "@/content/site";
import { NewsletterForm } from "./NewsletterForm";
import { BrandLogo } from "./BrandLogo";

const locationQuery = encodeURIComponent(
  "B16/35 Pandey Haveli, Varanasi, Uttar Pradesh 221001"
);

export function Footer() {
  return (
    <footer className="site-footer" id="contact">
      <div className="footer-wrap">
        <div className="footer-grid">
          <div>
            <Link
              href="/"
              className="logo logo-image footer-logo"
              aria-label={`${siteConfig.name} home`}
            >
              <BrandLogo variant="footer" />
            </Link>
            <p className="footer-copy">
              {siteConfig.tagline}. Rooted in Indian craft, designed for the way
              women dress now.
            </p>
            <div className="footer-contact-list">
              <div className="footer-contact-item">
                <MapPin size={16} aria-hidden="true" />
                <address>
                  B16/35 Pandey Haveli, Varanasi
                  <br />
                  Uttar Pradesh, 221001
                  <br />
                  <span>Landmark: Kohinoor Guest House</span>
                </address>
              </div>
              <a
                href={siteConfig.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
              >
                <Instagram size={18} aria-hidden="true" />
                Follow us on Instagram
              </a>
            </div>
          </div>

          <div className="footer-sub">
            <div>
              <h5>Shop</h5>
              <ul>
                <li>
                  <Link href="/shop">All Products</Link>
                </li>
                <li>
                  <Link href="/collections/short-kurtis">Short Kurtis</Link>
                </li>
                <li>
                  <Link href="/collections/coord-sets">Co-ord Sets</Link>
                </li>
                <li>
                  <Link href="/collections/everyday-tops">Everyday Tops</Link>
                </li>
                <li>
                  <Link href="/collections/dresses">Dresses</Link>
                </li>
                <li>
                  <Link href="/collections/new-arrivals">New Arrivals</Link>
                </li>
              </ul>
            </div>
            <div>
              <h5>Information</h5>
              <ul>
                <li>
                  <Link href="/about">Our Story</Link>
                </li>
                <li>
                  <Link href="/contact">Contact</Link>
                </li>
                <li>
                  <Link href="/shipping-returns">Shipping &amp; Returns</Link>
                </li>
                <li>
                  <Link href="/search">Search</Link>
                </li>
              </ul>
              <a
                href={`mailto:${siteConfig.email}`}
                className="footer-email-link"
              >
                <Mail size={14} aria-hidden="true" />
                {siteConfig.email}
              </a>
            </div>
          </div>

          <div>
            <h5>Stay Updated</h5>
            <p className="footer-copy footer-newsletter-copy">
              New collections and stories, once a month.
            </p>
            <NewsletterForm />
          </div>
        </div>

        <section className="footer-map" aria-labelledby="footer-map-title">
          <div className="footer-map-header">
            <div>
              <h5 id="footer-map-title">Find Us</h5>
              <p>Visit Khadeeja Empire in Varanasi.</p>
            </div>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${locationQuery}`}
              target="_blank"
              rel="noopener noreferrer"
              className="footer-map-link"
            >
              Open in Maps <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="footer-map-frame">
            <iframe
              title="Khadeeja Empire location map"
              src={`https://www.google.com/maps?q=${locationQuery}&output=embed`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </section>

        <div className="footer-bottom">
          <span>
            &copy; {new Date().getFullYear()} {siteConfig.name}. All rights
            reserved.
          </span>
          <span>Frontend prototype. Prices are demo and subject to change.</span>
        </div>
      </div>
    </footer>
  );
}
