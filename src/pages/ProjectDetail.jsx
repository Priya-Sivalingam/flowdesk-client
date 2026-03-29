import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import Sidebar from '../components/Sidebar'
import TaskCard from '../components/TaskCard'
import api from '../api/axios'
import { useAuth } from '../context/AuthContext'

const COLUMNS = [
  { key: 'ToDo',       label: 'To Do',       color: 'bg-gray-400' },
  { key: 'InProgress', label: 'In Progress',  color: 'bg-indigo-500' },
  { key: 'Done',       label: 'Done',         color: 'bg-green-500' },
  { key: 'Cancelled',  label: 'Cancelled',    color: 'bg-red-400' },
]

const PRIORITIES = ['Low', 'Medium', 'High', 'Critical']

export default function ProjectDetail() {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()

  const [project, setProject]       = useState(null)
  const [tasks, setTasks]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [filterStatus, setFilter]   = useState('All')
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating]     = useState(false)
  const [form, setForm] = useState({
    title: '', description: '', priority: 'Medium',
    dueDate: '', assigneeEmployeeId: ''
  })

  useEffect(() => {
    fetchAll()
  }, [id])

const fetchAll = async () => {
  try {
    const [projRes, taskRes] = await Promise.all([
      api.get(`/projects/${id}`),
      api.get(`/tasks/project/${id}`)
    ])
    setProject(projRes.data?.data ?? projRes.data)
    const t = taskRes.data?.data ?? taskRes.data ?? []
    console.log('tasks raw:', taskRes.data)   // ← add this
    console.log('tasks array:', t)             // ← add this
    setTasks(Array.isArray(t) ? t : [])
  } catch (err) {
    console.error(err)
  } finally {
    setLoading(false)
  }
}

  const handleCreate = async (e) => {
    e.preventDefault()
    setCreating(true)
    try {
await api.post('/tasks', {
  ...form,
  projectId: id,
  dueDate: new Date(form.dueDate + "T23:59:59").toISOString()
})
      setShowCreate(false)
      setForm({ title: '', description: '', priority: 'Medium', dueDate: '', assigneeEmployeeId: '' })
      fetchAll()
    } catch (err) {
      console.error(err)
    } finally {
      setCreating(false)
    }
  }

const handleStatusChange = async (taskId, newStatus) => {
  try {
    await api.patch(`/tasks/${taskId}/status`, { status: newStatus })
    fetchAll()
  } catch (err) {
    alert(err.response?.data?.message || 'Status update failed.')
    console.error(err)
  }
}

  const handleArchive = async (taskId) => {
    try {
      await api.patch(`/tasks/${taskId}/archive`)
      fetchAll()
    } catch (err) {
      console.error(err)
    }
  }

  const filteredTasks = (status) =>
    tasks.filter(t =>
      t.status === status &&
      !t.isArchived &&
      (filterStatus === 'All' || t.status === filterStatus)
    )

  if (loading) return (
    <div className="flex">
      <Sidebar />
      <div className="ml-56 flex-1 flex items-center justify-center min-h-screen">
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  )

  return (
    <div className="flex">
      <Sidebar />
      <div className="ml-56 flex-1 min-h-screen bg-white flex flex-col">

        {/* Header */}
        <div className="flex items-center justify-between px-8 py-5 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/')}
              className="text-gray-400 hover:text-gray-600 text-sm"
            >
              ← Projects
            </button>
            <span className="text-gray-200">/</span>
            <h1 className="text-lg font-medium text-gray-900">
              {project?.name}
            </h1>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              {tasks.filter(t => !t.isArchived).length} tasks
            </span>
          </div>
          {user?.role === 'Admin' && (
            <button
              onClick={() => setShowCreate(true)}
              className="bg-indigo-600 text-white text-sm px-4 py-2 rounded-lg hover:bg-indigo-700"
            >
              + New Task
            </button>
          )}
        </div>

        {/* Filter Bar */}
        <div className="flex gap-2 px-8 py-3 border-b border-gray-200">
          {['All', 'ToDo', 'InProgress', 'Done', 'Cancelled'].map(s => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${
                filterStatus === s
                  ? 'bg-indigo-50 border-indigo-300 text-indigo-600'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
              }`}
            >
              {s === 'ToDo' ? 'To Do' : s === 'InProgress' ? 'In Progress' : s}
            </button>
          ))}
        </div>

        {/* Kanban Board */}
        <div className="flex gap-4 p-6 overflow-x-auto flex-1">
          {COLUMNS.map(col => (
            <div key={col.key} className="w-60 flex-shrink-0">

              {/* Column Header */}
              <div className="flex items-center gap-2 mb-3">
                <div className={`w-2 h-2 rounded-full ${col.color}`} />
                <span className="text-xs font-medium text-gray-600">{col.label}</span>
                <span className="text-xs text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full ml-auto">
                  {filteredTasks(col.key).length}
                </span>
              </div>

              {/* Task Cards */}
              <div className="flex flex-col gap-2">
                {filteredTasks(col.key).map(task => (
                  <TaskCard
                    key={task.id}
                    task={task}
                    isAdmin={user?.role === 'Admin'}
                    onStatusChange={handleStatusChange}
                    onArchive={handleArchive}
                  />
                ))}
                {filteredTasks(col.key).length === 0 && (
                  <div className="border border-dashed border-gray-200 rounded-lg p-4 text-center">
                    <p className="text-xs text-gray-300">No tasks</p>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Task Modal */}
      {showCreate && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl border border-gray-200 p-6 w-full max-w-md">
            <h2 className="text-base font-medium text-gray-900 mb-4">New task</h2>
            <form onSubmit={handleCreate} className="flex flex-col gap-3">
              <div>
                <label className="text-sm text-gray-600 block mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={e => setForm({ ...form, title: e.target.value })}
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
                  rows={2}
                />
              </div>
              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-sm text-gray-600 block mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={e => setForm({ ...form, priority: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400"
                  >
                    {PRIORITIES.map(p => <option key={p}>{p}</option>)}
                  </select>
                </div>
                <div className="flex-1">
                  <label className="text-sm text-gray-600 block mb-1">Due Date</label>
                  <input
                    type="date"
                    value={form.dueDate}
                    onChange={e => setForm({ ...form, dueDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="text-sm text-gray-600 block mb-1">Assignee Employee ID</label>
                <input
                  type="text"
                  placeholder="FD-2026-0002"
                  value={form.assigneeEmployeeId}
                  onChange={e => setForm({ ...form, assigneeEmployeeId: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-indigo-400"
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
                  {creating ? 'Creating...' : 'Create Task'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}