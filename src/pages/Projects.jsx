import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

export default function Projects() {
  const [projects, setProjects] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [creating, setCreating] = useState(false)
  const { user } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    fetchProjects()
  }, [])

const fetchProjects = async () => {
  try {
    const res = await api.get('/projects')
    // Handle both response shapes safely
    const data = res.data?.data ?? res.data ?? []
    setProjects(Array.isArray(data) ? data : [])
  } catch (err) {
    console.error(err)
    setProjects([])
  } finally {
    setLoading(false)
  }
}

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
      await api.post('/projects', form)
      setForm({ name: '', description: '' })
      setShowCreate(false)
      fetchProjects()
    } catch (err) {
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

  const colors = ['bg-indigo-500', 'bg-teal-500', 'bg-orange-500', 'bg-pink-500', 'bg-green-500']

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-56 flex-1 min-h-screen bg-white">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200">
          <div>
            <h1 className="text-lg font-medium text-gray-900">Projects</h1>
            <p className="text-sm text-gray-400">{projects.length} projects</p>
          </div>
          {user?.role === 'Admin' && (
            <button
              onClick={() => setShowCreate(true)}
              className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              + New Project
            </button>
          )}
        </div>

        {/* Projects Grid */}
        <div className="p-8">
          {loading ? (
            <p className="text-sm text-gray-400">Loading...</p>
          ) : projects.length === 0 ? (
            <p className="text-sm text-gray-400">No projects yet.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {projects.map((project, i) => (
                <div
                  key={project.id}
                  onClick={() => navigate(`/projects/${project.id}`)}
                  className="border border-gray-200 rounded-xl p-5 cursor-pointer hover:border-indigo-300 hover:shadow-sm transition-all"
                >
                  {/* Color bar */}
                  <div className={`w-8 h-8 rounded-lg ${colors[i % colors.length]} mb-4`} />

                  <h2 className="text-sm font-medium text-gray-900 mb-1">{project.name}</h2>
                  <p className="text-xs text-gray-400 mb-4 line-clamp-2">
                    {project.description || 'No description'}
                  </p>

                  <div className="flex items-center justify-between text-xs text-gray-400">
                    <span>{project.totalTasks} tasks</span>
                    <span>{project.totalMembers} members</span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                    Created by {project.createdByName}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Create Project Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md">
            <h2 className="text-base font-medium text-gray-900 mb-4">New project</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={e => setForm({ ...form, name: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  required
                />
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Description</label>
                <textarea
                  value={form.description}
                  onChange={e => setForm({ ...form, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400 resize-none"
                  rows={3}
                />
              </div>
              <div className="flex gap-2 justify-end mt-2">
                <button
                  type="button"
                  onClick={() => setShowCreate(false)}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={creating}
                  className="px-4 py-2 text-sm bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50"
                >
                  {creating ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}