import { Clock3, Phone } from 'lucide-react'

export default function TopBar() {
  return <div className="bg-[#07162f] px-4 py-2 text-xs text-slate-300"><div className="mx-auto flex max-w-[1380px] flex-col items-center justify-between gap-2 sm:flex-row"><p className="flex items-center gap-2"><Clock3 size={14} className="text-cyan-300" />Professional drivers for every journey · 24/7 booking support</p><a className="inline-flex items-center gap-2 font-bold text-blue-200 transition hover:text-white" href="tel:+919876543210"><Phone size={13} />+91 98765 43210</a></div></div>
}
