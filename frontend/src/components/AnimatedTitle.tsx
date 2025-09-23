"use client"

import React, { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"

class TextScramble {
  el: HTMLElement
  chars: string
  queue: Array<{
    from: string
    to: string
    start: number
    end: number
    char?: string
  }>
  frame: number
  frameRequest: number
  resolve: (value: void | PromiseLike<void>) => void

  constructor(el: HTMLElement) {
    this.el = el
    this.chars = 'АБВГДЕЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯ!<>-_\\/[]{}—=+*^?#'
    this.queue = []
    this.frame = 0
    this.frameRequest = 0
    this.resolve = () => {}
    this.update = this.update.bind(this)
  }

  setText(newText: string) {
    const oldText = this.el.innerText
    const length = Math.max(oldText.length, newText.length)
    const promise = new Promise<void>((resolve) => this.resolve = resolve)
    this.queue = []
    
    for (let i = 0; i < length; i++) {
      const from = oldText[i] || ''
      const to = newText[i] || ''
      const start = Math.floor(Math.random() * 40)
      const end = start + Math.floor(Math.random() * 40)
      this.queue.push({ from, to, start, end })
    }
    
    cancelAnimationFrame(this.frameRequest)
    this.frame = 0
    this.update()
    return promise
  }

  update() {
    let output = ''
    let complete = 0
    
    for (let i = 0, n = this.queue.length; i < n; i++) {
      let { from, to, start, end, char } = this.queue[i]
      if (this.frame >= end) {
        complete++
        output += to
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)]
          this.queue[i].char = char
        }
        output += `<span class="dud">${char}</span>`
      } else {
        output += from
      }
    }
    
    this.el.innerHTML = output
    
    if (complete === this.queue.length) {
      this.resolve()
    } else {
      this.frameRequest = requestAnimationFrame(this.update)
      this.frame++
    }
  }
}

const ScrambledTitle: React.FC = () => {
  const elementRef = useRef<HTMLHeadingElement>(null)
  const scramblerRef = useRef<TextScramble | null>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    if (elementRef.current && !scramblerRef.current) {
      scramblerRef.current = new TextScramble(elementRef.current)
      setMounted(true)
    }
  }, [])

  useEffect(() => {
    if (mounted && scramblerRef.current) {
      const phrases = [
        'АЛАБУГА.TECH',
        'ВЫШЕ НАС',
        'ТОЛЬКО',
        'ЗВЁЗДЫ',
        'TECH - ВСЕЛЕННАЯ',
        'TECH -БУДУЩЕЕ',
        'TECH - ТЕХНОЛОГИИ',
        'TECH - ИННОВАЦИИ'
      ]
      
      let counter = 0
      const next = () => {
        if (scramblerRef.current) {
          scramblerRef.current.setText(phrases[counter]).then(() => {
            setTimeout(next, 3000)
          })
          counter = (counter + 1) % phrases.length
        }
      }

      next()
    }
  }, [mounted])

  return (
    <h1 
      ref={elementRef}
      className="text-white text-lg sm:text-2xl font-bold tracking-wider font-mono"
      style={{ 
        textShadow: '0 0 20px #00ffff, 0 0 40px #00ffff, 0 0 60px #00ffff',
        minHeight: '1.5em',
        display: 'block',
        color: 'white'
      }}
    >
      АЛАБУГА.TECH
    </h1>
  )
}

const AnimatedTitle: React.FC = () => {
  return (
    <div className="relative">
      <ScrambledTitle />

      <style dangerouslySetInnerHTML={{
        __html: `
          .dud {
            color: #00ffff !important;
            opacity: 0.8;
            text-shadow: 0 0 5px #00ffff;
          }
          
          @keyframes neon-flicker {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.8; }
          }
        `
      }} />
    </div>
  )
}

export default AnimatedTitle
