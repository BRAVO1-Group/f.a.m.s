export default function LandingPage() {
  return (
    <div className="relative h-screen w-screen overflow-hidden bg-[#0b2f20]">
      {/* ── FAMS Interactive Hero (Scene 1 Poster + Scene 2 3D Workspace Tour) ── */}
      <iframe
        src="/index.html"
        className="block h-full w-full select-none border-0"
        title="FAMS — Field Attachment Management System"
        loading="eager"
      />
    </div>
  );
}
