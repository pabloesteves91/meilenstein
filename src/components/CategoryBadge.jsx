import { getCategoryInfo } from '../lib/milestones'

export function CategoryBadge({ id }) {
  const cat = getCategoryInfo(id)
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${cat.color}`}>
      {cat.label}
    </span>
  )
}
