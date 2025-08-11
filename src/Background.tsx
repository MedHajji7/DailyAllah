export default function Background({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="relative min-h-screen w-full overflow-x-clip text-slate-100">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0b0e12] via-[#0b0e12] to-[#0f172a]" />
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: "radial-gradient(white 0.6px, transparent 0.6px)",
          backgroundSize: "2px 2px",
        }}
      />

      {/* <div className="pointer-events-none absolute -top-40 -left-40 h-96 w-96 rounded-full blur-3xl opacity-10 bg-white" />
      <div className="pointer-events-none absolute -bottom-40 -right-40 h-96 w-96 rounded-full blur-3xl opacity-10 bg-white" /> */}

      {/* Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
