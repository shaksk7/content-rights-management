import { cn } from "@/lib/utils"

export function Button({ 
  children, 
  className, 
  variant = "default", 
  size = "default",
  disabled,
  loading,
  ...props 
}) {
  const variants = {
    default: "bg-primary text-white hover:bg-blue-700",
    outline: "border border-gray-300 bg-white hover:bg-gray-50 text-gray-700",
    danger: "bg-red-500 text-white hover:bg-red-600",
    ghost: "hover:bg-gray-100 text-gray-700"
  }

  const sizes = {
    default: "px-4 py-2 text-sm",
    sm: "px-3 py-1.5 text-xs",
    lg: "px-6 py-3 text-base"
  }

  return (
    <button
      className={cn(
        "rounded-lg font-medium transition-colors duration-200",
        "disabled:opacity-50 disabled:cursor-not-allowed",
        "flex items-center gap-2",
        variants[variant],
        sizes[size],
        className
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
      )}
      {children}
    </button>
  )
}