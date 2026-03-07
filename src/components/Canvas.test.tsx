import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { Canvas, type BlockData } from './Canvas';
import { DndContext } from '@dnd-kit/core';

describe('Canvas', () => {
    it('renders an empty state placeholder when no blocks are provided', () => {
        render(
            <DndContext>
                <Canvas blocks={[]} />
            </DndContext>
        );
        expect(screen.getByTestId('empty-canvas')).toBeInTheDocument();
        expect(screen.getByText(/Drag tools here to build your newsletter/i)).toBeInTheDocument();
    });

    it('renders blocks correctly when provided', () => {
        const blocks: BlockData[] = [
            { id: '1', type: 'text' },
            { id: '2', type: 'image' },
        ];
        render(
            <DndContext>
                <Canvas blocks={blocks} />
            </DndContext>
        );

        expect(screen.getByTestId('canvas-blocks')).toBeInTheDocument();
        expect(screen.getByTestId('block-text')).toBeInTheDocument();
        expect(screen.getByTestId('block-image')).toBeInTheDocument();
    });
});
