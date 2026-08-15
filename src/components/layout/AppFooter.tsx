export default function AppFooter() {
  return (
    <footer className="flex w-full flex-col items-center gap-2 border-t border-[#e5e5e5] bg-white px-4 py-4 text-center wide:flex-row wide:gap-x-4 wide:gap-y-0 wide:px-20 wide:text-left">
      <div className="flex items-center gap-4">
        <a href="#" className="whitespace-nowrap text-[11px] tracking-[0.055px] text-brand-teal-dark transition-colors hover:text-brand-teal">
          Terms Of Conditions
        </a>
        <a href="#" className="whitespace-nowrap text-[11px] tracking-[0.055px] text-brand-teal-dark transition-colors hover:text-brand-teal">
          Privacy Policy
        </a>
      </div>
      <p className="text-xs text-[#707070] wide:flex-1 wide:text-right">
        Anovo® is registered with the U.S. Patent and Trademark Office by AnovoRx Holdings Inc.
      </p>
    </footer>
  )
}
