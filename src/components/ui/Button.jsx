export function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const base = 'inline-flex items-center justify-center gap-2 font-medium rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed'
  const variants = {
    primary: 'bg-[#1B4332] text-white hover:bg-[#145028]',
    accent: 'bg-[#52B788] text-white hover:bg-[#3da374]',
    danger: 'bg-red-500 text-white hover:bg-red-600',
    ghost: 'bg-transparent text-[#1B4332] hover:bg-green-50 border border-[#1B4332]',
    outline: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  )
}
