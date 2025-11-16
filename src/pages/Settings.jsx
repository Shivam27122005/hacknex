import React, { useState } from 'react'
import { useTheme } from '../context/ThemeContext'
import { 
  Settings as SettingsIcon,
  Monitor,
  Sun,
  Moon,
  Type,
  Code2,
  Keyboard,
  Save,
  Globe,
  Database,
  Shield,
  Key,
  Clock,
  Bot,
  Brain,
  Zap,
  Users,
  Share2,
  UserPlus,
  Eye,
  EyeOff,
  RotateCcw,
  Copy,
  Check,
  ChevronDown,
  ChevronRight,
  Palette,
  Heart
} from 'lucide-react'

const Settings = () => {
  // Active section state
  const [activeSection, setActiveSection] = useState('mode')
  
  // Unified theme system with mood integration
  const { 
    theme, 
    fontSize, 
    tabSize, 
    keyBinding, 
    autosave,
    focusMode,
    focusModes,
    currentMood,
    moods,
    changeMood,
    updateEditorSettings 
  } = useTheme()

  // Language & Environment
  const [languageSettings, setLanguageSettings] = useState({
    defaultLanguage: 'javascript',
    version: 'latest',
    environmentVariables: '{\n  "NODE_ENV": "development",\n  "API_URL": "https://api.hacknhex.com"\n}'
  })

  // Security & Access
  const [securitySettings, setSecuritySettings] = useState({
    twoFactorAuth: false,
    sessionTimeout: 30,
    apiKey: 'hnh_' + Math.random().toString(36).substring(2, 18),
    allowedDomains: 'localhost, *.hacknhex.com'
  })

  const [copiedApiKey, setCopiedApiKey] = useState(false)

  // AI & Coding Assistant
  const [aiSettings, setAiSettings] = useState({
    enabled: true,
    autocomplete: true,
    suggestions: true,
    model: 'gpt-4'
  })

  // Collaboration
  const [collaborationSettings, setCollaborationSettings] = useState({
    liveShare: true,
    defaultPermission: 'read',
    inviteEmail: ''
  })

  // Expanded sections for better UX
  const [expandedSections, setExpandedSections] = useState({})

  // Settings categories
  const categories = [
    { id: 'mode', label: 'Mode', icon: Palette },
    { id: 'editor', label: 'Editor Preferences', icon: Monitor },
    { id: 'language', label: 'Language & Environment', icon: Globe },
    { id: 'security', label: 'Security & Access', icon: Shield },
    { id: 'ai', label: 'AI & Coding Assistant', icon: Bot },
    { id: 'collaboration', label: 'Collaboration', icon: Users }
  ]

  // Handlers
  const handleEditorChange = (setting, value) => {
    updateEditorSettings({ [setting]: value })
  }

  // Get current editor settings from theme context
  const editorSettings = {
    theme,
    fontSize,
    tabSize,
    keyBinding,
    autosave,
    focusMode
  }

  const handleLanguageChange = (key, value) => {
    setLanguageSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSecurityChange = (key, value) => {
    setSecuritySettings(prev => ({ ...prev, [key]: value }))
  }

  const handleAiChange = (key, value) => {
    setAiSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleCollaborationChange = (key, value) => {
    setCollaborationSettings(prev => ({ ...prev, [key]: value }))
  }

  const generateNewApiKey = () => {
    const newKey = 'hnh_' + Math.random().toString(36).substring(2, 18)
    handleSecurityChange('apiKey', newKey)
  }

  const copyApiKey = async () => {
    try {
      await navigator.clipboard.writeText(securitySettings.apiKey)
      setCopiedApiKey(true)
      setTimeout(() => setCopiedApiKey(false), 2000)
    } catch (err) {
      console.error('Failed to copy API key')
    }
  }

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }))
  }

  // Settings sections components
  const ModeSection = () => (
    <div className="space-y-6">
      {/* Theme Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-900">Theme</label>
          <p className="text-sm text-gray-500">Choose your preferred display theme</p>
        </div>
        <div className="flex bg-gray-100 rounded-lg p-1">
          <button
            onClick={() => handleEditorChange('theme', 'light')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              editorSettings.theme === 'light' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Light</span>
          </button>
          <button
            onClick={() => handleEditorChange('theme', 'dark')}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              editorSettings.theme === 'dark' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Dark</span>
          </button>
        </div>
      </div>

      {/* Focus Mode */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="text-sm font-medium text-gray-900">Focus Mode</label>
            <p className="text-sm text-gray-500">Change display tone for better focus</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(focusModes).map(([mode, config]) => (
            <button
              key={mode}
              onClick={() => handleEditorChange('focusMode', mode)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                focusMode === mode
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
              style={{
                backgroundColor: focusMode === mode && config.bg ? config.bg : undefined,
                borderColor: focusMode === mode && config.accent ? config.accent : undefined
              }}
            >
              <span className="text-lg">{
                mode === 'normal' ? '🔧' :
                mode === 'focused' ? '🎯' :
                mode === 'creative' ? '🎨' :
                mode === 'energized' ? '⚡' :
                mode === 'calm' ? '🌧️' :
                mode === 'night' ? '🦉' : '🔧'
              }</span>
              <span className="capitalize">{mode}</span>
            </button>
          ))}
        </div>
        {focusMode !== 'normal' && (
          <div className="mt-2 p-2 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Active:</span> {focusModes[focusMode]?.description || 'Enhanced focus mode'}
            </p>
          </div>
        )}
      </div>

      {/* Mood Selection */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="text-sm font-medium text-gray-900">How are you feeling?</label>
            <p className="text-sm text-gray-500">Set your mood to personalize the experience</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(moods).map(([mood, config]) => (
            <button
              key={mood}
              onClick={() => changeMood(mood)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentMood === mood
                  ? 'border-2 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
              style={{
                backgroundColor: currentMood === mood ? config.colors.primary + '20' : undefined,
                borderColor: currentMood === mood ? config.colors.primary : undefined,
                color: currentMood === mood ? config.colors.primary : undefined
              }}
            >
              <span className="text-lg">{config.emoji}</span>
              <span className="capitalize">{config.name}</span>
            </button>
          ))}
        </div>
        {currentMood !== 'neutral' && (
          <div className="mt-2 p-2 rounded-lg border" style={{
            backgroundColor: moods[currentMood]?.colors.primary + '10',
            borderColor: moods[currentMood]?.colors.primary + '30'
          }}>
            <p className="text-xs" style={{ color: moods[currentMood]?.colors.primary }}>
              <span className="font-medium">Current mood:</span> {moods[currentMood]?.name} - Theme: {moods[currentMood]?.theme}, Focus: {moods[currentMood]?.focusMode}
            </p>
          </div>
        )}
      </div>
    </div>
  )

  const EditorPreferencesSection = () => (
    <div className="space-y-6">

      {/* Font Size */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="text-sm font-medium text-gray-900">Font Size</label>
            <p className="text-sm text-gray-500">Adjust editor font size</p>
          </div>
          <span className="text-sm font-medium text-gray-900">{editorSettings.fontSize}px</span>
        </div>
        <input
          type="range"
          min="10"
          max="24"
          value={editorSettings.fontSize}
          onChange={(e) => handleEditorChange('fontSize', parseInt(e.target.value))}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
        />
        <div className="flex justify-between text-xs text-gray-500 mt-1">
          <span>10px</span>
          <span>24px</span>
        </div>
      </div>

      {/* Tab Size */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Tab Size</label>
        <select
          value={editorSettings.tabSize}
          onChange={(e) => handleEditorChange('tabSize', parseInt(e.target.value))}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={2}>2 spaces</option>
          <option value={4}>4 spaces</option>
          <option value={8}>8 spaces</option>
        </select>
      </div>

      {/* Focus Mode */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <div>
            <label className="text-sm font-medium text-gray-900">Focus Mode</label>
            <p className="text-sm text-gray-500">Change display tone for better focus</p>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {Object.entries(focusModes).map(([mode, config]) => (
            <button
              key={mode}
              onClick={() => handleEditorChange('focusMode', mode)}
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                focusMode === mode
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-300 shadow-sm'
                  : 'bg-gray-50 text-gray-700 border border-gray-200 hover:bg-gray-100'
              }`}
              style={{
                backgroundColor: focusMode === mode && config.bg ? config.bg : undefined,
                borderColor: focusMode === mode && config.accent ? config.accent : undefined
              }}
            >
              <span className="text-lg">{
                mode === 'normal' ? '🔧' :
                mode === 'focused' ? '🎯' :
                mode === 'creative' ? '🎨' :
                mode === 'energized' ? '⚡' :
                mode === 'calm' ? '🌧️' :
                mode === 'night' ? '🦉' : '🔧'
              }</span>
              <span className="capitalize">{mode}</span>
            </button>
          ))}
        </div>
        {focusMode !== 'normal' && (
          <div className="mt-2 p-2 rounded-lg bg-gray-50 border border-gray-200">
            <p className="text-xs text-gray-600">
              <span className="font-medium">Active:</span> {
                focusMode === 'focused' ? 'Deep focus with blue tone' :
                focusMode === 'creative' ? 'Creative flow with purple tone' :
                focusMode === 'energized' ? 'High energy with yellow tone' :
                focusMode === 'calm' ? 'Calm coding with green tone' :
                focusMode === 'night' ? 'Night mode with indigo tone' : ''
              }
            </p>
          </div>
        )}
      </div>

      {/* Keybinding Mode */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Keybinding Mode</label>
        <div className="grid grid-cols-3 gap-2">
          {['default', 'vim', 'emacs'].map((mode) => (
            <button
              key={mode}
              onClick={() => handleEditorChange('keyBinding', mode)}
              className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                editorSettings.keyBinding === mode
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {mode.charAt(0).toUpperCase() + mode.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Autosave */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-900">Autosave</label>
          <p className="text-sm text-gray-500">Automatically save your code changes</p>
        </div>
        <button
          onClick={() => handleEditorChange('autosave', !editorSettings.autosave)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            editorSettings.autosave ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              editorSettings.autosave ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  )

  const LanguageEnvironmentSection = () => (
    <div className="space-y-6">
      {/* Default Language */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Default Language</label>
        <select
          value={languageSettings.defaultLanguage}
          onChange={(e) => handleLanguageChange('defaultLanguage', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="java">Java</option>
          <option value="cpp">C++</option>
          <option value="go">Go</option>
          <option value="rust">Rust</option>
          <option value="typescript">TypeScript</option>
        </select>
      </div>

      {/* Version Selector */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Language Version</label>
        <select
          value={languageSettings.version}
          onChange={(e) => handleLanguageChange('version', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="latest">Latest</option>
          <option value="stable">Stable</option>
          <option value="lts">LTS</option>
        </select>
      </div>

      {/* Environment Variables */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Environment Variables</label>
        <p className="text-sm text-gray-500 mb-3">Configure environment variables in JSON format</p>
        <textarea
          value={languageSettings.environmentVariables}
          onChange={(e) => handleLanguageChange('environmentVariables', e.target.value)}
          rows={6}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
          placeholder='{\n  "NODE_ENV": "development"\n}'
        />
      </div>
    </div>
  )

  const SecurityAccessSection = () => (
    <div className="space-y-6">
      {/* 2FA Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-900">Two-Factor Authentication</label>
          <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
        </div>
        <button
          onClick={() => handleSecurityChange('twoFactorAuth', !securitySettings.twoFactorAuth)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            securitySettings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              securitySettings.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* API Key */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">API Key</label>
        <p className="text-sm text-gray-500 mb-3">Use this key to access Hack'nhex API</p>
        <div className="flex items-center space-x-2">
          <div className="flex-1 relative">
            <input
              type={securitySettings.showApiKey ? 'text' : 'password'}
              value={securitySettings.apiKey}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 font-mono text-sm"
            />
            <button
              onClick={() => handleSecurityChange('showApiKey', !securitySettings.showApiKey)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {securitySettings.showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <button
            onClick={copyApiKey}
            className="px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors flex items-center space-x-2"
          >
            {copiedApiKey ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            <span>{copiedApiKey ? 'Copied!' : 'Copy'}</span>
          </button>
          <button
            onClick={generateNewApiKey}
            className="px-3 py-2 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors flex items-center space-x-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Regenerate</span>
          </button>
        </div>
      </div>

      {/* Session Timeout */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Session Timeout</label>
        <select
          value={securitySettings.sessionTimeout}
          onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="1">1 hour</option>
          <option value="8">8 hours</option>
          <option value="24">24 hours</option>
          <option value="168">1 week</option>
          <option value="never">Never</option>
        </select>
      </div>
    </div>
  )

  const AiCodingAssistantSection = () => (
    <div className="space-y-6">
      {/* AI Suggestions Toggle */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-900">AI Suggestions</label>
          <p className="text-sm text-gray-500">Get intelligent code suggestions while coding</p>
        </div>
        <button
          onClick={() => handleAiChange('aiSuggestions', !aiSettings.aiSuggestions)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            aiSettings.aiSuggestions ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              aiSettings.aiSuggestions ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Skill Level */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Skill Level</label>
        <p className="text-sm text-gray-500 mb-3">Adjust AI assistance based on your experience</p>
        <div className="grid grid-cols-3 gap-2">
          {['beginner', 'intermediate', 'expert'].map((level) => (
            <button
              key={level}
              onClick={() => handleAiChange('skillLevel', level)}
              className={`px-3 py-2 text-sm font-medium rounded-lg border transition-colors ${
                aiSettings.skillLevel === level
                  ? 'bg-blue-50 border-blue-200 text-blue-700'
                  : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'
              }`}
            >
              {level.charAt(0).toUpperCase() + level.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Code Autocomplete */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-900">Code Autocomplete</label>
          <p className="text-sm text-gray-500">Enable smart code completion</p>
        </div>
        <button
          onClick={() => handleAiChange('autocomplete', !aiSettings.autocomplete)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            aiSettings.autocomplete ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              aiSettings.autocomplete ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  )

  const CollaborationSection = () => (
    <div className="space-y-6">
      {/* Live Share */}
      <div className="flex items-center justify-between">
        <div>
          <label className="text-sm font-medium text-gray-900">Live Share</label>
          <p className="text-sm text-gray-500">Allow real-time collaboration on your code</p>
        </div>
        <button
          onClick={() => handleCollaborationChange('liveShare', !collaborationSettings.liveShare)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            collaborationSettings.liveShare ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              collaborationSettings.liveShare ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      {/* Default Permission */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Default Permission</label>
        <select
          value={collaborationSettings.defaultPermission}
          onChange={(e) => handleCollaborationChange('defaultPermission', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value="read">Read Only</option>
          <option value="write">Read & Write</option>
          <option value="admin">Admin</option>
        </select>
      </div>

      {/* Invite User */}
      <div>
        <label className="block text-sm font-medium text-gray-900 mb-2">Invite Collaborator</label>
        <div className="flex items-center space-x-2">
          <input
            type="email"
            value={collaborationSettings.inviteEmail}
            onChange={(e) => handleCollaborationChange('inviteEmail', e.target.value)}
            placeholder="Enter email address"
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
            <UserPlus className="w-4 h-4" />
            <span>Invite</span>
          </button>
        </div>
      </div>
    </div>
  )

  const renderSection = () => {
    switch (activeSection) {
      case 'mode':
        return <ModeSection />
      case 'editor':
        return <EditorPreferencesSection />
      case 'language':
        return <LanguageEnvironmentSection />
      case 'security':
        return <SecurityAccessSection />
      case 'ai':
        return <AiCodingAssistantSection />
      case 'collaboration':
        return <CollaborationSection />
      default:
        return <ModeSection />
    }
  }

  return (
    <div className="max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Customize your Hack'nhex coding experience</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
            <nav className="space-y-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveSection(category.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                    activeSection === category.id
                      ? 'bg-blue-50 text-blue-700 border border-blue-200'
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                >
                  <category.icon className="w-5 h-5" />
                  <span className="text-sm font-medium">{category.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center space-x-3 mb-6">
              {(() => {
                const activeCategory = categories.find(cat => cat.id === activeSection)
                if (activeCategory && activeCategory.icon) {
                  const IconComponent = activeCategory.icon
                  return <IconComponent className="w-6 h-6 text-blue-600" />
                }
                return null
              })()}
              <h2 className="text-xl font-semibold text-gray-900">
                {categories.find(cat => cat.id === activeSection)?.label}
              </h2>
            </div>
            
            {renderSection()}

            {/* Save Button */}
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">Changes are saved automatically</p>
                <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                  <Save className="w-4 h-4" />
                  <span>Save All Changes</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Settings
