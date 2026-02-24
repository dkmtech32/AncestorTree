/**
 * @project AncestorTree
 * @file src/components/tree/family-tree.tsx
 * @description Interactive family tree with zoom, pan, collapse/expand, filters, minimap
 * @version 2.0.0 - Sprint 3 Enhanced
 * @updated 2026-02-24
 */

'use client';

import { useMemo, useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTreeData } from '@/hooks/use-families';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  ZoomIn,
  ZoomOut,
  RotateCcw,
  User,
  ChevronDown,
  ChevronRight,
  Move,
  Maximize2,
  Users,
  ArrowUpFromLine,
  ArrowDownFromLine,
} from 'lucide-react';
import type { Person } from '@/types';
import type { TreeData } from '@/lib/supabase-data';
import Link from 'next/link';

// ═══════════════════════════════════════════════════════════════════════════
// Constants
// ═══════════════════════════════════════════════════════════════════════════

const NODE_WIDTH = 120;
const NODE_HEIGHT = 80;
const LEVEL_HEIGHT = 140;
const SIBLING_GAP = 20;
const MINIMAP_WIDTH = 160;
const MINIMAP_HEIGHT = 100;

// ═══════════════════════════════════════════════════════════════════════════
// Types
// ═══════════════════════════════════════════════════════════════════════════

type ViewMode = 'all' | 'ancestors' | 'descendants';

interface TreeNodeData {
  person: Person;
  x: number;
  y: number;
  isCollapsed: boolean;
  hasChildren: boolean;
  isVisible: boolean;
}

interface TreeConnectionData {
  id: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: 'parent-child' | 'couple';
  isVisible: boolean;
}

// ═══════════════════════════════════════════════════════════════════════════
// Tree Node Component
// ═══════════════════════════════════════════════════════════════════════════

interface TreeNodeProps {
  node: TreeNodeData;
  onSelect: (person: Person) => void;
  onToggleCollapse: (personId: string) => void;
  isSelected: boolean;
}

function TreeNode({ node, onSelect, onToggleCollapse, isSelected }: TreeNodeProps) {
  const { person, x, y, isCollapsed, hasChildren } = node;
  
  const initials = person.display_name
    .split(' ')
    .map((n) => n[0])
    .slice(-2)
    .join('')
    .toUpperCase();

  const genderColor = person.gender === 1 ? 'border-blue-400' : 'border-pink-400';
  const selectedRing = isSelected ? 'ring-2 ring-primary ring-offset-2' : '';

  return (
    <motion.g
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.3 }}
    >
      <foreignObject x={x} y={y} width={NODE_WIDTH} height={NODE_HEIGHT}>
        <div
          className={`h-full bg-card border-2 ${genderColor} ${selectedRing} rounded-lg shadow-sm cursor-pointer hover:shadow-md transition-all p-2 flex flex-col items-center justify-center relative`}
          onClick={() => onSelect(person)}
        >
          <Avatar className="h-8 w-8 mb-1">
            <AvatarImage src={person.avatar_url} />
            <AvatarFallback className="text-xs">
              {initials || <User className="h-3 w-3" />}
            </AvatarFallback>
          </Avatar>
          <span className="text-xs font-medium text-center line-clamp-2 leading-tight">
            {person.display_name}
          </span>
          {!person.is_living && (
            <span className="text-[10px] text-muted-foreground">†</span>
          )}
          
          {/* Collapse/Expand button */}
          {hasChildren && (
            <button
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-6 h-6 bg-background border rounded-full flex items-center justify-center shadow-sm hover:bg-muted transition-colors z-10"
              onClick={(e) => {
                e.stopPropagation();
                onToggleCollapse(person.id);
              }}
            >
              {isCollapsed ? (
                <ChevronRight className="h-3 w-3" />
              ) : (
                <ChevronDown className="h-3 w-3" />
              )}
            </button>
          )}
        </div>
      </foreignObject>
    </motion.g>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tree Connection Component
// ═══════════════════════════════════════════════════════════════════════════

interface TreeConnectionProps {
  connection: TreeConnectionData;
}

function TreeConnection({ connection }: TreeConnectionProps) {
  const { x1, y1, x2, y2, type } = connection;

  if (type === 'couple') {
    return (
      <motion.line
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.5 }}
        x1={x1}
        y1={y1}
        x2={x2}
        y2={y2}
        stroke="currentColor"
        strokeWidth={2}
        className="text-pink-400"
      />
    );
  }

  // Parent-child: draw stepped line
  const midY = y1 + (y2 - y1) / 2;
  return (
    <motion.path
      initial={{ pathLength: 0 }}
      animate={{ pathLength: 1 }}
      transition={{ duration: 0.5 }}
      d={`M ${x1} ${y1} L ${x1} ${midY} L ${x2} ${midY} L ${x2} ${y2}`}
      fill="none"
      stroke="currentColor"
      strokeWidth={1.5}
      className="text-muted-foreground"
    />
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Minimap Component
// ═══════════════════════════════════════════════════════════════════════════

interface MinimapProps {
  nodes: TreeNodeData[];
  viewBox: { x: number; y: number; width: number; height: number };
  treeWidth: number;
  treeHeight: number;
  onViewportClick: (x: number, y: number) => void;
}

function Minimap({ nodes, viewBox, treeWidth, treeHeight, onViewportClick }: MinimapProps) {
  const scaleX = MINIMAP_WIDTH / treeWidth;
  const scaleY = MINIMAP_HEIGHT / treeHeight;
  const scale = Math.min(scaleX, scaleY) * 0.9;

  const handleClick = (e: React.MouseEvent<SVGSVGElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / scale;
    const y = (e.clientY - rect.top) / scale;
    onViewportClick(x, y);
  };

  const visibleNodes = nodes.filter(n => n.isVisible);

  return (
    <div className="absolute bottom-4 right-4 bg-background/90 border rounded-lg p-2 shadow-lg">
      <svg
        width={MINIMAP_WIDTH}
        height={MINIMAP_HEIGHT}
        className="cursor-pointer"
        onClick={handleClick}
      >
        <g transform={`scale(${scale})`}>
          {/* Nodes as dots */}
          {visibleNodes.map((node) => (
            <circle
              key={node.person.id}
              cx={node.x + NODE_WIDTH / 2}
              cy={node.y + NODE_HEIGHT / 2}
              r={4 / scale}
              className={node.person.gender === 1 ? 'fill-blue-400' : 'fill-pink-400'}
            />
          ))}
          
          {/* Viewport rectangle */}
          <rect
            x={viewBox.x}
            y={viewBox.y}
            width={viewBox.width}
            height={viewBox.height}
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth={2 / scale}
            className="opacity-50"
          />
        </g>
      </svg>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// Tree Layout Builder
// ═══════════════════════════════════════════════════════════════════════════

function buildTreeLayout(
  data: TreeData,
  collapsedNodes: Set<string>,
  viewMode: ViewMode,
  focusPersonId: string | null
) {
  const { people, families, children } = data;

  // Build parent-child relationships
  const childToParents = new Map<string, string[]>();
  const parentToChildren = new Map<string, string[]>();

  families.forEach((family) => {
    const familyChildren = children.filter((c) => c.family_id === family.id);
    const parentIds = [family.father_id, family.mother_id].filter(Boolean) as string[];

    familyChildren.forEach((child) => {
      childToParents.set(child.person_id, parentIds);
      parentIds.forEach((parentId) => {
        if (!parentToChildren.has(parentId)) parentToChildren.set(parentId, []);
        parentToChildren.get(parentId)!.push(child.person_id);
      });
    });
  });

  // Determine visible people based on view mode and collapsed state
  const getVisiblePeopleIds = (): Set<string> => {
    const visible = new Set<string>();

    if (viewMode === 'all') {
      // Start with all people, then hide collapsed subtrees
      people.forEach((p) => visible.add(p.id));

      // Hide children of collapsed nodes
      const hideDescendants = (personId: string) => {
        const childIds = parentToChildren.get(personId) || [];
        childIds.forEach((childId) => {
          visible.delete(childId);
          hideDescendants(childId);
        });
      };

      collapsedNodes.forEach((nodeId) => {
        hideDescendants(nodeId);
      });
    } else if (viewMode === 'ancestors' && focusPersonId) {
      // Show only ancestors of focus person
      const addAncestors = (personId: string) => {
        visible.add(personId);
        const parentIds = childToParents.get(personId) || [];
        parentIds.forEach(addAncestors);
      };
      addAncestors(focusPersonId);
    } else if (viewMode === 'descendants' && focusPersonId) {
      // Show only descendants of focus person
      const addDescendants = (personId: string) => {
        visible.add(personId);
        const childIds = parentToChildren.get(personId) || [];
        childIds.forEach(addDescendants);
      };
      addDescendants(focusPersonId);
    } else {
      people.forEach((p) => visible.add(p.id));
    }

    return visible;
  };

  const visibleIds = getVisiblePeopleIds();
  const visiblePeople = people.filter((p) => visibleIds.has(p.id));

  // Group by generation
  const byGeneration = new Map<number, Person[]>();
  visiblePeople.forEach((p) => {
    const gen = p.generation || 1;
    if (!byGeneration.has(gen)) byGeneration.set(gen, []);
    byGeneration.get(gen)!.push(p);
  });

  const nodes: TreeNodeData[] = [];
  const connections: TreeConnectionData[] = [];

  // Layout by generation
  const generations = [...byGeneration.keys()].sort((a, b) => a - b);

  generations.forEach((gen, genIndex) => {
    const genPeople = byGeneration.get(gen)!;
    const y = genIndex * LEVEL_HEIGHT + 20;
    const totalWidth = genPeople.length * (NODE_WIDTH + SIBLING_GAP) - SIBLING_GAP;
    const startX = -totalWidth / 2;

    genPeople.forEach((person, i) => {
      const x = startX + i * (NODE_WIDTH + SIBLING_GAP);
      const hasChildren = (parentToChildren.get(person.id) || []).some((cid) =>
        people.some((p) => p.id === cid)
      );

      nodes.push({
        person,
        x,
        y,
        isCollapsed: collapsedNodes.has(person.id),
        hasChildren,
        isVisible: true,
      });
    });
  });

  // Build connections
  const personPositions = new Map(nodes.map((n) => [n.person.id, { x: n.x, y: n.y }]));

  families.forEach((family) => {
    const fatherPos = family.father_id ? personPositions.get(family.father_id) : null;
    const motherPos = family.mother_id ? personPositions.get(family.mother_id) : null;

    // Couple connection
    if (fatherPos && motherPos) {
      connections.push({
        id: `couple-${family.id}`,
        x1: fatherPos.x + NODE_WIDTH / 2,
        y1: fatherPos.y + NODE_HEIGHT / 2,
        x2: motherPos.x + NODE_WIDTH / 2,
        y2: motherPos.y + NODE_HEIGHT / 2,
        type: 'couple',
        isVisible: true,
      });
    }

    // Parent to children connections
    const parentX = fatherPos
      ? motherPos
        ? (fatherPos.x + motherPos.x) / 2 + NODE_WIDTH / 2
        : fatherPos.x + NODE_WIDTH / 2
      : motherPos
        ? motherPos.x + NODE_WIDTH / 2
        : null;
    const parentY = fatherPos?.y ?? motherPos?.y;

    // Check if parent is collapsed
    const parentId = family.father_id || family.mother_id;
    const isParentCollapsed = parentId && collapsedNodes.has(parentId);

    if (parentX !== null && parentY !== undefined && !isParentCollapsed) {
      const familyChildren = children.filter((c) => c.family_id === family.id);
      familyChildren.forEach((child) => {
        const childPos = personPositions.get(child.person_id);
        if (childPos) {
          connections.push({
            id: `child-${family.id}-${child.person_id}`,
            x1: parentX,
            y1: parentY + NODE_HEIGHT,
            x2: childPos.x + NODE_WIDTH / 2,
            y2: childPos.y,
            type: 'parent-child',
            isVisible: true,
          });
        }
      });
    }
  });

  // Calculate bounds
  let minX = 0,
    maxX = 0,
    maxY = 0;
  nodes.forEach((n) => {
    minX = Math.min(minX, n.x);
    maxX = Math.max(maxX, n.x + NODE_WIDTH);
    maxY = Math.max(maxY, n.y + NODE_HEIGHT);
  });

  return {
    nodes,
    connections,
    width: maxX - minX + 100,
    height: maxY + 50,
    offsetX: -minX + 50,
  };
}

// ═══════════════════════════════════════════════════════════════════════════
// Main Family Tree Component
// ═══════════════════════════════════════════════════════════════════════════

export function FamilyTree() {
  const { data, isLoading, error } = useTreeData();

  // State
  const [scale, setScale] = useState(() =>
    typeof window !== 'undefined' && window.innerWidth < 768 ? 0.7 : 1
  );
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [selectedPerson, setSelectedPerson] = useState<Person | null>(null);
  const [collapsedNodes, setCollapsedNodes] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<ViewMode>('all');
  const [showMinimap, setShowMinimap] = useState(true);

  const containerRef = useRef<HTMLDivElement>(null);

  // Layout
  const layout = useMemo(() => {
    if (!data || data.people.length === 0) return null;
    return buildTreeLayout(data, collapsedNodes, viewMode, selectedPerson?.id || null);
  }, [data, collapsedNodes, viewMode, selectedPerson?.id]);

  // Handlers
  const handleZoomIn = () => setScale((s) => Math.min(s + 0.1, 2));
  const handleZoomOut = () => setScale((s) => Math.max(s - 0.1, 0.3));
  const handleReset = () => {
    setScale(1);
    setPan({ x: 0, y: 0 });
  };

  const handleToggleCollapse = useCallback((personId: string) => {
    setCollapsedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(personId)) {
        next.delete(personId);
      } else {
        next.add(personId);
      }
      return next;
    });
  }, []);

  // Pan handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isPanning) {
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  // Touch handlers for mobile
  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      setIsPanning(true);
      setPanStart({
        x: e.touches[0].clientX - pan.x,
        y: e.touches[0].clientY - pan.y,
      });
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (isPanning && e.touches.length === 1) {
      setPan({
        x: e.touches[0].clientX - panStart.x,
        y: e.touches[0].clientY - panStart.y,
      });
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
  };

  // Wheel zoom
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.05 : 0.05;
    setScale((s) => Math.max(0.3, Math.min(2, s + delta)));
  };

  // Minimap viewport click
  const handleMinimapClick = (x: number, y: number) => {
    if (!containerRef.current || !layout) return;
    const rect = containerRef.current.getBoundingClientRect();
    setPan({
      x: -(x - rect.width / 2 / scale),
      y: -(y - rect.height / 2 / scale),
    });
  };

  // View mode change
  const handleViewModeChange = (mode: ViewMode) => {
    setViewMode(mode);
    if (mode !== 'all' && !selectedPerson && data?.people.length) {
      setSelectedPerson(data.people[0]);
    }
  };

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <div className="space-y-4 text-center">
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-64 w-96" />
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="py-12 text-center">
          <p className="text-destructive">Lỗi khi tải dữ liệu: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  // Empty state
  if (!layout || layout.nodes.length === 0) {
    return (
      <Card>
        <CardContent className="py-12 text-center text-muted-foreground">
          <p>Chưa có dữ liệu để hiển thị cây gia phả</p>
          <Button asChild variant="link" className="mt-2">
            <Link href="/people/new">Thêm thành viên đầu tiên</Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const viewBox = containerRef.current
    ? {
        x: -pan.x / scale,
        y: -pan.y / scale,
        width: containerRef.current.clientWidth / scale,
        height: containerRef.current.clientHeight / scale,
      }
    : { x: 0, y: 0, width: 800, height: 600 };

  return (
    <div className="space-y-4">
      {/* Controls */}
      <div className="flex flex-wrap items-center gap-2">
        {/* Zoom controls */}
        <div className="flex items-center gap-1 border rounded-lg p-1">
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomOut}>
            <ZoomOut className="h-4 w-4" />
          </Button>
          <span className="text-sm w-12 text-center">{Math.round(scale * 100)}%</span>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleZoomIn}>
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleReset}>
            <RotateCcw className="h-4 w-4" />
          </Button>
        </div>

        {/* View mode filter */}
        <Select value={viewMode} onValueChange={(v) => handleViewModeChange(v as ViewMode)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">
              <span className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Tất cả
              </span>
            </SelectItem>
            <SelectItem value="ancestors">
              <span className="flex items-center gap-2">
                <ArrowUpFromLine className="h-4 w-4" />
                Tổ tiên
              </span>
            </SelectItem>
            <SelectItem value="descendants">
              <span className="flex items-center gap-2">
                <ArrowDownFromLine className="h-4 w-4" />
                Con cháu
              </span>
            </SelectItem>
          </SelectContent>
        </Select>

        {/* Toggle minimap */}
        <Button
          variant={showMinimap ? 'secondary' : 'ghost'}
          size="sm"
          onClick={() => setShowMinimap(!showMinimap)}
          className="hidden md:flex"
        >
          <Maximize2 className="h-4 w-4 mr-2" />
          Minimap
        </Button>

        {/* Pan indicator */}
        <div className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
          <Move className="h-3 w-3" />
          <span className="hidden sm:inline">Kéo để di chuyển</span>
        </div>
      </div>

      {/* View mode info */}
      {viewMode !== 'all' && selectedPerson && (
        <div className="flex items-center gap-2">
          <Badge variant="secondary">
            {viewMode === 'ancestors' ? 'Tổ tiên của' : 'Con cháu của'}: {selectedPerson.display_name}
          </Badge>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setViewMode('all')}
          >
            Xem tất cả
          </Button>
        </div>
      )}

      {/* Tree container */}
      <div
        ref={containerRef}
        className="border rounded-lg bg-muted/30 overflow-hidden relative select-none"
        style={{ height: '60vh', cursor: isPanning ? 'grabbing' : 'grab' }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <svg
          width="100%"
          height="100%"
          style={{ minWidth: '100%', minHeight: '100%' }}
        >
          <g transform={`translate(${pan.x}, ${pan.y}) scale(${scale})`}>
            <g transform={`translate(${layout.offsetX}, 0)`}>
              {/* Connections first (behind nodes) */}
              <AnimatePresence>
                {layout.connections.map((conn) => (
                  <TreeConnection key={conn.id} connection={conn} />
                ))}
              </AnimatePresence>

              {/* Nodes */}
              <AnimatePresence>
                {layout.nodes.map((node) => (
                  <TreeNode
                    key={node.person.id}
                    node={node}
                    onSelect={setSelectedPerson}
                    onToggleCollapse={handleToggleCollapse}
                    isSelected={selectedPerson?.id === node.person.id}
                  />
                ))}
              </AnimatePresence>
            </g>
          </g>
        </svg>

        {/* Minimap */}
        {showMinimap && layout.nodes.length > 3 && (
          <Minimap
            nodes={layout.nodes}
            viewBox={viewBox}
            treeWidth={layout.width}
            treeHeight={layout.height}
            onViewportClick={handleMinimapClick}
          />
        )}
      </div>

      {/* Selected person info */}
      <AnimatePresence>
        {selectedPerson && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
          >
            <Card>
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Avatar className="h-10 w-10">
                    <AvatarImage src={selectedPerson.avatar_url} />
                    <AvatarFallback>
                      {selectedPerson.display_name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold">{selectedPerson.display_name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Đời {selectedPerson.generation}
                      {selectedPerson.chi && ` • Chi ${selectedPerson.chi}`}
                      {!selectedPerson.is_living && ' • Đã mất'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {viewMode === 'all' && (
                    <>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewModeChange('ancestors')}
                      >
                        <ArrowUpFromLine className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Tổ tiên</span>
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewModeChange('descendants')}
                      >
                        <ArrowDownFromLine className="h-4 w-4 mr-1" />
                        <span className="hidden sm:inline">Con cháu</span>
                      </Button>
                    </>
                  )}
                  <Button asChild size="sm">
                    <Link href={`/people/${selectedPerson.id}`}>
                      Xem chi tiết
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
