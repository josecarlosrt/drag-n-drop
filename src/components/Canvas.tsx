import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export interface BlockData {
    id: string;
    type: string;
}

export function Canvas({ blocks }: { blocks: BlockData[] }) {
    const { setNodeRef } = useDroppable({
        id: 'canvas',
    });

    return (
        <div className="flex-1 bg-slate-100/50 p-8 overflow-y-auto">
            <div className="max-w-2xl mx-auto min-h-[500px] bg-white border shadow-sm rounded-lg p-6">
                <div ref={setNodeRef} className="h-full min-h-[400px]">
                    {blocks.length === 0 ? (
                        <div data-testid="empty-canvas" className="h-[400px] flex items-center justify-center text-slate-400 border-2 border-dashed rounded-md">
                            Drag tools here to build your newsletter
                        </div>
                    ) : (
                        <SortableContext items={blocks.map((b) => b.id)} strategy={verticalListSortingStrategy}>
                            <div data-testid="canvas-blocks" className="flex flex-col gap-4">
                                {blocks.map((block) => (
                                    <CanvasItem key={block.id} block={block} />
                                ))}
                            </div>
                        </SortableContext>
                    )}
                </div>
            </div>
        </div>
    );
}

const CanvasItem = React.memo(({ block }: { block: BlockData }) => {
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
                return <div className="p-4 text-center border-2 border-transparent hover:border-slate-100 rounded">Lorem ipsum dolor sit amet.</div>;
            case 'image':
                return <div className="h-32 bg-slate-100 rounded flex items-center justify-center text-slate-400">Image Placeholder</div>;
            case 'button':
                return <div className="text-center py-4"><Button variant="default">Click Me</Button></div>;
            default:
                return <div>Unknown Block</div>;
        }
    };

    return (
        <Card ref={setNodeRef} style={style} {...attributes} {...listeners} data-testid={`block-${block.type}`} className="p-2 cursor-grab active:cursor-grabbing relative bg-white hover:ring-2 ring-primary/20">
            {renderContent()}
        </Card>
    );
});

CanvasItem.displayName = 'CanvasItem';
