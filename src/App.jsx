import { Route, Routes } from 'react-router-dom'
import Navbar from './components/navbar'
import Home from './components/Home'
import About from './components/About'
import Contact from './components/Contact'
import Login from './components/Login'
import Services from './components/Services'
import HowItWorks from './components/HowItWorks'
import Fleet from './components/Fleet'
import Reviews from './components/Reviews'
import Faqs from './components/Faqs'
import AdminReviews from './components/AdminReviews'
import Footer from './components/Footer'
import TopBar from './components/TopBar'
import AdminPanel from "../admin/AdminPanel";
import ManagedPage from './components/ManagedPage'
import Blog from './components/Blog'
import ContentAdmin from "../admin/ContentAdmin";
import RequestsAdmin from "../admin/RequestsAdmin";
import HeroAdmin from "../admin/HeroAdmin";
import FooterReviews from './components/FooterReviews'
import Pricing from './components/Pricing'

function WithNavbar({ children }) { return <><TopBar /><Navbar />{children}<FooterReviews /><Footer /></> }

export default function App() {
  return <Routes>
    <Route path="/" element={<WithNavbar><Home /></WithNavbar>} />
    <Route path="/about" element={<WithNavbar><About /></WithNavbar>} />
    <Route path="/services" element={<WithNavbar><Services /></WithNavbar>} />
    <Route path="/services/:service" element={<WithNavbar><Services /></WithNavbar>} />
    <Route path="/pricing" element={<WithNavbar><Pricing /></WithNavbar>} />
    <Route path="/contact" element={<WithNavbar><Contact /></WithNavbar>} />
    <Route path="/login" element={<WithNavbar><Login /></WithNavbar>} />
    <Route path="/how-it-works" element={<HowItWorks />} />
    <Route path="/fleet" element={<Fleet />} />
    <Route path="/reviews" element={<Reviews />} />
    <Route path="/faqs" element={<Faqs />} />
    <Route path="/blog" element={<WithNavbar><Blog /></WithNavbar>} />
    <Route path="/blog/:slug" element={<WithNavbar><Blog /></WithNavbar>} />
    <Route path="/admin/reviews" element={<AdminReviews />} />
    <Route path="/admin" element={<AdminPanel />} />
    <Route path="/admin/content" element={<ContentAdmin />} />
    <Route path="/admin/requests" element={<RequestsAdmin />} />
    <Route path="/admin/hero" element={<HeroAdmin />} />
    <Route path="/p/:slug" element={<WithNavbar><ManagedPage /></WithNavbar>} />
  </Routes>
}
