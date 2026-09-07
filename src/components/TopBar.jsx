import useCurrentLocation from './useCurrentLocation'

export default function TopBar() {
  const { label, loading, error, fetchLocation } = useCurrentLocation()
  const message = error || (loading ? 'Fetching current location…' : label)

  return <div className="bg-[#081328] px-4 py-2 text-xs text-slate-300"><div className="mx-auto flex max-w-[1380px] flex-col items-center justify-between gap-2 sm:flex-row"><div className="flex max-w-full items-center gap-2"><span className="text-blue-300">⌖</span><div className="min-w-0"><span className="block truncate">{message}</span></div><button onClick={fetchLocation} className="shrink-0 rounded-md border border-blue-400/40 px-2 py-1 font-bold text-blue-200 transition hover:bg-blue-500/20">{loading ? 'Fetching…' : 'Fetch location'}</button></div><a className="font-semibold text-blue-300 hover:text-white" href="tel:+919876543210">☎ +91 98765 43210</a></div></div>
}
