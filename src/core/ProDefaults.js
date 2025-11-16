// Pro-centric defaults with escape hatches
export const PRO_DEFAULTS = {
  editor: {
    // Opinionated but overridable
    theme: 'dark-pro', // Custom dark theme optimized for long sessions
    fontSize: 14,
    fontFamily: 'JetBrains Mono',
    lineHeight: 1.6,
    tabSize: 2,
    insertSpaces: true,
    wordWrap: 'bounded',
    minimap: false, // Reduces clutter
    scrollBeyondLastLine: false,
    cursorBlinking: 'smooth',
    renderWhitespace: 'selection',
    // Pro workflow defaults
    autoSave: 'afterDelay',
    autoSaveDelay: 1000,
    formatOnSave: true,
    formatOnPaste: true,
    trimTrailingWhitespace: true,
    insertFinalNewline: true
  },
  
  workspace: {
    // Smart layout that adapts to screen size
    sidebarCollapsed: false,
    panelPosition: 'bottom',
    terminalHeight: 200,
    explorerWidth: 240,
    // Zen mode for flow state
    zenMode: {
      hideSidebar: true,
      hideStatusBar: false,
      hideMenuBar: true,
      centerEditor: true
    }
  },

  ai: {
    // Intelligent assistance levels
    suggestionTrigger: 'smart', // Only when stuck or pattern detected
    contextWindow: 50, // Lines of context for AI
    autoRefactor: false, // Suggest but don't auto-apply
    codeReview: true,
    bugPrediction: true
  },

  performance: {
    // Zero-config performance optimization
    bundleAnalysis: true,
    hotReload: true,
    incrementalCompilation: true,
    memoryLimit: '2GB',
    cpuThrottling: false
  }
}

// Escape hatch system - users can override any default
export class ConfigOverride {
  constructor(userPrefs = {}) {
    this.config = { ...PRO_DEFAULTS, ...userPrefs }
  }

  override(path, value) {
    const keys = path.split('.')
    let current = this.config
    
    for (let i = 0; i < keys.length - 1; i++) {
      if (!current[keys[i]]) current[keys[i]] = {}
      current = current[keys[i]]
    }
    
    current[keys[keys.length - 1]] = value
    return this
  }

  get(path) {
    return path.split('.').reduce((obj, key) => obj?.[key], this.config)
  }
}

// Smart defaults that learn from user behavior
export const adaptiveDefaults = {
  learnFromUsage: (userActions) => {
    const patterns = analyzeUsagePatterns(userActions)
    return {
      preferredLanguages: patterns.topLanguages.slice(0, 3),
      workingHours: patterns.peakHours,
      projectStructure: patterns.commonFolderStructure,
      codeStyle: patterns.formattingPreferences
    }
  }
}

function analyzeUsagePatterns(actions) {
  // Analyze user behavior to suggest better defaults
  return {
    topLanguages: ['javascript', 'typescript', 'python'],
    peakHours: [14, 15, 16, 20, 21],
    commonFolderStructure: ['src/', 'components/', 'utils/', 'hooks/'],
    formattingPreferences: { semicolons: true, quotes: 'single' }
  }
}
