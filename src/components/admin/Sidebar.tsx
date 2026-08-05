"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { adminNavSections, isAdminNavItemActive } from "./AdminNav";

interface AdminSidebarProps {
  collapsed: boolean;
  mobileOpen: boolean;
  onCollapse: () => void;
  onMobileClose: () => void;
}

export function AdminSidebar({
  collapsed,
  mobileOpen,
  onCollapse,
  onMobileClose,
}: AdminSidebarProps) {
  const pathname = usePathname();

  return (
    <>
      <button
        type="button"
        className={`admin-sidebar-backdrop${mobileOpen ? " is-open" : ""}`}
        onClick={onMobileClose}
        aria-label="Close admin navigation"
        tabIndex={mobileOpen ? 0 : -1}
      />
      <aside
        id="admin-navigation"
        className={`admin-sidebar${collapsed ? " is-collapsed" : ""}${
          mobileOpen ? " is-mobile-open" : ""
        }`}
        aria-label="Admin navigation"
      >
        <div className="admin-sidebar-brand">
          <div className="admin-brand-mark" aria-hidden="true">K</div>
          <div className="admin-brand-copy">
            <strong>Khadeeja Empire</strong>
            <span>Admin Panel</span>
          </div>
          <button
            type="button"
            className="admin-mobile-close"
            onClick={onMobileClose}
            aria-label="Close admin navigation"
          >
            <X aria-hidden="true" />
          </button>
        </div>

        <nav className="admin-sidebar-nav">
          {adminNavSections.map((section) => (
            <div className="admin-nav-section" key={section.label}>
              <p className="admin-nav-label">{section.label}</p>
              <div className="admin-nav-list">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isAdminNavItemActive(pathname, item);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      title={collapsed ? item.label : undefined}
                      className={`admin-nav-link${active ? " is-active" : ""}`}
                      aria-current={active ? "page" : undefined}
                      onClick={onMobileClose}
                    >
                      <Icon aria-hidden="true" />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="admin-sidebar-footer">
          <button
            type="button"
            className="admin-collapse-button"
            onClick={onCollapse}
            aria-label={collapsed ? "Expand admin sidebar" : "Collapse admin sidebar"}
          >
            {collapsed ? <ChevronRight aria-hidden="true" /> : <ChevronLeft aria-hidden="true" />}
            <span>Collapse</span>
          </button>
        </div>
      </aside>
    </>
  );
}

export default AdminSidebar;
