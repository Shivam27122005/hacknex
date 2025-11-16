import React, { createContext, useContext, useState, useEffect, useRef } from 'react'

const FocusAudioContext = createContext()

export const useFocusAudio = () => {
  const context = useContext(FocusAudioContext)
  if (!context) {
    throw new Error('useFocusAudio must be used within a FocusAudioProvider')
  }
  return context
}

export const FocusAudioProvider = ({ children }) => {
  const [isEnabled, setIsEnabled] = useState(false)
  const [currentMode, setCurrentMode] = useState('focused')
  const [volume, setVolume] = useState(0.3)
  const audioRef = useRef(null)
  const oscillatorRef = useRef(null)
  const audioContextRef = useRef(null)

  // Focus mode audio profiles
  const audioProfiles = {
    focused: {
      name: 'Deep Focus',
      description: 'Brown noise with subtle binaural beats',
      frequency: 40, // Hz - gamma waves for focus
      color: 'brown',
      icon: '🎯'
    },
    creative: {
      name: 'Creative Flow',
      description: 'Alpha waves with nature sounds',
      frequency: 10, // Hz - alpha waves for creativity
      color: 'pink',
      icon: '🎨'
    },
    energized: {
      name: 'High Energy',
      description: 'Upbeat ambient with beta waves',
      frequency: 20, // Hz - beta waves for alertness
      color: 'white',
      icon: '⚡'
    },
    calm: {
      name: 'Calm Coding',
      description: 'Theta waves with rain sounds',
      frequency: 6, // Hz - theta waves for calm focus
      color: 'blue',
      icon: '🌧️'
    },
    night: {
      name: 'Night Owl',
      description: 'Delta waves with soft ambient',
      frequency: 2, // Hz - delta waves for deep concentration
      color: 'purple',
      icon: '🦉'
    }
  }

  // Generate binaural beats and ambient sounds
  const generateFocusAudio = (profile) => {
    if (!audioContextRef.current) {
      audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)()
    }

    const audioContext = audioContextRef.current
    
    // Create oscillators for binaural beats
    const leftOscillator = audioContext.createOscillator()
    const rightOscillator = audioContext.createOscillator()
    
    // Create gain nodes for volume control
    const leftGain = audioContext.createGain()
    const rightGain = audioContext.createGain()
    const masterGain = audioContext.createGain()
    
    // Create stereo panner
    const leftPanner = audioContext.createStereoPanner()
    const rightPanner = audioContext.createStereoPanner()
    
    // Set frequencies for binaural beats
    const baseFreq = 200 // Base frequency
    leftOscillator.frequency.setValueAtTime(baseFreq, audioContext.currentTime)
    rightOscillator.frequency.setValueAtTime(baseFreq + profile.frequency, audioContext.currentTime)
    
    // Set oscillator types based on profile
    const waveType = profile.color === 'brown' ? 'sawtooth' : 
                    profile.color === 'pink' ? 'triangle' :
                    profile.color === 'white' ? 'square' : 'sine'
    
    leftOscillator.type = waveType
    rightOscillator.type = waveType
    
    // Set panning
    leftPanner.pan.setValueAtTime(-1, audioContext.currentTime)
    rightPanner.pan.setValueAtTime(1, audioContext.currentTime)
    
    // Set volumes
    leftGain.gain.setValueAtTime(volume * 0.1, audioContext.currentTime)
    rightGain.gain.setValueAtTime(volume * 0.1, audioContext.currentTime)
    masterGain.gain.setValueAtTime(volume, audioContext.currentTime)
    
    // Connect nodes
    leftOscillator.connect(leftGain)
    rightOscillator.connect(rightGain)
    leftGain.connect(leftPanner)
    rightGain.connect(rightPanner)
    leftPanner.connect(masterGain)
    rightPanner.connect(masterGain)
    masterGain.connect(audioContext.destination)
    
    // Start oscillators
    leftOscillator.start()
    rightOscillator.start()
    
    // Store reference for cleanup
    oscillatorRef.current = { leftOscillator, rightOscillator, masterGain }
    
    return { leftOscillator, rightOscillator, masterGain }
  }

  // Start focus audio
  const startFocusAudio = (mode = 'focused') => {
    if (oscillatorRef.current) {
      stopFocusAudio()
    }

    const profile = audioProfiles[mode]
    if (profile) {
      generateFocusAudio(profile)
      setCurrentMode(mode)
      setIsEnabled(true)
    }
  }

  // Stop focus audio
  const stopFocusAudio = () => {
    if (oscillatorRef.current) {
      try {
        oscillatorRef.current.leftOscillator.stop()
        oscillatorRef.current.rightOscillator.stop()
      } catch (e) {
        // Oscillators already stopped
      }
      oscillatorRef.current = null
    }
    setIsEnabled(false)
  }

  // Change volume
  const changeVolume = (newVolume) => {
    setVolume(newVolume)
    if (oscillatorRef.current && oscillatorRef.current.masterGain) {
      oscillatorRef.current.masterGain.gain.setValueAtTime(
        newVolume, 
        audioContextRef.current.currentTime
      )
    }
  }

  // Switch mode
  const switchMode = (mode) => {
    if (isEnabled) {
      stopFocusAudio()
      setTimeout(() => startFocusAudio(mode), 100)
    } else {
      setCurrentMode(mode)
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopFocusAudio()
      if (audioContextRef.current) {
        audioContextRef.current.close()
      }
    }
  }, [])

  // Load saved preferences
  useEffect(() => {
    const savedMode = localStorage.getItem('focusAudioMode')
    const savedVolume = localStorage.getItem('focusAudioVolume')
    const savedEnabled = localStorage.getItem('focusAudioEnabled')

    if (savedMode && audioProfiles[savedMode]) {
      setCurrentMode(savedMode)
    }
    if (savedVolume) {
      setVolume(parseFloat(savedVolume))
    }
    if (savedEnabled === 'true') {
      setIsEnabled(true)
    }
  }, [])

  // Save preferences
  useEffect(() => {
    localStorage.setItem('focusAudioMode', currentMode)
    localStorage.setItem('focusAudioVolume', volume.toString())
    localStorage.setItem('focusAudioEnabled', isEnabled.toString())
  }, [currentMode, volume, isEnabled])

  const value = {
    isEnabled,
    currentMode,
    volume,
    audioProfiles,
    startFocusAudio,
    stopFocusAudio,
    changeVolume,
    switchMode,
    toggleAudio: () => isEnabled ? stopFocusAudio() : startFocusAudio(currentMode)
  }

  return (
    <FocusAudioContext.Provider value={value}>
      {children}
    </FocusAudioContext.Provider>
  )
}
