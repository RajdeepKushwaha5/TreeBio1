"use client";

import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { GripVertical, Edit3, Archive, Trash2, ExternalLink } from 'lucide-react';
import { toast } from 'sonner';
import { useRealtime } from '@/components/smart-realtime-provider';

interface Link {
  id: string;
  title: string;
  url: string;
  description?: string;
  clickCount: number;
}

interface SortableLinkItemProps {
  link: Link;
  onEdit: (linkId: string) => void;
  onArchive: (linkId: string) => void;
  onDelete: (linkId: string) => void;
}

function SortableLinkItem({ link, onEdit, onArchive, onDelete }: SortableLinkItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: link.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="w-full">
      <Card className="mb-3 border border-border/40 hover:border-border/60 transition-colors">
        <CardContent className="p-4">
          <div className="flex items-center gap-3">
            {/* Drag Handle */}
            <button
              className="flex items-center justify-center w-6 h-6 text-muted-foreground hover:text-foreground cursor-grab active:cursor-grabbing"
              {...attributes}
              {...listeners}
              aria-label="Drag to reorder"
            >
              <GripVertical className="h-4 w-4" />
            </button>

            {/* Link Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-foreground truncate">
                    {link.title}
                  </h3>
                  {link.description && (
                    <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                      {link.description}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground/70 mt-1 truncate">
                    {link.url}
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center gap-1 ml-3">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => window.open(link.url, '_blank')}
                    className="h-8 w-8 p-0"
                  >
                    <ExternalLink className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onEdit(link.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Edit3 className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onArchive(link.id)}
                    className="h-8 w-8 p-0"
                  >
                    <Archive className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onDelete(link.id)}
                    className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

interface SortableLinksListProps {
  links: Link[];
  onEdit: (linkId: string) => void;
  onArchive: (linkId: string) => void;
  onDelete: (linkId: string) => void;
}

export function SortableLinksList({ links, onEdit, onArchive, onDelete }: SortableLinksListProps) {
  const { reorderLinks } = useRealtime();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = links.findIndex((link) => link.id === active.id);
      const newIndex = links.findIndex((link) => link.id === over?.id);

      if (oldIndex !== -1 && newIndex !== -1) {
        const reorderedLinks = arrayMove(links, oldIndex, newIndex);
        const linkIds = reorderedLinks.map(link => link.id);
        
        try {
          await reorderLinks(linkIds);
        } catch (error) {
          console.error('Error reordering links:', error);
          toast.error('Failed to reorder links');
        }
      }
    }
  };

  if (links.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No links to display. Add your first link above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
        <GripVertical className="h-4 w-4" />
        <span>Drag links to reorder them</span>
      </div>
      
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={links.map(link => link.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {links.map((link) => (
              <SortableLinkItem
                key={link.id}
                link={link}
                onEdit={onEdit}
                onArchive={onArchive}
                onDelete={onDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
