import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Sidebar() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <div className="w-56 bg-gray-50 border-r border-gray-200 flex flex-col h-screen fixed left-0 top-0">

      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-4 border-b border-gray-200">
        <div className="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center">
          <span className="text-white text-xs font-medium">FD</span>
        </div>
        <span className="text-sm font-medium text-gray-900">FlowDesk</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 p-3 flex flex-col gap-1">
        <p className="text-xs text-gray-400 px-2 py-1 mt-2">WORKSPACE</p>

        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            `flex items-center gap-2 px-3 py-2 rounded-lg text-sm cursor-pointer ${
              isActive
                ? 'bg-white text-gray-900 font-medium border border-gray-200'
                : 'text-gray-600 hover:bg-gray-100'
            }`
          }
        >
          Projects
        </NavLink>

        <p className="text-xs text-gray-400 px-2 py-1 mt-3">ACCOUNT</p>

        {/* User Info */}
        <div className="px-3 py-2 text-sm text-gray-600">
          <p className="font-medium text-gray-900">{user?.name}</p>
          <p className="text-xs text-gray-400">{user?.employeeId}</p>
          <p className="text-xs text-indigo-600 mt-0.5">{user?.role}</p>
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-red-500 hover:bg-red-50 mt-1 text-left"
        >
          Sign out
        </button>
      </nav>
    </div>
  )
}