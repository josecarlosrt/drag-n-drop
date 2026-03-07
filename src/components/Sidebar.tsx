import { useDraggable } from '@dnd-kit/core';
import { Type, Image as ImageIcon, MousePointer2 } from 'lucide-react';

export function Sidebar() {
    const tools = [
        { id: 'tool-text', type: 'text', label: 'Text Block', icon: Type },
        { id: 'tool-image', type: 'image', label: 'Image Block', icon: ImageIcon },
        { id: 'tool-button', type: 'button', label: 'Button Block', icon: MousePointer2 },
    ];

    return (
        <div className="w-64 border-r bg-slate-50 p-4 h-full flex flex-col gap-4">
            <h2 className="font-semibold text-lg mb-2">Tools</h2>
            {tools.map((tool) => (
                <DraggableTool key={tool.id} {...tool} />
            ))}
        </div>
    );
}

function DraggableTool({ id, type, label, icon: Icon }: any) {
    const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
        id: id,
        data: { type },
    });

    return (
        <div
            ref={setNodeRef}
            {...listeners}
            {...attributes}
            className={`cursor-grab p-4 border rounded-md flex items-center gap-3 bg-white shadow-sm hover:border-slate-300 transition-colors ${isDragging ? 'opacity-50' : ''
                }`}
        >
            <Icon className="w-5 h-5 text-slate-500" />
            <span className="font-medium text-sm">{label}</span>
        </div>
    );
}
