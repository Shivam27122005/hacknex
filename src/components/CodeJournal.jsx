import React, { useState, useEffect } from 'react'
import { 
  BookOpen, 
  Plus, 
  Search, 
  Calendar, 
  Tag, 
  Edit3, 
  Trash2,
  Save,
  X,
  Clock,
  Code,
  Lightbulb,
  Bug
} from 'lucide-react'

const CodeJournal = () => {
  const [entries, setEntries] = useState([])
  const [showNewEntry, setShowNewEntry] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedTag, setSelectedTag] = useState('all')
  const [newEntry, setNewEntry] = useState({
    title: '',
    content: '',
    type: 'note',
    tags: [],
    codeSnippet: ''
  })

  const entryTypes = [
    { id: 'note', label: 'Note', icon: BookOpen, color: 'blue' },
    { id: 'bug', label: 'Bug Fix', icon: Bug, color: 'red' },
    { id: 'idea', label: 'Idea', icon: Lightbulb, color: 'yellow' },
    { id: 'solution', label: 'Solution', icon: Code, color: 'green' }
  ]

  const predefinedTags = ['c++', 'Python', 'Java', 'C', 'JavaScript', 'database','Others']

  const saveEntry = () => {
    if (!newEntry.title.trim()) return

    const entry = {
      id: Date.now(),
      ...newEntry,
      timestamp: new Date(),
      tags: newEntry.tags.filter(tag => tag.trim())
    }

    setEntries(prev => [entry, ...prev])
    setNewEntry({ title: '', content: '', type: 'note', tags: [], codeSnippet: '' })
    setShowNewEntry(false)

    // Save to localStorage
    const updatedEntries = [entry, ...entries]
    localStorage.setItem('codeJournal', JSON.stringify(updatedEntries))
  }

  const deleteEntry = (id) => {
    const updatedEntries = entries.filter(entry => entry.id !== id)
    setEntries(updatedEntries)
    localStorage.setItem('codeJournal', JSON.stringify(updatedEntries))
  }

  const filteredEntries = entries.filter(entry => {
    const matchesSearch = entry.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         entry.content.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTag = selectedTag === 'all' || entry.tags.includes(selectedTag)
    return matchesSearch && matchesTag
  })

  const getTypeData = (type) => entryTypes.find(t => t.id === type)

  useEffect(() => {
    const savedEntries = localStorage.getItem('codeJournal')
    if (savedEntries) {
      setEntries(JSON.parse(savedEntries))
    }
  }, [])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <BookOpen className="w-6 h-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Code Journal</h1>
        </div>
        <button
          onClick={() => setShowNewEntry(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Entry</span>
        </button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search your journal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <select
          value={selectedTag}
          onChange={(e) => setSelectedTag(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Tags</option>
          {predefinedTags.map(tag => (
            <option key={tag} value={tag}>{tag}</option>
          ))}
        </select>
      </div>

      {/* New Entry Modal */}
      {showNewEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">New Journal Entry</h2>
                <button
                  onClick={() => setShowNewEntry(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                  <input
                    type="text"
                    value={newEntry.title}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, title: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="What did you learn or solve today?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <div className="flex space-x-2">
                    {entryTypes.map(type => (
                      <button
                        key={type.id}
                        onClick={() => setNewEntry(prev => ({ ...prev, type: type.id }))}
                        className={`flex items-center space-x-2 px-3 py-2 rounded-lg border transition-colors ${
                          newEntry.type === type.id 
                            ? `border-${type.color}-500 bg-${type.color}-50 text-${type.color}-700`
                            : 'border-gray-300 hover:bg-gray-50'
                        }`}
                      >
                        <type.icon className="w-4 h-4" />
                        <span className="text-sm">{type.label}</span>
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content</label>
                  <textarea
                    value={newEntry.content}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, content: e.target.value }))}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Describe what you learned, the problem you solved, or your thoughts..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Code Snippet (Optional)</label>
                  <textarea
                    value={newEntry.codeSnippet}
                    onChange={(e) => setNewEntry(prev => ({ ...prev, codeSnippet: e.target.value }))}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm"
                    placeholder="// Paste your code snippet here..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Tags</label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {predefinedTags.map(tag => (
                      <button
                        key={tag}
                        onClick={() => {
                          const tags = newEntry.tags.includes(tag)
                            ? newEntry.tags.filter(t => t !== tag)
                            : [...newEntry.tags, tag]
                          setNewEntry(prev => ({ ...prev, tags }))
                        }}
                        className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                          newEntry.tags.includes(tag)
                            ? 'bg-blue-100 border-blue-300 text-blue-700'
                            : 'bg-gray-100 border-gray-300 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        {tag}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <button
                    onClick={() => setShowNewEntry(false)}
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEntry}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    <Save className="w-4 h-4" />
                    <span>Save Entry</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Journal Entries */}
      <div className="space-y-4">
        {filteredEntries.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No entries yet</h3>
            <p className="text-gray-500">Start documenting your coding journey!</p>
          </div>
        ) : (
          filteredEntries.map((entry) => {
            const typeData = getTypeData(entry.type)
            return (
              <div key={entry.id} className="bg-white rounded-lg border border-gray-200 p-6 hover:shadow-md transition-shadow">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-lg ${typeData.bg}`}>
                      <typeData.icon className={`w-4 h-4 ${typeData.color}`} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{entry.title}</h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-500">
                        <Clock className="w-3 h-3" />
                        <span>{new Date(entry.timestamp).toLocaleDateString()}</span>
                        <span className={`px-2 py-1 rounded-full text-xs ${typeData.bg} ${typeData.color}`}>
                          {typeData.label}
                        </span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => deleteEntry(entry.id)}
                    className="text-gray-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <p className="text-gray-700 mb-4">{entry.content}</p>

                {entry.codeSnippet && (
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <pre className="text-sm font-mono text-gray-800 overflow-x-auto">
                      <code>{entry.codeSnippet}</code>
                    </pre>
                  </div>
                )}

                {entry.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {entry.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}

export default CodeJournal
