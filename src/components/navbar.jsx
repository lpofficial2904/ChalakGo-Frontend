import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import defaultLogo from '../assets/Chalakgo logo.png'
import { ChevronDown, LogOut, UserRound } from 'lucide-react'
import { toast } from 'sonner'
import { API_BASE } from '../utils/api.js'
import { clearUserSession, tokenExpiryDelay } from '../utils/session.js'

const menuLinks = [
  ['Home', '/'],
  ['About', '/about'],
  ['Pricing', '/pricing'],
  ['Blog', '/blog'],
  ['Contact', '/contact'],
]
const desktopLink = ({ isActive }) => `nav-link ${isActive ? 'text-blue-600' : ''}`
const fallbackServices = [
  { slug: 'driver-only', name: 'Driver Only' },
  { slug: 'car-driver', name: 'Car + Driver' },
  { slug: 'permanent-driver', name: 'Permanent Driver' },
]

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [services, setServices] = useState(fallbackServices)
  const [pages, setPages] = useState([])
  const [brand, setBrand] = useState({
    siteName: 'ChalakGo',
    logo: '',
    navbarLogo: '',
    mainFavicon: '',
  })
  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('chalakgo_user') || 'null')
    } catch {
      return null
    }
  })
  const [userMenu, setUserMenu] = useState(false)

  // Published admin services are the source of truth for this menu.
  useEffect(() => {
    fetch(`${API_BASE}/api/services`)
      .then((r) => (r.ok ? r.json() : null))
      .then((items) => {
        if (Array.isArray(items)) setServices(items)
      })
      .catch(() => {})
  }, [])
  useEffect(() => {
    fetch(`${API_BASE}/api/pages`)
      .then((r) => (r.ok ? r.json() : null))
      .then((items) => {
        if (Array.isArray(items)) setPages(items)
      })
      .catch(() => {})
  }, [])
  useEffect(() => {
    fetch(`${API_BASE}/api/settings`, { credentials: 'include' })
      .then((r) => (r.ok ? r.json() : null))
      .then((x) => x && setBrand((v) => ({ ...v, ...x })))
      .catch(() => {})
  }, [])
  useEffect(() => {
    const token =
      localStorage.getItem('chalakgo_user_token') || sessionStorage.getItem('chalakgo_user_token')
    // Guests do not have a session, so do not make an unnecessary /me request.
    if (!token) return
    const expiryDelay = tokenExpiryDelay(token)
    if (!expiryDelay) {
      clearUserSession()
      setUser(null)
      return
    }
    const expiryTimer = window.setTimeout(() => {
      clearUserSession()
      setUser(null)
      window.location.href = '/login'
    }, expiryDelay)
    fetch(`${API_BASE}/api/users/me`, {
      credentials: 'include',
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((response) => (response.ok ? response.json() : null))
      .then((data) => {
        if (data?.user) {
          setUser(data.user)
          localStorage.setItem('chalakgo_user', JSON.stringify(data.user))
          return
        }
        clearUserSession()
        setUser(null)
      })
      .catch(() => {})
      return () => window.clearTimeout(expiryTimer)
  }, [])
  useEffect(() => {
    document.body.classList.toggle('mobile-nav-open', open)
    return () => document.body.classList.remove('mobile-nav-open')
  }, [open])
  useEffect(() => {
    const icon = document.querySelector("link[rel='icon']")
    if (icon) icon.href = brand.mainFavicon || '/favicon.svg'
  }, [brand.mainFavicon])

  const close = () => {
    setOpen(false)
    setUserMenu(false)
  }
  const logout = async () => {
    try {
      await fetch(`${API_BASE}/api/users/logout`, { method: 'POST', credentials: 'include' })
    } finally {
      clearUserSession()
      setUser(null)
      toast.success('You have been logged out.')
      close()
    }
  }
  const serviceLinks = (className) =>
    services.map((service) => (
      <Link
        key={service.slug}
        to={`/services/${service.slug}`}
        onClick={close}
        className={className}
      >
        {service.name}
      </Link>
    ))

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white text-[#10213f] shadow-sm">
      <nav className="mx-auto flex h-[72px] max-w-[1380px] items-center justify-between px-4 lg:px-12">
        <Link to="/" onClick={close} className="flex items-center">
          <img
            src={brand.navbarLogo || brand.logo || defaultLogo}
            alt={brand.siteName}
            className="h-10 w-auto sm:h-11"
          />
        </Link>
        <div className="hidden items-center gap-7 text-sm font-semibold text-slate-600 md:flex">
          <NavLink to="/" end className={desktopLink}>
            Home
          </NavLink>
          <NavLink to="/about" className={desktopLink}>
            About
          </NavLink>
          <div className="group relative">
            <Link
              to="/services"
              className="flex items-center gap-1 py-6 hover:text-blue-600"
              aria-haspopup="true"
            >
              Services{' '}
              <span aria-hidden="true" className="text-xs">
                ⌄
              </span>
            </Link>
            <div className="invisible absolute left-1/2 top-full w-56 -translate-x-1/2 rounded-xl border border-slate-200 bg-white p-2 opacity-0 shadow-xl transition group-hover:visible group-hover:opacity-100 group-focus-within:visible group-focus-within:opacity-100">
              <Link
                to="/services"
                className="block rounded-lg px-3 py-2 text-xs font-bold uppercase tracking-wide text-blue-600 hover:bg-blue-50"
              >
                All services
              </Link>
              {serviceLinks('block rounded-lg px-3 py-2.5 hover:bg-blue-50 hover:text-blue-600')}
            </div>
          </div>
          <NavLink to="/pricing" className={desktopLink}>
            Pricing
          </NavLink>
          <NavLink to="/blog" className={desktopLink}>
            Blog
          </NavLink>
          {pages.map((page) => (
            <NavLink key={page.slug} to={`/p/${page.slug}`} className={desktopLink}>
              {page.navigationLabel || page.title}
            </NavLink>
          ))}
          <NavLink to="/contact" className={desktopLink}>
            Contact
          </NavLink>
        </div>
        <div className="hidden items-center gap-2 sm:flex">
          <Link
            to="/services"
            className="rounded-xl bg-blue-600 px-4 py-3 text-sm font-bold text-white"
          >
            Book Now
          </Link>
          {user ? (
            <div className="relative">
              <button
                type="button"
                aria-expanded={userMenu}
                onClick={() => setUserMenu((value) => !value)}
                className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-3 text-sm font-bold text-slate-700"
              >
                <UserRound size={16} />
                {user.fullName?.split(' ')[0] || 'Account'}
                <ChevronDown
                  size={15}
                  className={userMenu ? 'rotate-180 transition' : 'transition'}
                />
              </button>
              {userMenu && (
                <div className="absolute right-0 top-[calc(100%+8px)] z-[120] w-56 rounded-2xl border border-slate-200 bg-white p-2 shadow-xl">
                  <div className="border-b border-slate-100 px-3 py-3">
                    <p className="font-bold text-[#10213f]">{user.fullName || 'Customer'}</p>
                    <p className="mt-1 truncate text-xs text-slate-500">
                      {user.email || user.mobile}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={logout}
                    className="mt-1 flex w-full items-center gap-2 rounded-xl px-3 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/login"
              className="rounded-xl border border-slate-200 px-4 py-3 text-sm font-bold"
            >
              Login
            </Link>
          )}
        </div>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="mobile-menu"
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="mobile-menu-button grid h-11 w-11 place-items-center rounded-xl border border-slate-200 text-2xl font-bold"
        >
          {open ? '×' : '☰'}
        </button>
      </nav>
      {open && (
        <div
          id="mobile-menu"
          className="mobile-drawer fixed z-[100] bg-white md:hidden"
        >
          <div className="mobile-drawer-heading">Menu</div>
          <div className="mobile-drawer-links">
            {menuLinks.slice(0, 2).map(([name, path]) => (
              <Link
                key={name}
                to={path}
                onClick={close}
                className="rounded-xl px-4 py-4 text-lg font-bold hover:bg-blue-50"
              >
                {name}
              </Link>
            ))}
            <Link
              to="/services"
              onClick={close}
              className="rounded-xl px-4 py-4 text-lg font-bold hover:bg-blue-50"
            >
              Services
            </Link>
            <div className="grid gap-1 border-l-2 border-blue-200 pl-3">
              {serviceLinks(
                'rounded-lg px-3 py-2.5 text-sm font-semibold text-slate-600 hover:bg-blue-50'
              )}
            </div>
            {menuLinks.slice(2).map(([name, path]) => (
              <Link
                key={name}
                to={path}
                onClick={close}
                className="rounded-xl px-4 py-4 text-lg font-bold hover:bg-blue-50"
              >
                {name}
              </Link>
            ))}
            {pages.map((page) => (
              <Link
                key={page.slug}
                to={`/p/${page.slug}`}
                onClick={close}
                className="rounded-xl px-4 py-4 text-lg font-bold hover:bg-blue-50"
              >
                {page.navigationLabel || page.title}
              </Link>
            ))}
            {user && (
              <div className="rounded-xl bg-slate-50 px-4 py-3">
                <p className="font-bold">{user.fullName || 'Customer'}</p>
                <p className="mt-1 text-xs text-slate-500">{user.email || user.mobile}</p>
                <button
                  type="button"
                  onClick={logout}
                  className="mt-3 flex items-center gap-2 font-bold text-red-600"
                >
                  <LogOut size={16} />
                  Logout
                </button>
              </div>
            )}
          </div>
            <div className="mobile-drawer-actions">
              <Link
                to="/services"
                onClick={close}
                className="mobile-book-button rounded-xl bg-blue-600 text-center font-bold text-white"
              >
                Book Now
              </Link>
              {!user && (
                <Link
                  to="/login"
                  onClick={close}
                  className="rounded-xl border border-slate-300 bg-white text-center font-bold"
                >
                  Login
                </Link>
              )}
            </div>
        </div>
      )}
    </header>
  )
}
