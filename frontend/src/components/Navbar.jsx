'use client'

import { useState, useEffect } from 'react'
import { Dialog, DialogPanel } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'

export default function Navbar({ username, role, onLogout, setActiveTab, activeTab }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [dark, setDark] = useState(() => localStorage.getItem('ghm_theme') !== 'light')

  useEffect(() => {
    if (dark) {
      document.documentElement.classList.add('dark')
      document.documentElement.classList.remove('light')
      localStorage.setItem('ghm_theme', 'dark')
    } else {
      document.documentElement.classList.add('light')
      document.documentElement.classList.remove('dark')
      localStorage.setItem('ghm_theme', 'light')
    }
  }, [dark])

  const allTabs = [
    { name: 'Dashboard', tab: 'dashboard', roles: ['admin', 'beverage_manager', 'bartender', 'chef'] },
    { name: 'Analytics',  tab: 'analytics', roles: ['admin', 'beverage_manager', 'bartender', 'chef'] },
    { name: 'Events', tab: 'parties', roles: ['admin', 'beverage_manager', 'bartender'] },
  ]
  const navigation = allTabs.filter(item => item.roles.includes(role))

  return (
    <>
      <style>{`
        :root.light header { background: #fff !important; border-bottom: 1px solid rgba(0,0,0,0.08); }
        :root.light .nav-link { color: #1a1a2e !important; }
        :root.light .nav-link:hover { color: #000 !important; }
        :root.light .nav-active { color: #000 !important; border-color: #000 !important; }
        :root.light .logout-btn { border-color: rgba(0,0,0,0.3) !important; color: #1a1a2e !important; }
        :root.light .logout-btn:hover { background: rgba(0,0,0,0.05) !important; }
        :root.light .username-text { color: rgba(0,0,0,0.5) !important; }
        :root.light .toggle-btn { border-color: rgba(0,0,0,0.2) !important; color: rgba(0,0,0,0.5) !important; }
        :root.light .toggle-btn:hover { color: #000 !important; }
      `}</style>

      <header className="fixed inset-x-0 top-0 z-50 shadow-md" style={{ background: '#0d0d0d' }}>
        <nav className="flex items-center justify-between p-6 lg:px-8">
          <div className="flex lg:flex-1">
            <a href="#" className="-m-1.5 p-1.5">
              <span className="sr-only">GHM</span>
              <img src="https://www.graydonhall.com/wp-content/themes/custom-theme/img/logo.svg" alt="Logo" className="h-8 w-auto" />
            </a>
          </div>

          <div className="flex lg:hidden">
            <button type="button" onClick={() => setMobileMenuOpen(true)} className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-white" style={{background:'transparent'}}>
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" />
            </button>
          </div>

          <div className="hidden lg:flex lg:gap-x-12">
            {navigation.map((item) => (
              <button
                key={item.tab}
                onClick={() => setActiveTab(item.tab)}
                className={`nav-link text-sm font-semibold transition-colors pb-0.5 ${
                  activeTab === item.tab
                    ? 'nav-active text-white border-b border-white'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {item.name}
              </button>
            ))}
          </div>

          <div className="hidden lg:flex lg:flex-1 lg:justify-end gap-x-4 items-center">
            <button
              onClick={() => setDark(d => !d)}
              className="toggle-btn w-9 h-9 flex items-center justify-center rounded-md border border-white/20 hover:border-white/50 text-white/40 hover:text-white transition-all"
              title={dark ? 'Switch to Light' : 'Switch to Dark'}
            >
              {dark ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
                </svg>
              )}
            </button>

            {username && (
              <span className="username-text text-xs text-white/40">
                👤 {username} {role && <span style={{fontSize:'9px', textTransform:'uppercase', letterSpacing:'0.1em', opacity: 0.6}}>· {role.replace('_',' ')}</span>}
              </span>
            )}

            <button onClick={onLogout} className="logout-btn rounded-md border border-white/30 px-3 py-2 text-sm font-semibold text-white hover:bg-white/10 transition-colors">
              Logout
            </button>
          </div>
        </nav>

        <Dialog open={mobileMenuOpen} onClose={setMobileMenuOpen} className="lg:hidden">
          <div className="fixed inset-0 z-50 bg-black/50" aria-hidden="true" />
          <DialogPanel className="fixed inset-y-0 right-0 z-50 w-full max-w-sm overflow-y-auto p-6 shadow-lg" style={{background:'#0d0d0d'}}>
            <div className="flex items-center justify-between">
              <a href="#" className="-m-1.5 p-1.5">
                <span className="sr-only">GHM</span>
                <img src="https://www.graydonhall.com/wp-content/themes/custom-theme/img/logo.svg" alt="Logo" className="h-8 w-auto" />
              </a>
              <button type="button" onClick={() => setMobileMenuOpen(false)} className="-m-2.5 rounded-md p-2.5 text-white">
                <span className="sr-only">Close menu</span>
                <XMarkIcon className="h-6 w-6" />
              </button>
            </div>

            <div className="mt-6 space-y-2">
              {navigation.map((item) => (
                <button
                  key={item.tab}
                  onClick={() => { setActiveTab(item.tab); setMobileMenuOpen(false) }}
                  className={`block w-full rounded-lg px-3 py-2 text-left text-base font-semibold ${
                    activeTab === item.tab ? 'text-white font-bold' : 'text-white/60'
                  }`}
                  style={activeTab === item.tab ? {background:'rgba(255,255,255,0.08)'} : {}}
                >
                  {item.name}
                </button>
              ))}

              <div className="pt-4 border-t border-white/10">
                <button
                  onClick={() => setDark(d => !d)}
                  className="flex items-center gap-3 w-full rounded-lg px-3 py-2 text-left text-base font-semibold text-white"
                >
                  {dark ? (
                    <><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>Light Mode</>
                  ) : (
                    <><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>Dark Mode</>
                  )}
                </button>
              </div>

              {username && (
                <div className="pt-2 border-t border-white/10">
                  <p className="text-xs text-white/40 px-3 mb-2">Signed in as {username} ({role?.replace('_',' ')})</p>
                  <button
                    onClick={() => { onLogout(); setMobileMenuOpen(false) }}
                    className="block w-full rounded-lg px-3 py-2 text-left text-base font-semibold text-red-400"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </DialogPanel>
        </Dialog>
      </header>
    </>
  )
}