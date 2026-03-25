import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-surface-container-lowest w-full border-t border-outline-variant/20 mt-20">
      <div className="w-full max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-16 flex flex-col items-center gap-6 md:gap-8 font-[family-name:var(--font-inter)] text-[10px] tracking-normal leading-relaxed">
        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 border-b border-outline-variant/10 pb-8 md:pb-12">
          <Link href="/" className="text-2xl font-bold tracking-tighter text-primary font-[family-name:var(--font-plus-jakarta)]">
            DESTANE
          </Link>
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 uppercase tracking-widest font-bold text-on-surface-variant">
            <a className="text-[#f5f5f5]/30 hover:text-primary transition-opacity" href="#">Investment Disclosures</a>
            <a className="text-[#f5f5f5]/30 hover:text-primary transition-opacity" href="#">Privacy Protocol</a>
            <a className="text-[#f5f5f5]/30 hover:text-primary transition-opacity" href="#">Terms of Equity</a>
            <a className="text-[#f5f5f5]/30 hover:text-primary transition-opacity" href="#">Contact Studio</a>
          </div>
        </div>
        <p className="text-[#f5f5f5]/30 text-center">
          © 2024 DESTANE. Regulated cinematic securities platform. All investments carry risk.
        </p>
      </div>
    </footer>
  );
}
