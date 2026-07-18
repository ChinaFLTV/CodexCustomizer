import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react'

interface CssEditorProps {
  value: string
  onChange: (value: string) => void
  placeholder?: string
  minHeight?: number
  readOnly?: boolean
}

/**
 * Lightweight CSS editor with line numbers + basic tab support.
 * Avoids pulling Monaco for a small surface area.
 */
export function CssEditor({
  value,
  onChange,
  placeholder,
  minHeight = 280,
  readOnly = false
}: CssEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const gutterRef = useRef<HTMLDivElement>(null)
  const [lineCount, setLineCount] = useState(1)

  useEffect(() => {
    const lines = value.length === 0 ? 1 : value.split('\n').length
    setLineCount(Math.max(lines, 1))
  }, [value])

  const gutter = useMemo(
    () =>
      Array.from({ length: lineCount }, (_, i) => (
        <div key={i} className="css-editor-line-no">
          {i + 1}
        </div>
      )),
    [lineCount]
  )

  function syncScroll() {
    if (textareaRef.current && gutterRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop
    }
  }

  function handleKeyDown(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key !== 'Tab' || readOnly) return
    e.preventDefault()
    const el = e.currentTarget
    const start = el.selectionStart
    const end = el.selectionEnd
    const next = value.slice(0, start) + '  ' + value.slice(end)
    onChange(next)
    requestAnimationFrame(() => {
      el.selectionStart = el.selectionEnd = start + 2
    })
  }

  return (
    <div className="css-editor" style={{ minHeight }}>
      <div className="css-editor-gutter" ref={gutterRef} aria-hidden>
        {gutter}
      </div>
      <textarea
        ref={textareaRef}
        className="css-editor-input"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onScroll={syncScroll}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        spellCheck={false}
        readOnly={readOnly}
        wrap="off"
        aria-label="CSS editor"
      />
    </div>
  )
}
