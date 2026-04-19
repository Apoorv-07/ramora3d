export default function Footer() {
  return (
    <footer id="contact" className="bg-[#050505] border-t border-white/6 py-20 px-8">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-16 mb-16">
          <div>
            <div className="text-white font-bold text-xl mb-4">
              Ramora<span className="text-gold">Realty</span>
            </div>
            <p className="text-white/30 text-sm leading-relaxed max-w-xs">
              Integrated real estate development, planning, and execution solutions. From township layouts to turnkey delivery.
            </p>
          </div>
          <div>
            <div className="text-white/50 text-xs tracking-[0.3em] uppercase mb-6">Services</div>
            <ul className="space-y-3">
              {['Township Development', 'Plot Advisory', 'Construction Packages', 'Interior Design', 'Group Housing'].map((s) => (
                <li key={s} className="text-white/30 text-sm hover:text-white/60 cursor-pointer transition-colors">{s}</li>
              ))}
            </ul>
          </div>
          <div>
            <div className="text-white/50 text-xs tracking-[0.3em] uppercase mb-6">Contact</div>
            <div className="space-y-3 text-white/30 text-sm">
              <div>info@ramorarealty.com</div>
              <div>+91 00000 00000</div>
              <div className="leading-relaxed">India</div>
            </div>
            <a
              href="#"
              className="inline-block mt-8 px-6 py-3 border border-gold/50 text-gold text-xs tracking-[0.2em] uppercase hover:bg-gold hover:text-black transition-all duration-300"
            >
              Book Consultation
            </a>
          </div>
        </div>
        <div className="border-t border-white/6 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-white/20 text-xs">© 2024 Ramora Realty. All rights reserved.</div>
          <div className="text-white/20 text-xs tracking-wide">Develop · Invest · Deliver</div>
        </div>
      </div>
    </footer>
  )
}
