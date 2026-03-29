const PRIORITY_STYLES = {
  Low:      'bg-green-50 text-green-700',
  Medium:   'bg-amber-50 text-amber-700',
  High:     'bg-red-50 text-red-700',
  Critical: 'bg-purple-50 text-purple-700',
}

// Integer values matching your BoardTaskStatus enum
const NEXT_STATUS = {
  ToDo:       1,   // → InProgress
  InProgress: 2,   // → Done
}

const STATUS_LABEL = {
  ToDo:       'Start',
  InProgress: 'Mark Done',
}

export default function TaskCard({ task, isAdmin, onStatusChange, onArchive }) {
  const canMove = task.status === 'ToDo' || task.status === 'InProgress'
  const canArchive = isAdmin && (task.status === 'Done' || task.status === 'Cancelled')

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-3 hover:border-indigo-200 transition-all">

      {/* Title */}
      <p className="text-sm text-gray-900 mb-2 leading-snug">{task.title}</p>

      {/* Priority + Due */}
      <div className="flex items-center justify-between mb-3">
        <span className={`text-xs px-2 py-0.5 rounded-md font-medium ${PRIORITY_STYLES[task.priority]}`}>
          {task.priority}
        </span>
        <span className="text-xs text-gray-400">
          {new Date(task.dueDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
        </span>
      </div>

      {/* Assignee */}
      {task.assigneeName && (
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-5 h-5 rounded-full bg-indigo-100 flex items-center justify-center">
            <span className="text-xs text-indigo-600 font-medium">
              {task.assigneeName.charAt(0).toUpperCase()}
            </span>
          </div>
          <span className="text-xs text-gray-400">{task.assigneeName}</span>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {canMove && (
          <button
            onClick={() => onStatusChange(task.id, NEXT_STATUS[task.status])}
            className="flex-1 text-xs py-1 border border-indigo-200 text-indigo-600 rounded-md hover:bg-indigo-50"
          >
            {STATUS_LABEL[task.status]}
          </button>
        )}
        {task.status === 'InProgress' && (
          <button
            onClick={() => onStatusChange(task.id, 3)}
            className="text-xs py-1 px-2 border border-gray-200 text-gray-400 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
        )}
        {canArchive && (
          <button
            onClick={() => onArchive(task.id)}
            className="flex-1 text-xs py-1 border border-gray-200 text-gray-400 rounded-md hover:bg-gray-50"
          >
            Archive
          </button>
        )}
      </div>
    </div>
  )
}