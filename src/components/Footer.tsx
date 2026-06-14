import { Link } from 'react-router-dom';
import { LucideIcon } from './LucideIcon';

export function Footer() {
  const productCols = [
    { name: 'Claude 3.5 Sonoma', path: '/products/claude-3-5' },
    { name: 'ChatGPT Plus', path: '/products/chatgpt-plus' },
    { name: 'Gemini Advanced', path: '/products/gemini-pro' },
    { name: 'Midjourney Pro', path: '/products/midjourney' },
    { name: 'Cursor Pro', path: '/products/cursor-pro' },
    { name: 'Perplexity Pro', path: '/products/perplexity-pro' },
  ];

  const companyCols = [
    { name: 'About Us', path: '/' },
    { name: 'How It Works', path: '/' },
    { name: 'Careers', path: '/' },
    { name: 'Affiliate Program', path: '/' },
    { name: 'Trust & Security', path: '/' },
  ];

  const legalCols = [
    { name: 'Terms of Service', path: '/' },
    { name: 'Privacy Policy', path: '/' },
    { name: 'Refund Policy', path: '/' },
    { name: 'GDPR Compliance', path: '/' },
    { name: 'Cookie settings', path: '/' },
  ];

  return (
    <footer id="footer" className="bg-neutral-900 text-neutral-400 pt-16 pb-10 border-t border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Upper Column Structures */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-6 mb-16">
          
          {/* Logo Card and description */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            <Link to="/" className="flex items-center gap-2 text-white">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-indigo-500 flex items-center justify-center">
                <span className="text-white font-black text-sm tracking-tighter italic">AI</span>
              </div>
              <span className="font-extrabold text-xl text-white tracking-tight">AI Nest</span>
            </Link>

            <p className="text-sm leading-relaxed max-w-sm text-neutral-400">
              Get direct premium access to 30+ top-tier AI pipelines and platforms with zero setup. Trusted by 15,000+ happy developers, content creators, and businesses globally.
            </p>

            {/* Social Indicators */}
            <div className="flex items-center gap-3 mt-1">
              {['Facebook', 'Twitter', 'Github', 'Instagram', 'Youtube'].map((social) => (
                <a
                  key={social}
                  href="#"
                  className="p-2 rounded-xl bg-neutral-800 hover:bg-violet-600 hover:text-white transition-all text-neutral-400"
                  aria-label={social}
                >
                  <LucideIcon name={social === 'Twitter' ? 'Twitter' : social === 'Facebook' ? 'Facebook' : social === 'Github' ? 'Github' : social === 'Instagram' ? 'Instagram' : 'Youtube'} size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Products */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Favorite Tools</h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              {productCols.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-violet-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Company */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">Company</h4>
            <ul className="flex flex-col gap-2.5 text-xs sm:text-sm">
              {companyCols.map((link) => (
                <li key={link.name}>
                  <Link to={link.path} className="hover:text-violet-400 transition-colors">
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter or Support */}
          <div className="flex flex-col gap-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-white">SaaS Newsletter</h4>
            <p className="text-xs text-neutral-400 leading-relaxed">
              Subscribe to get notified about new subscriptions, software updates, and exclusive discount codes!
            </p>
            <form onSubmit={(e) => e.preventDefault()} className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email address"
                className="bg-neutral-800 text-xs px-3 py-2 rounded-xl border border-neutral-700/60 focus:border-violet-500 focus:outline-none flex-1"
                required
              />
              <button
                type="submit"
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl px-3 flex items-center justify-center transition-all cursor-pointer active:scale-95"
              >
                <LucideIcon name="Send" size={12} />
              </button>
            </form>
          </div>
        </div>

        {/* Separator line */}
        <div className="border-t border-neutral-800 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Copyright text */}
          <p className="text-xs text-neutral-500 font-medium">
            &copy; {new Date().getFullYear()} AI Nest Marketplace Inc. All rights reserved. Built with pride using MERN frontend stack.
          </p>

          {/* Bottom details / trust indicators */}
          <div className="flex items-center gap-6 text-[11px] font-semibold text-neutral-500">
            <Link to="/" className="hover:text-neutral-300">Terms</Link>
            <Link to="/" className="hover:text-neutral-300">Privacy</Link>
            <Link to="/" className="hover:text-neutral-300">Cookies</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
