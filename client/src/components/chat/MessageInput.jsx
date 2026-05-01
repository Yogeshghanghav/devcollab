import { useState, useRef } from 'react'
import { PaperAirplaneIcon, FaceSmileIcon } from '@heroicons/react/24/outline'
import { useTyping } from '../../hooks/useTyping'

export default function MessageInput({ onSend, placeholder = 'Message…', channelId }) {
  const [text, setText]   = useState('')
  const { startTyping, stopTyping } = useTyping(channelId)
  const textareaRef = useRef(null)

  const handleChange = (e) => {
    setText(e.target.value)
    if (channelId) startTyping()
  }

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed) return
    onSend(trimmed)
    setText('')
    stopTyping()
    textareaRef.current?.focus()
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  return (
    <div className="px-4 pb-4 pt-2">
      <div className="flex items-end gap-2 bg-bg-elevated border border-bg-border rounded-xl px-3 py-2 focus-within:border-accent/50 transition-colors">
        <button className="text-text-muted hover:text-text-secondary transition-colors pb-1.5">
          <FaceSmileIcon className="w-5 h-5" />
        </button>
        <textarea
          ref={textareaRef}
          value={text}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onBlur={stopTyping}
          placeholder={placeholder}
          rows={1}
          className="flex-1 bg-transparent text-sm text-text-primary placeholder-text-muted resize-none outline-none py-1.5 max-h-32 leading-relaxed"
          style={{ scrollbarWidth: 'none' }}
        />
        <button
          onClick={handleSend}
          disabled={!text.trim()}
          className="flex-shrink-0 w-8 h-8 rounded-lg bg-accent hover:bg-accent-hover disabled:opacity-30 disabled:pointer-events-none flex items-center justify-center transition-all active:scale-90 mb-0.5"
        >
          <PaperAirplaneIcon className="w-4 h-4 text-white" />
        </button>
      </div>
      <p className="text-xs text-text-muted mt-1.5 px-1">
        <kbd className="font-mono">Enter</kbd> to send · <kbd className="font-mono">Shift+Enter</kbd> for new line
      </p>
    </div>
  )
}
