"use client";

import { useState } from "react";
import { ExternalLink, LoaderCircle, LogOut, Menu, User } from "lucide-react";

interface AdminHeaderProps {
  email: string;
  menuOpen: boolean;
  onMenuOpen: () => void;
}

export function AdminHeader({ email, menuOpen, onMenuOpen }: AdminHeaderProps) {
  const [loggingOut, setLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState<string | null>(null);

  async function logout() {
    setLoggingOut(true);
    setLogoutError(null);
    try {
      const response = await fetch("/api/admin/logout", {
        method: "POST",
        credentials: "same-origin",
      });
      if (response.status === 401) {
        window.location.assign("/admin/login");
        return;
      }
      if (!response.ok) throw new Error("Could not sign out.");
      window.location.assign("/admin/login");
    } catch (error) {
      setLogoutError(error instanceof Error ? error.message : "Could not sign out.");
      setLoggingOut(false);
    }
  }

  return (
    <header className="admin-header">
      <div className="admin-header-leading">
        <button
          type="button"
          className="admin-menu-button"
          onClick={onMenuOpen}
          aria-label="Open admin navigation"
          aria-controls="admin-navigation"
          aria-expanded={menuOpen}
        >
          <Menu aria-hidden="true" />
        </button>
        <h2>Admin Dashboard</h2>
        <a className="admin-view-site" href="/" target="_blank" rel="noreferrer">
          <ExternalLink aria-hidden="true" />
          <span>View Site</span>
        </a>
      </div>

      <div className="admin-header-actions">
        <div className="admin-account">
          <span className="admin-account-avatar"><User aria-hidden="true" /></span>
          <span className="admin-account-copy">
            <strong>{email}</strong>
            <small>Administrator</small>
          </span>
        </div>
        <button
          type="button"
          className="admin-logout-button"
          onClick={logout}
          disabled={loggingOut}
          aria-busy={loggingOut}
        >
          {loggingOut ? <LoaderCircle className="admin-spin" aria-hidden="true" /> : <LogOut aria-hidden="true" />}
          <span>{loggingOut ? "Signing out" : "Logout"}</span>
        </button>
      </div>
      {logoutError ? <p className="admin-header-error" role="alert">{logoutError}</p> : null}
    </header>
  );
}

export default AdminHeader;
