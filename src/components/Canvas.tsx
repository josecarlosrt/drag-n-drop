import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Trash2, Image as ImageIcon } from 'lucide-react';

export interface BlockData {
    id: string;
    type: string;
}

export function Canvas({ blocks, onRemove }: { blocks: BlockData[], onRemove?: (id: string) => void }) {
    const { setNodeRef } = useDroppable({
        id: 'canvas',
    });

    return (
        <div className="flex-1 overflow-y-auto p-8 relative">
            <div className="max-w-3xl mx-auto min-h-[600px] bg-white border border-slate-200 shadow-md rounded-xl p-8">
                <div ref={setNodeRef} className="h-full min-h-[500px]">
                    {blocks.length === 0 ? (
                        <div data-testid="empty-canvas" className="h-[500px] flex flex-col items-center justify-center text-slate-400 border-2 border-dashed border-slate-200 rounded-lg bg-slate-50 transition-colors hover:bg-slate-100/50">
                            <div className="text-center">
                                <p className="font-medium text-slate-500 mb-1">Canvas is empty</p>
                                <p className="text-sm">Drag tools here to build your newsletter</p>
                            </div>
                        </div>
                    ) : (
                        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                            <div data-testid="canvas-blocks" className="flex flex-col gap-4">
                                {blocks.map((block) => (
                                    <CanvasItem key={block.id} block={block} onRemove={onRemove} />
                                ))}
                            </div>
                        </SortableContext>
                    )}
                </div>
            </div>
        </div>
    );
}

const CanvasItem = React.memo(({ block, onRemove }: { block: BlockData, onRemove?: (id: string) => void }) => {
    const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
        id: block.id,
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
        opacity: isDragging ? 0.5 : 1,
        zIndex: isDragging ? 10 : 1,
    };

    const renderContent = () => {
        switch (block.type) {
            case 'text':
                return (
                    <div className="p-6 text-slate-700 bg-white">
                        <p className="text-base leading-relaxed">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                    </div>
                );
            case 'image':
                return (
                    <div className="h-48 bg-slate-100 rounded-md flex flex-col items-center justify-center text-slate-400 gap-2 border border-slate-200 m-4 relative overflow-hidden">
                        <ImageIcon className="w-10 h-10 text-slate-300" />
                        <span className="text-sm font-medium">Image Placeholder</span>
                    </div>
                );
            case 'button':
                return (
                    <div className="text-center py-6">
                        <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-2 rounded-md shadow-sm">
                            Click Me
                        </Button>
                    </div>
                );
            default:
                return <div className="p-4 text-center">Unknown Block</div>;
        }
    };

    return (
        <Card
            ref={setNodeRef}
            style={style}
            {...attributes}
            {...listeners}
            data-testid={`block-${block.type}`}
            className="group relative cursor-grab active:cursor-grabbing bg-white hover:ring-2 ring-blue-500/50 shadow-sm border-slate-200 overflow-hidden focus-visible:outline-none"
        >
            {renderContent()}

            <button
                onPointerDown={(e) => {
                    // Prevent drag start when clicking the delete button
                    e.stopPropagation();
                }}
                onClick={(e) => {
                    e.stopPropagation();
                    onRemove?.(block.id);
                }}
                className="absolute top-2 right-2 p-1.5 bg-white rounded-md shadow-sm border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-200 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all z-20 cursor-pointer"
                aria-label="Delete block"
            >
                <Trash2 className="w-4 h-4" />
            </button>
        </Card>
    );
});

CanvasItem.displayName = 'CanvasItem';
