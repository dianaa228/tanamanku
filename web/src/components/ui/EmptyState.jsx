import Button from './Button'

export default function EmptyState({ icon = '🪴', title, description, actionLabel, actionTo, onAction }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-3xl border border-dashed border-leaf-200 bg-leaf-50/50 px-6 py-16 text-center">
      <div className="animate-float text-6xl">{icon}</div>
      <h3 className="text-lg font-bold text-leaf-950">{title}</h3>
      {description && <p className="max-w-sm text-sm text-leaf-900/60">{description}</p>}
      {(actionLabel && actionTo) || (actionLabel && onAction) ? (
        <Button to={actionTo} onClick={onAction} variant="primary" className="mt-2">
          {actionLabel}
        </Button>
      ) : null}
    </div>
  )
}
