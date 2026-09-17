import { useState } from 'react'
import type { AppProps } from '../core/types'

type Op = '+' | '−' | '×' | '÷'

interface Calc {
  cur: string
  acc: number | null
  op: Op | null
  fresh: boolean
  err: boolean
}

const compute = (a: number, b: number, op: Op): number | null => {
  switch (op) {
    case '+':
      return a + b
    case '−':
      return a - b
    case '×':
      return a * b
    case '÷':
      return b === 0 ? null : a / b
  }
}

const fmt = (n: number) => {
  if (!isFinite(n)) return 'Error'
  const s = Math.abs(n) >= 1e12 ? n.toExponential(6) : String(+n.toFixed(10))
  return s
}

/** Windows 10 standard calculator (fully functional). */
export default function CalculatorApp(_props: AppProps) {
  const [s, setS] = useState<Calc>({
    cur: '0',
    acc: null,
    op: null,
    fresh: true,
    err: false,
  })

  const set = (p: Partial<Calc>) => setS((v) => ({ ...v, ...p }))

  const digit = (d: string) => {
    if (s.err) set({ cur: d, err: false, acc: null, op: null, fresh: false })
    else if (s.fresh) set({ cur: d === '.' ? '0.' : d, fresh: false })
    else if (d === '.' && s.cur.includes('.')) return
    else if (s.cur.replace(/[-.]/g, '').length < 16)
      set({ cur: s.cur === '0' && d !== '.' ? d : s.cur + d })
  }

  const unary = (f: (n: number) => number | null) => {
    const v = f(parseFloat(s.cur))
    if (v === null || !isFinite(v)) set({ err: true, cur: 'Cannot divide by zero' })
    else set({ cur: fmt(v), fresh: true })
  }

  const applyOp = (op: Op) => {
    if (s.err) return
    const v = parseFloat(s.cur)
    if (s.acc !== null && s.op && !s.fresh) {
      const r = compute(s.acc, v, s.op)
      if (r === null) {
        set({ err: true, cur: 'Cannot divide by zero' })
        return
      }
      set({ acc: r, op, fresh: true, cur: fmt(r) })
    } else {
      set({ acc: v, op, fresh: true })
    }
  }

  const equals = () => {
    if (s.err || s.op === null || s.acc === null) return
    const r = compute(s.acc, parseFloat(s.cur), s.op)
    if (r === null) set({ err: true, cur: 'Cannot divide by zero' })
    else set({ cur: fmt(r), acc: null, op: null, fresh: true })
  }

  const history =
    s.acc !== null && s.op ? `${fmt(s.acc)} ${s.op}` : ''

  const btn = (label: string, fn: () => void, kind: 'num' | 'op' | 'eq' = 'num') => (
    <button
      key={label}
      className={`flex h-full items-center justify-center text-[15px] ${
        kind === 'eq'
          ? 'bg-[#d5e8f7] hover:bg-[#0078d7] hover:text-white'
          : kind === 'op'
            ? 'bg-[#f0f0f0] text-[13px] hover:bg-[#e0e0e0]'
            : 'bg-white font-medium hover:bg-[#ececec]'
      } active:bg-[#c3dbea]`}
      onClick={fn}
    >
      {label}
    </button>
  )

  type KeyDef = [label: string, fn: () => void, kind?: 'num' | 'op' | 'eq']
  const keys: KeyDef[] = [
    ['%', () => unary((n) => (s.acc !== null ? (s.acc * n) / 100 : 0)), 'op'],
    ['CE', () => set({ cur: '0', fresh: true, err: false }), 'op'],
    ['C', () => set({ cur: '0', acc: null, op: null, fresh: true, err: false }), 'op'],
    ['⌫', () => !s.fresh && set({ cur: s.cur.length > 1 ? s.cur.slice(0, -1) : '0' }), 'op'],
    ['1/x', () => unary((n) => (n === 0 ? null : 1 / n)), 'op'],
    ['x²', () => unary((n) => n * n), 'op'],
    ['√', () => unary((n) => (n < 0 ? null : Math.sqrt(n))), 'op'],
    ['÷', () => applyOp('÷'), 'op'],
    ['7', () => digit('7')],
    ['8', () => digit('8')],
    ['9', () => digit('9')],
    ['×', () => applyOp('×'), 'op'],
    ['4', () => digit('4')],
    ['5', () => digit('5')],
    ['6', () => digit('6')],
    ['−', () => applyOp('−'), 'op'],
    ['1', () => digit('1')],
    ['2', () => digit('2')],
    ['3', () => digit('3')],
    ['+', () => applyOp('+'), 'op'],
    ['±', () => set({ cur: s.cur.startsWith('-') ? s.cur.slice(1) : `-${s.cur}` }), 'op'],
    ['0', () => digit('0')],
    ['.', () => digit('.')],
    ['=', equals, 'eq'],
  ]

  return (
    <div className="flex h-full flex-col bg-[#e6e6e6] p-1">
      <div className="flex shrink-0 flex-col items-end justify-end px-3 pb-2 pt-1">
        <div className="h-5 text-[13px] text-[#777]">{history}</div>
        <div className="max-w-full truncate text-[42px] font-light leading-tight">
          {s.cur}
        </div>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-4 grid-rows-6 gap-px bg-[#d0d0d0]">
        {keys.map(([label, fn, kind]) => btn(label, fn, kind))}
      </div>
    </div>
  )
}
