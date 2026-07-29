import { useRef, useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { useVaults } from '../context/VaultContext'
import { useSidebar } from '../context/SidebarContext'
import { useHeldKeysSidebar, useNavKeyboard } from '../controllers/controlSidebar'
import { useClickOutside } from '../hooks/useClickOutside'


const topLinks = [
  { to: '/', label: 'New Vault' },
  { to: '/tags', label: 'Tags' },
]

const endLinks = [
  { to: '/settings', label: 'Settings' },
]

export function Sidebar() {
  const { sidebarOpen, setSidebarOpen } = useSidebar()
  const { user } = useUser()
  const { vaults } = useVaults()
  const sidebarRef = useRef<HTMLDivElement>(null)
  const navRef = useRef<HTMLElement>(null)
  const [_focusedIdx, setFocusedIdx] = useState(-1)
  const focusedIdx = sidebarOpen ? _focusedIdx : -1

  useHeldKeysSidebar(sidebarOpen, setSidebarOpen)
  useClickOutside(sidebarRef, sidebarOpen, () => setSidebarOpen(false))
  useNavKeyboard(sidebarOpen, setSidebarOpen, focusedIdx, setFocusedIdx, navRef)

  return (
    <>
      <div
        ref={sidebarRef}
        className={`sidebar flex flex-col ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <nav ref={navRef} className="flex-1 pt-16 px-2 flex flex-col min-h-0">
          {user && (
            <div className="px-4 py-3 mb-3 border-b border-border">
              <p className="text-sm font-medium text-text uppercase">{user.username}</p>
            </div>
          )}
          <div className="space-y-1">
            {topLinks.map((link, i) => (
              <NavLink
                key={link.to}
                to={link.to}
                end={link.to === '/'}
                tabIndex={-1}
                className={({ isActive }) =>
                  `sidebar-link ${isActive ? 'sidebar-link-active' : 'hover:bg-card/80'} ${focusedIdx === i ? 'ring-2 ring-accent' : ''}`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
          <p className="sidebar-section-title">Vaults</p>
          {vaults.length > 0 && (
            <div className="flex-1 overflow-y-auto min-h-0 vaults-scroll space-y-1 mt-2 p-2">
              {vaults.map((vault, i) => {
                const idx = topLinks.length + i
                return (
                  <NavLink
                    key={vault.id}
                    to={`/vault/${vault.id}`}
                    tabIndex={-1}
                    className={({ isActive }) =>
                      `sidebar-link ${isActive ? 'sidebar-link-active' : 'hover:bg-card/80'} ${focusedIdx === idx ? 'ring-2 ring-accent' : ''}`
                    }
                  >
                    {vault.title}
                  </NavLink>
                )
              })}
            </div>
          )}

          {vaults.length === 0 && <div className="flex-1" />}

          <div className="sidebar-divider" />

          <div className="space-y-1 pt-1 pb-3">
            {endLinks.map((link, i) => {
              const idx = topLinks.length + vaults.length + i
              return (
                <NavLink
                  key={link.to}
                  to={link.to}
                  end={link.to === '/'}
                  tabIndex={-1}
                  className={({ isActive }) =>
                    `sidebar-link ${isActive ? 'sidebar-link-active' : 'hover:bg-card/80'} ${focusedIdx === idx ? 'ring-2 ring-accent' : ''}`
                  }
                >
                  {link.label}
                </NavLink>
              )
            })}
          </div>
        </nav>
      </div>

      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="sidebar-toggle fixed top-8 z-50"
        style={{ left: sidebarOpen ? 180 : 8 }}
        aria-label={sidebarOpen ? 'Close sidebar' : 'Open sidebar'}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="w-4 h-4"
        >
          <polyline points={sidebarOpen ? '15 18 9 12 15 6' : '9 18 15 12 9 6'} />
        </svg>
      </button>
    </>
  )
}
