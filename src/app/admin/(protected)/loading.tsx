export default function AdminLoading() {
  return (
    <div className="flex min-h-64 items-center justify-center" role="status" aria-label="Loading admin page">
      <span className="h-8 w-8 animate-spin rounded-full border-2 border-stone-300 border-t-[#9c5247]" />
    </div>
  );
}
