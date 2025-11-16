import React, { useState, useEffect, useRef } from 'react'
import { 
  Search, 
  Command, 
  FileText, 
  Settings, 
  Play, 
  Bug, 
  GitBranch,
  Terminal,
  Zap,
  Code,
  Folder,
  ArrowRight
} from 'lucide-react'

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef(null)

  const commands = [
    // File operations
    { id: 'file.new', label: 'New File', icon: FileText, category: 'File', shortcut: 'Ctrl+N' },
    { id: 'file.open', label: 'Open File', icon: Folder, category: 'File', shortcut: 'Ctrl+O' },
    { id: 'file.save', label: 'Save File', icon: FileText, category: 'File', shortcut: 'Ctrl+S' },
    
    // Code actions
    { id: 'code.run', label: 'Run Code', icon: Play, category: 'Code', shortcut: 'F5' },
    { id: 'code.debug', label: 'Debug Code', icon: Bug, category: 'Code', shortcut: 'Shift+F5' },
    { id: 'code.format', label: 'Format Document', icon: Code, category: 'Code', shortcut: 'Shift+Alt+F' },
    { id: 'code.refactor', label: 'Refactor Selection', icon: Zap, category: 'Code', shortcut: 'Ctrl+Shift+R' },
    
    // Navigation
    { id: 'nav.journal', label: 'Open Code Journal', icon: FileText, category: 'Navigation' },
    { id: 'nav.insights', label: 'Open Dev Insights', icon: TrendingUp, category: 'Navigation' },
    { id: 'nav.settings', label: 'Open Settings', icon: Settings, category: 'Navigation' },
    
    // Git operations
    { id: 'git.status', label: 'Git Status', icon: GitBranch, category: 'Git', shortcut: 'Ctrl+Shift+G' },
    { id: 'git.commit', label: 'Git Commit', icon: GitBranch, category: 'Git' },
    { id: 'git.push', label: 'Git Push', icon: GitBranch, category: 'Git' },
    
    // Terminal
    { id: 'terminal.new', label: 'New Terminal', icon: Terminal, category: 'Terminal', shortcut: 'Ctrl+`' },
    { id: 'terminal.clear', label: 'Clear Terminal', icon: Terminal, category: 'Terminal' },
    
    // AI actions
    { id: 'ai.explain', label: 'AI: Explain Code', icon: Brain, category: 'AI' },
    { id: 'ai.optimize', label: 'AI: Optimize Code', icon: Zap, category: 'AI' },
    { id: 'ai.test', label: 'AI: Generate Tests', icon: Bug, category: 'AI' },
    { id: 'ai.refactor', label: 'AI: Smart Refactor', icon: Code, category: 'AI' }
  ]

  const filteredCommands = commands.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.category.toLowerCase().includes(query.toLowerCase())
  )

  const executeCommand = (command) => {
    console.log(`Executing command: ${command.id}`)
    // Command execution logic here
    onClose()
  }

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return

      switch (e.key) {
        case 'ArrowDown':
          e.preventDefault()
          setSelectedIndex(prev => Math.min(prev + 1, filteredCommands.length - 1))
          break
        case 'ArrowUp':
          e.preventDefault()
          setSelectedIndex(prev => Math.max(prev - 1, 0))
          break
        case 'Enter':
          e.preventDefault()
          if (filteredCommands[selectedIndex]) {
            executeCommand(filteredCommands[selectedIndex])
          }
          break
        case 'Escape':
          e.preventDefault()
          onClose()
          break
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, selectedIndex, filteredCommands, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start justify-center pt-32 z-50">
      <div className="bg-white rounded-lg shadow-2xl border border-gray-200 w-full max-w-2xl mx-4">
        {/* Search Input */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              placeholder="Type a command or search..."
              value={query}
              onChange={(e) => {
                setQuery(e.target.value)
                setSelectedIndex(0)
              }}
              className="w-full pl-10 pr-4 py-3 text-lg border-none focus:outline-none"
            />
          </div>
        </div>

        {/* Commands List */}
        <div className="max-h-96 overflow-y-auto">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Command className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>No commands found</p>
            </div>
          ) : (
            <div className="py-2">
              {filteredCommands.map((command, index) => (
                <button
                  key={command.id}
                  onClick={() => executeCommand(command)}
                  className={`w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition-colors ${
                    index === selectedIndex ? 'bg-blue-50 border-r-2 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <command.icon className={`w-5 h-5 ${
                      index === selectedIndex ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className="text-left">
                      <p className="font-medium text-gray-900">{command.label}</p>
                      <p className="text-sm text-gray-500">{command.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {command.shortcut && (
                      <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded font-mono">
                        {command.shortcut}
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-gray-300" />
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-gray-200 bg-gray-50 text-xs text-gray-500 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <span>↑↓ Navigate</span>
            <span>↵ Execute</span>
            <span>Esc Close</span>
          </div>
          <span>{filteredCommands.length} commands</span>
        </div>
      </div>
    </div>
  )
}

export default CommandPalette
