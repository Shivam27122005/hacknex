 

### Method 1: Browser Console Commands
Open browser console (F12) and use these commands:

```javascript
// Switch themes instantly
demoFunctions.switchTheme('blue')    // Professional blue
demoFunctions.switchTheme('green')   // Nature green  
demoFunctions.switchTheme('purple')  // Creative purple
demoFunctions.switchTheme('orange')  // Energetic orange
demoFunctions.switchTheme('pink')    // Elegant pink

// Switch moods for animations
demoFunctions.switchMood('excited')     // High energy pulse
demoFunctions.switchMood('focused')     // Steady concentration
demoFunctions.switchMood('creative')    // Flowing inspiration
demoFunctions.switchMood('productive')  // Efficient rhythm

// Cycle through all themes
demoFunctions.cycleThemes()

// Reset to default
demoFunctions.resetToDefault()

// Show all options
demoFunctions.showOptions()
```

### Method 2: HTML Data Attributes
Add to any element for instant theme change:
```html
<div data-theme="green">   <!-- Changes to green theme -->
<div data-theme="purple">  <!-- Changes to purple theme -->
```

## 🧩 Component Classes (Tailwind-Based)

### Buttons
```jsx
// Primary button (adapts to current theme)
<button className="btn-primary">Click Me</button>

// Other button variants
<button className="btn-secondary">Secondary</button>
<button className="btn-success">Success</button>
<button className="btn-danger">Danger</button>

// Button sizes
<button className="btn-primary btn-sm">Small</button>
<button className="btn-primary btn-lg">Large</button>
```

### Cards
```jsx
// Basic card
<div className="card">
  <div className="card-header">
    <h3 className="card-title">Title</h3>
    <p className="card-subtitle">Subtitle</p>
  </div>
  <div className="card-body">Content here</div>
  <div className="card-footer">Footer content</div>
</div>

// Card variants
<div className="card card-elevated">Elevated shadow</div>
<div className="card card-compact">Less padding</div>
```

### Forms
```jsx
// Form group with label and input
<div className="form-group">
  <label className="form-label">Email</label>
  <input className="form-input" type="email" />
  <p className="form-help">Helper text</p>
</div>

// Input with icon
<div className="input-with-icon">
  <Mail className="input-icon-left" />
  <input className="form-input input-with-left-icon" />
</div>

// Error state
<input className="form-input form-input-error" />
<p className="form-error">Error message</p>
```

### Navigation
```jsx
// Navbar
<nav className="navbar">
  <div className="navbar-container">
    <div className="navbar-content">
      <div className="navbar-brand">Brand</div>
      <div className="navbar-nav">
        <a className="nav-link nav-link-active">Active</a>
        <a className="nav-link">Link</a>
      </div>
    </div>
  </div>
</nav>

// Sidebar
<aside className="sidebar">
  <div className="sidebar-header">Header</div>
  <nav className="sidebar-nav">
    <a className="sidebar-link sidebar-link-active">
      <Icon className="sidebar-icon" />
      Active Link
    </a>
  </nav>
</aside>
```

## 🎭 Demo Classes for Quick Changes

### Quick Style Modifiers
```jsx
// Make text larger for better visibility
<div className="demo-large-text">Larger text</div>

// Make text bold
<div className="demo-bold-text">Bold text</div>

// More rounded corners
<div className="demo-rounded-more">More rounded</div>

// Enhanced shadow
<div className="demo-shadow-more">Enhanced shadow</div>

// Hover effects
<div className="demo-hover-scale">Scales on hover</div>
<div className="demo-hover-rotate">Rotates on hover</div>
```

### Animation Classes
```jsx
// Entrance animations
<div className="demo-fade-in">Fades in</div>
<div className="demo-slide-up">Slides up</div>
<div className="demo-bounce">Bounces</div>
<div className="demo-pulse">Pulses</div>
```

### Layout Helpers
```jsx
// Responsive grids
<div className="demo-grid-2">2 columns on desktop</div>
<div className="demo-grid-3">3 columns on desktop</div>
<div className="demo-grid-4">4 columns on desktop</div>

// Flexbox layouts
<div className="demo-flex-center">Centered content</div>
<div className="demo-flex-between">Space between</div>
<div className="demo-flex-col-center">Column centered</div>
```

 

### 1. Start with Default Theme
```javascript
demoFunctions.resetToDefault()
```

### 2. Show Theme Switching
```javascript
// Demonstrate different themes
demoFunctions.switchTheme('blue')    // "Professional look"
demoFunctions.switchTheme('green')   // "Eco-friendly theme"
demoFunctions.switchTheme('purple')  // "Creative theme"
```

### 3. Show Mood Animations
```javascript
// Demonstrate mood-based animations
demoFunctions.switchMood('excited')     // "High energy mode"
demoFunctions.switchMood('focused')     // "Concentration mode"
demoFunctions.switchMood('productive')  // "Work mode"
```

### 4. Demonstrate Responsive Design
- Resize browser window to show responsive behavior
- Use browser dev tools to simulate mobile devices

### 5. Show Component Variations
- Change button classes live: `btn-primary` → `btn-success` → `btn-danger`
- Modify card classes: `card` → `card card-elevated` → `card card-compact`

## 📁 File Organization

```
src/
├── styles/
│   ├── tailwind-components.css  # Main component classes
│   ├── demo-themes.css         # Theme switching utilities
│   └── mood-animations.css     # Mood-based animations
├── components/
│   └── ui/
│       └── LoginForm.jsx       # Restructured component example
├── utils/
│   └── themeUtils.js          # Theme switching functions
└── index.css                  # Main CSS imports
```

## 🚀 Quick Demo Script for Teacher

1. **Open browser console** (F12)
2. **Type**: `demoFunctions.showOptions()` to see all commands
3. **Switch themes**: `demoFunctions.switchTheme('green')`
4. **Change mood**: `demoFunctions.switchMood('excited')`
5. **Cycle themes**: `demoFunctions.cycleThemes()`
6. **Reset**: `demoFunctions.resetToDefault()`

## 💡 Key Benefits

- **Organized**: Clear separation of concerns
- **Maintainable**: Easy to modify and extend
- **Demonstrable**: Quick theme/mood switching
- **Professional**: Clean, modern Tailwind-based design
- **Responsive**: Works on all device sizes
- **Accessible**: Proper focus states and ARIA labels

## 🔧 Customization

### Adding New Themes
1. Add theme colors to `tailwind.config.js`
2. Add theme utilities to `demo-themes.css`
3. Update `DEMO_THEMES` in `themeUtils.js`

### Adding New Components
1. Create component class in `tailwind-components.css`
2. Use consistent naming: `.component-variant`
3. Include hover and focus states
4. Add responsive variants if needed

This system makes it incredibly easy to demonstrate your coding skills and design flexibility to your teacher!
