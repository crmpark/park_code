export function Badge({ children, color, className = '' }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${className}`}
      style={color ? { backgroundColor: color + '20', color } : undefined}
    >
      {children}
    </span>
  )
}

export function StageBadge({ stage }) {
  if (!stage) return null
  return (
    <Badge color={stage.color}>
      {stage.name}
    </Badge>
  )
}
