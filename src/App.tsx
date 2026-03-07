import { useState } from 'react';
import { DndContext, type DragEndEvent, DragOverlay, type DragStartEvent, defaultDropAnimationSideEffects, KeyboardSensor, PointerSensor, useSensor, useSensors, closestCenter } from '@dnd-kit/core';
import { sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { Sidebar } from './components/Sidebar';
import { Canvas, type BlockData } from './components/Canvas';
import { Button } from '@/components/ui/button';

function App() {
  const [blocks, setBlocks] = useState<BlockData[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeType, setActiveType] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id as string);
    if (active.data.current?.type) {
      setActiveType(active.data.current.type as string);
    } else {
      const block = blocks.find((b) => b.id === active.id);
      if (block) setActiveType(block.type);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveId(null);
    setActiveType(null);

    if (!over) return;

    const isActiveSidebarTool = (active.id as string).startsWith('tool-');

    if (isActiveSidebarTool) {
      const type = active.data.current?.type as string;
      const newBlock: BlockData = {
        id: `block-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        type,
      };

      if (over.id === 'canvas') {
        setBlocks((prev) => [...prev, newBlock]);
      } else {
        const overIndex = blocks.findIndex(b => b.id === over.id);
        if (overIndex !== -1) {
          const newArray = [...blocks];
          newArray.splice(overIndex, 0, newBlock);
          setBlocks(newArray);
        } else {
          setBlocks((prev) => [...prev, newBlock]);
        }
      }
    } else {
      if (active.id !== over.id) {
        setBlocks((blocks) => {
          const oldIndex = blocks.findIndex((b) => b.id === active.id);
          const newIndex = blocks.findIndex((b) => b.id === over.id);
          return arrayMove(blocks, oldIndex, newIndex);
        });
      }
    }
  };

  const handleRemoveBlock = (id: string) => {
    setBlocks((prev) => prev.filter((b) => b.id !== id));
  };

  return (
    <div className="flex flex-col h-screen w-full font-sans bg-gray-50">
      <header className="flex items-center justify-between px-6 py-4 bg-white border-b shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center text-white font-bold">N</div>
          <span className="font-semibold text-lg text-slate-800">Newsletter Builder</span>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">Preview</Button>
          <Button>Save Settings</Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <Sidebar />
          <Canvas blocks={blocks} onRemove={handleRemoveBlock} />

          <DragOverlay dropAnimation={{
            sideEffects: defaultDropAnimationSideEffects({ styles: { active: { opacity: '0.4' } } }),
          }}>
            {activeId ? (
              <div className="p-4 bg-white border rounded shadow-lg opacity-90 min-w-40 flex items-center justify-center font-medium shadow-xl">
                Dragging {activeType} Block
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
}

export default App;
