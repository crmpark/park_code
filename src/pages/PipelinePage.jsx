import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
} from '@dnd-kit/core'
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable'
import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { useProspects } from '../hooks/useProspects'
import { Sidebar } from '../components/layout/Sidebar'
import { TopBar } from '../components/layout/TopBar'
import { PIPELINE_STAGES } from '../lib/constants'
import { formatCurrency, getStage } from '../lib/utils'
import { useToast } from '../components/ui/Toast'
import { Link } from 'react-router-dom'
import { MessageCircle } from 'lucide-react'
import { whatsappLink } from '../lib/utils'

export function PipelinePage() {
  const toast = useToast()
  const { prospects, updateStage } = useProspects()
  const [activeId, setActiveId] = useState(null)

  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }))

  const activeProspect = prospects.find((p) => p.id === activeId)

  function handleDragStart({ active }) {
    setActiveId(active.id)
  }

  async function handleDragEnd({ active, over }) {
    setActiveId(null)
    if (!over || active.id === over.id) return

    const overStage = over.data?.current?.stage ?? over.id
    const prospect = prospects.find((p) => p.id === active.id)
    if (!prospect || prospect.pipeline_stage === overStage) return

    const { error } = await updateStage(active.id, overStage)
    if (error) toast('Error al mover el prospecto', 'error')
  }

  const displayStages = PIPELINE_STAGES.filter((s) => s.slug !== 'perdido')

  return (
    <div className="flex min-h-screen bg-[#F0F4F0]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar title="Pipeline de ventas" />
        <div className="flex-1 overflow-x-auto p-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 h-full" style={{ minWidth: `${displayStages.length * 260}px` }}>
              {displayStages.map((stage) => {
                const stageProspects = prospects.filter((p) => p.pipeline_stage === stage.slug)
                return (
                  <PipelineColumn
                    key={stage.slug}
                    stage={stage}
                    prospects={stageProspects}
                  />
                )
              })}
            </div>

            <DragOverlay>
              {activeProspect && <ProspectCard prospect={activeProspect} isDragging />}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  )
}

function PipelineColumn({ stage, prospects }) {
  const totalValue = prospects.reduce((sum, p) => sum + (p.estimated_value ?? 0), 0)

  return (
    <div
      className="flex flex-col w-60 shrink-0 bg-white rounded-xl shadow-md overflow-hidden"
      data-stage={stage.slug}
    >
      <div className="px-4 py-3 border-b border-gray-100" style={{ borderTopWidth: 3, borderTopColor: stage.color, borderTopStyle: 'solid' }}>
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-900">{stage.name}</h3>
          <span className="text-xs font-bold text-white px-2 py-0.5 rounded-full" style={{ backgroundColor: stage.color }}>
            {prospects.length}
          </span>
        </div>
        {totalValue > 0 && (
          <p className="text-xs text-gray-400 mt-0.5">{formatCurrency(totalValue)}</p>
        )}
      </div>

      <SortableContext items={prospects.map((p) => p.id)} strategy={verticalListSortingStrategy}>
        <div
          className="flex-1 p-3 space-y-2 overflow-y-auto min-h-[200px]"
          id={stage.slug}
          data-stage={stage.slug}
        >
          {prospects.map((p) => (
            <SortableProspectCard key={p.id} prospect={p} stage={stage} />
          ))}
          {prospects.length === 0 && (
            <div className="flex items-center justify-center h-20 border-2 border-dashed border-gray-100 rounded-lg">
              <p className="text-xs text-gray-300">Sin prospectos</p>
            </div>
          )}
        </div>
      </SortableContext>
    </div>
  )
}

function SortableProspectCard({ prospect, stage }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: prospect.id,
    data: { stage: stage.slug },
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <ProspectCard prospect={prospect} />
    </div>
  )
}

function ProspectCard({ prospect, isDragging }) {
  return (
    <div className={`bg-white border border-gray-100 rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing ${isDragging ? 'shadow-xl rotate-2' : ''}`}>
      <Link
        to={`/prospectos/${prospect.id}`}
        className="block"
        onClick={(e) => e.stopPropagation()}
        onPointerDown={(e) => e.stopPropagation()}
      >
        <p className="text-sm font-medium text-gray-900 truncate">{prospect.full_name}</p>
        {prospect.company_name && (
          <p className="text-xs text-gray-400 truncate">{prospect.company_name}</p>
        )}
      </Link>
      <div className="flex items-center justify-between mt-2">
        {prospect.estimated_value ? (
          <span className="text-xs font-semibold text-[#1B4332]">{formatCurrency(prospect.estimated_value)}</span>
        ) : (
          <span />
        )}
        {prospect.phone && (
          <a
            href={whatsappLink(prospect.phone)}
            target="_blank"
            rel="noreferrer"
            className="text-green-500 hover:text-green-700"
            onPointerDown={(e) => e.stopPropagation()}
          >
            <MessageCircle size={14} />
          </a>
        )}
      </div>
    </div>
  )
}
