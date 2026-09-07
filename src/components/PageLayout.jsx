import Navbar from './navbar'
import Footer from './Footer'

export default function PageLayout({ children, dark = false }) {
  return <main className={dark ? 'min-h-screen bg-[#090f20] text-white' : 'min-h-screen bg-white text-[#101a31]'}><Navbar />{children}<Footer /></main>
}
