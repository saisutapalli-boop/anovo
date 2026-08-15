import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

const STEPS = ['Intake', 'Validated', 'Docs OK', 'Hand Off', 'BI', 'PA', 'Dispense']

export default function CaseTimeline({
  currentStep,
  defaultExpanded = true,
}: {
  currentStep: number
  defaultExpanded?: boolean
}) {
  const [expanded, setExpanded] = useState(defaultExpanded)

  return (
    <div className="w-full rounded-b-lg border border-t-0 border-[#cad2d3] bg-[#f5f5f5]">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-2 p-4 text-left transition-colors hover:bg-[#eef1f1]"
      >
        <ChevronDown
          className={`size-3.5 shrink-0 text-[#666666] transition-transform duration-300 ${expanded ? '' : '-rotate-90'}`}
        />
        <p className="flex-1 text-[11px] font-bold tracking-[0.88px] text-[#666666]">CASE PROGRESS</p>
        <div className="rounded-md border border-[#dddddd] bg-[#eaeded] px-2 py-1">
          <p className="whitespace-nowrap text-[11px] tracking-[0.055px] text-brand-teal-dark">
            Step {currentStep} of {STEPS.length} Active
          </p>
        </div>
      </button>

      <div className="grid transition-[grid-template-rows] duration-300 ease-out" style={{ gridTemplateRows: expanded ? '1fr' : '0fr' }}>
        <div className="overflow-hidden">
          <div className="flex flex-wrap items-center gap-1.5 px-4 pb-4">
            {STEPS.map((label, i) => {
              const step = i + 1
              const done = step < currentStep
              const active = step === currentStep
              return (
                <div key={label} className="flex items-center gap-1.5">
                  {i > 0 && <div className="h-px w-4 bg-[#cad2d3]" />}
                  {done && (
                    <div className="flex items-center gap-2 rounded-full border border-[#07645c] bg-[#fefefe] px-3 py-2 text-xs transition-colors">
                      <span className="font-bold text-[#07645c]">✓</span>
                      <span className="font-semibold text-[#383838]">{label}</span>
                    </div>
                  )}
                  {active && (
                    <div className="flex items-center gap-2 rounded-full bg-brand-teal px-4 py-2 shadow-[0_4px_4px_rgba(5,89,121,0.15)] transition-colors">
                      <span className="flex size-4 items-center justify-center rounded-full bg-white text-[10px] font-bold text-brand-teal">
                        {step}
                      </span>
                      <span className="text-xs font-bold text-white">{label}</span>
                    </div>
                  )}
                  {!done && !active && (
                    <div className="flex items-center gap-2 whitespace-nowrap rounded-full bg-white px-3 py-2 text-[11px] text-[#666666] transition-colors">
                      <span className="font-semibold">{step}</span>
                      <span className="font-medium">{label}</span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
