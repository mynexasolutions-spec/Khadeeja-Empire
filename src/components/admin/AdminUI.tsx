import type { ButtonHTMLAttributes, HTMLAttributes, ReactNode, TableHTMLAttributes } from "react";
import Link from "next/link";
import { AlertCircle, Inbox, LoaderCircle } from "lucide-react";

function classes(...values: Array<string | false | null | undefined>) {
  return values.filter(Boolean).join(" ");
}

export function AdminPageHeader({
  title,
  description,
  actions,
}: {
  title: string;
  description?: string;
  actions?: ReactNode;
}) {
  return (
    <div className="admin-page-header">
      <div>
        <h1>{title}</h1>
        {description ? <p>{description}</p> : null}
      </div>
      {actions ? <div className="admin-page-actions">{actions}</div> : null}
    </div>
  );
}

export function AdminCard({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={classes("admin-card", className)} {...props} />;
}

export function AdminCardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={classes("admin-card-header", className)} {...props} />;
}

export function AdminCardBody({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={classes("admin-card-body", className)} {...props} />;
}

export function AdminTable({ className, ...props }: TableHTMLAttributes<HTMLTableElement>) {
  return (
    <div className="admin-table-scroll">
      <table className={classes("admin-table", className)} {...props} />
    </div>
  );
}

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info" | "accent";

export function AdminStatusBadge({ children, tone = "neutral" }: { children: ReactNode; tone?: BadgeTone }) {
  return <span className={`admin-status-badge is-${tone}`}>{children}</span>;
}

export function AdminEmptyState({
  title,
  description,
  action,
  icon,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="admin-empty-state">
      <span className="admin-state-icon">{icon ?? <Inbox aria-hidden="true" />}</span>
      <strong>{title}</strong>
      {description ? <p>{description}</p> : null}
      {action ? <div className="admin-state-action">{action}</div> : null}
    </div>
  );
}

export function AdminErrorState({ title = "Something went wrong", message }: { title?: string; message: string }) {
  return (
    <div className="admin-error-state" role="alert">
      <AlertCircle aria-hidden="true" />
      <div><strong>{title}</strong><p>{message}</p></div>
    </div>
  );
}

export function AdminSpinner({ label = "Loading" }: { label?: string }) {
  return <span className="admin-spinner" role="status"><LoaderCircle aria-hidden="true" /> <span>{label}</span></span>;
}

type AdminButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  tone?: "primary" | "secondary" | "danger" | "ghost";
};

export function AdminButton({ className, tone = "primary", ...props }: AdminButtonProps) {
  return <button className={classes("admin-button", `is-${tone}`, className)} {...props} />;
}

export function AdminLinkButton({
  href,
  children,
  tone = "primary",
  className,
}: {
  href: string;
  children: ReactNode;
  tone?: "primary" | "secondary" | "danger" | "ghost";
  className?: string;
}) {
  return <Link href={href} className={classes("admin-button", `is-${tone}`, className)}>{children}</Link>;
}

export function AdminField({
  label,
  htmlFor,
  hint,
  error,
  required,
  children,
}: {
  label: string;
  htmlFor: string;
  hint?: string;
  error?: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <div className="admin-field">
      <label htmlFor={htmlFor}>{label}{required ? <span aria-hidden="true"> *</span> : null}</label>
      {children}
      {error ? <p className="admin-field-error" id={`${htmlFor}-error`} role="alert">{error}</p> : hint ? <p className="admin-field-hint">{hint}</p> : null}
    </div>
  );
}

export function AdminConfirmPanel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return <div className="admin-confirm-panel" role="group" aria-label={title}><AlertCircle aria-hidden="true" /><div><strong>{title}</strong><p>{description}</p><div className="admin-confirm-actions">{children}</div></div></div>;
}
