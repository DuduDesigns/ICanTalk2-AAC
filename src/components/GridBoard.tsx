import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AACTile, ProgressionTier, ContrastMode, CategoryId } from '../types';
import { AAC_CATEGORIES } from '../data/initialTiles';
import { getCategoryTitle } from '../data/translations';
import { TileItem } from './TileItem';
import { ChevronLeft, ChevronRight, PlusCircle } from 'lucide-react';

interface GridBoardProps {
  tiles: AACTile[];
  activeCategory: CategoryId;
  onSelectCategory: (catId: CategoryId) => void;
  slideDirection?: number;
  currentTier: ProgressionTier;
  gridDensityMastery: '3x4' | '4x4' | '4x6';
  contrastMode: ContrastMode;
  langCode: string;
  isEditMode: boolean;
  isSwipeDisabled?: boolean;
  onSelectTile: (tile: AACTile) => void;
  onEditTile: (tile: AACTile) => void;
  onAddNewTile: (categoryId: CategoryId) => void;
}

const NAVIGABLE_CATEGORIES: CategoryId[] = [
  'core',
  'actions',
  'food',
  'feelings',
  'places',
  'toys',
  'people',
  'social',
];

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.98,
  }),
  center: {
    x: 0,
    opacity: 1,
    scale: 1,
  },
  exit: (direction: number) => ({
    x: direction < 0 ? '100%' : '-100%',
    opacity: 0,
    scale: 0.98,
  }),
};

export const GridBoard: React.FC<GridBoardProps> = ({
  tiles,
  activeCategory,
  onSelectCategory,
  slideDirection = 1,
  currentTier,
  gridDensityMastery,
  contrastMode,
  langCode,
  isEditMode,
  isSwipeDisabled = false,
  onSelectTile,
  onEditTile,
  onAddNewTile,
}) => {
  const [currentPage, setCurrentPage] = useState(0);

  // Gesture tracking refs
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);
  const isMouseDownRef = useRef<boolean>(false);
  const wasSwipingRef = useRef<boolean>(false);

  // Filter tiles for active category and minimum tier
  const filteredTiles = useMemo(() => {
    return tiles
      .filter((t) => !t.hidden)
      .filter((t) => {
        if (activeCategory === 'core') {
          return t.isCoreAnchor || t.category === 'core';
        }
        return t.category === activeCategory;
      })
      .filter((t) => {
        if (currentTier === 'starter') {
          return t.tierMin === 'starter';
        }
        if (currentTier === 'emergent') {
          return t.tierMin === 'starter' || t.tierMin === 'emergent';
        }
        return true; // mastery shows all
      })
      .sort((a, b) => (a.order || 999) - (b.order || 999));
  }, [tiles, activeCategory, currentTier]);

  // Determine items per page based on tier
  const pageSize = useMemo(() => {
    if (currentTier === 'starter') return 4; // 2x2
    if (currentTier === 'emergent') return 8; // 2x4
    if (gridDensityMastery === '3x4') return 12; // 3x4
    if (gridDensityMastery === '4x6') return 24; // 4x6
    return 16; // 4x4 default mastery
  }, [currentTier, gridDensityMastery]);

  // Reset page on category or tier change
  useEffect(() => {
    setCurrentPage(0);
  }, [activeCategory, currentTier, pageSize]);

  const totalPages = Math.max(1, Math.ceil(filteredTiles.length / pageSize));
  const currentTiles = filteredTiles.slice(currentPage * pageSize, (currentPage + 1) * pageSize);

  // CSS Grid class based on tier
  const gridClasses = useMemo(() => {
    if (currentTier === 'starter') {
      return 'grid-cols-2 grid-rows-2 h-full gap-3 sm:gap-4 md:gap-6';
    }
    if (currentTier === 'emergent') {
      return 'grid-cols-2 sm:grid-cols-4 grid-rows-4 sm:grid-rows-2 h-full gap-2.5 sm:gap-3 md:gap-4';
    }
    // Mastery
    if (gridDensityMastery === '3x4') {
      return 'grid-cols-3 sm:grid-cols-4 grid-rows-4 sm:grid-rows-3 h-full gap-2 sm:gap-3';
    }
    if (gridDensityMastery === '4x6') {
      return 'grid-cols-3 sm:grid-cols-6 grid-rows-8 sm:grid-rows-4 h-full gap-1.5 sm:gap-2.5';
    }
    // 4x4 default
    return 'grid-cols-2 sm:grid-cols-4 grid-rows-8 sm:grid-rows-4 h-full gap-2 sm:gap-3';
  }, [currentTier, gridDensityMastery]);

  // Gesture handling functions
  const handleGestureStart = (clientX: number, clientY: number) => {
    if (isSwipeDisabled) return;
    touchStartRef.current = { x: clientX, y: clientY, time: Date.now() };
    wasSwipingRef.current = false;
  };

  const handleGestureMove = (clientX: number, clientY: number) => {
    if (!touchStartRef.current || isSwipeDisabled) return;
    const dx = clientX - touchStartRef.current.x;
    const dy = clientY - touchStartRef.current.y;

    if (Math.abs(dx) > 12 || Math.abs(dy) > 12) {
      wasSwipingRef.current = true;
    }
  };

  const handleGestureEnd = (endX?: number, endY?: number) => {
    if (!touchStartRef.current || isSwipeDisabled) {
      touchStartRef.current = null;
      return;
    }

    const startX = touchStartRef.current.x;
    const startY = touchStartRef.current.y;
    const startTime = touchStartRef.current.time;
    touchStartRef.current = null;

    if (endX === undefined || endY === undefined) return;

    const dx = endX - startX;
    const dy = endY - startY;
    const dt = Date.now() - startTime;

    const MIN_SWIPE_DIST = 50; // px
    const MAX_SWIPE_TIME = 800; // ms

    if (
      Math.abs(dx) >= MIN_SWIPE_DIST &&
      Math.abs(dx) > Math.abs(dy) * 1.15 &&
      dt <= MAX_SWIPE_TIME
    ) {
      wasSwipingRef.current = true;
      setTimeout(() => {
        wasSwipingRef.current = false;
      }, 300);

      const currentIndex = NAVIGABLE_CATEGORIES.indexOf(activeCategory);
      if (currentIndex !== -1) {
        if (dx < 0) {
          // Swiped LEFT -> Next Category
          const nextIdx = (currentIndex + 1) % NAVIGABLE_CATEGORIES.length;
          onSelectCategory(NAVIGABLE_CATEGORIES[nextIdx]);
        } else {
          // Swiped RIGHT -> Previous Category
          const prevIdx = (currentIndex - 1 + NAVIGABLE_CATEGORIES.length) % NAVIGABLE_CATEGORIES.length;
          onSelectCategory(NAVIGABLE_CATEGORIES[prevIdx]);
        }
      }
    } else if (wasSwipingRef.current) {
      setTimeout(() => {
        wasSwipingRef.current = false;
      }, 200);
    }
  };

  const handleTileClickGuard = (tile: AACTile) => {
    if (wasSwipingRef.current) return;
    onSelectTile(tile);
  };

  return (
    <div
      className="flex-1 flex flex-col justify-between w-full max-w-7xl mx-auto px-2 sm:px-4 py-2 min-h-0 overflow-hidden select-none"
      onTouchStart={(e) => {
        if (e.touches.length === 1) {
          handleGestureStart(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onTouchMove={(e) => {
        if (e.touches.length === 1) {
          handleGestureMove(e.touches[0].clientX, e.touches[0].clientY);
        }
      }}
      onTouchEnd={(e) => {
        if (e.changedTouches.length > 0) {
          handleGestureEnd(e.changedTouches[0].clientX, e.changedTouches[0].clientY);
        }
      }}
      onTouchCancel={() => {
        touchStartRef.current = null;
      }}
      onMouseDown={(e) => {
        if (e.button === 0) {
          isMouseDownRef.current = true;
          handleGestureStart(e.clientX, e.clientY);
        }
      }}
      onMouseMove={(e) => {
        if (isMouseDownRef.current) {
          handleGestureMove(e.clientX, e.clientY);
        }
      }}
      onMouseUp={(e) => {
        if (isMouseDownRef.current) {
          isMouseDownRef.current = false;
          handleGestureEnd(e.clientX, e.clientY);
        }
      }}
      onMouseLeave={(e) => {
        if (isMouseDownRef.current) {
          isMouseDownRef.current = false;
          handleGestureEnd(e.clientX, e.clientY);
        }
      }}
    >
      {/* Tile Grid Container with Horizontal Carousel Slide Animation */}
      <div className="flex-1 min-h-0 relative overflow-hidden">
        <AnimatePresence mode="wait" custom={slideDirection} initial={false}>
          <motion.div
            key={`${activeCategory}-${currentPage}-${currentTier}-${gridDensityMastery}-${contrastMode}`}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: 'spring', stiffness: 320, damping: 32 },
              opacity: { duration: 0.18 },
            }}
            className={`grid ${gridClasses} w-full h-full`}
          >
            {currentTiles.map((tile) => (
              <TileItem
                key={tile.id}
                tile={tile}
                langCode={langCode}
                contrastMode={contrastMode}
                isEditMode={isEditMode}
                onSelect={handleTileClickGuard}
                onEdit={onEditTile}
              />
            ))}

            {/* Add custom tile button in edit mode or when room is available */}
            {isEditMode && currentTiles.length < pageSize && (
              <button
                type="button"
                id="btn-grid-add-tile"
                onClick={() => onAddNewTile(activeCategory)}
                className="flex flex-col items-center justify-center p-3 sm:p-4 rounded-3xl border-2 border-dashed border-slate-300 hover:border-indigo-500 bg-white/80 hover:bg-indigo-50/60 text-slate-500 hover:text-indigo-600 transition-colors shadow-xs"
              >
                <PlusCircle className="w-8 h-8 sm:w-10 sm:h-10 mb-1" />
                <span className="font-bold text-xs sm:text-sm uppercase tracking-wider">Add Tile</span>
              </button>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Category Indicator Pills & Pagination Footer */}
      <div className="flex flex-col items-center gap-1.5 pt-2 shrink-0 select-none">
        {/* Category Indicator Pills Bar */}
        <div className="flex items-center justify-center gap-1.5 max-w-full overflow-x-auto scrollbar-none py-1 px-2">
          {NAVIGABLE_CATEGORIES.map((catId) => {
            const catObj = AAC_CATEGORIES.find((c) => c.id === catId);
            const isActive = activeCategory === catId;
            if (!catObj) return null;

            return (
              <button
                key={catId}
                type="button"
                onClick={() => onSelectCategory(catId)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs transition-all active:scale-95 ${
                  isActive
                    ? 'bg-indigo-600 dark:bg-indigo-500 text-white font-extrabold shadow-xs ring-2 ring-indigo-300 dark:ring-indigo-800 scale-105'
                    : 'bg-slate-200/90 hover:bg-slate-300 dark:bg-neutral-800 dark:hover:bg-neutral-700 text-slate-700 dark:text-neutral-300 font-medium opacity-75 hover:opacity-100'
                }`}
                title={`Switch to ${getCategoryTitle(catId, langCode)}`}
              >
                <span className="text-xs leading-none">{catObj.emoji}</span>
                {isActive && (
                  <span className="text-[11px] uppercase tracking-wider font-bold whitespace-nowrap">
                    {getCategoryTitle(catId, langCode)}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Page Pagination Footer if multiple pages */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 py-0.5 select-none">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
              disabled={currentPage === 0}
              className="p-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 shadow-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-95 transition-transform"
              aria-label="Previous Page"
            >
              <ChevronLeft className="w-4 h-4 text-slate-700 dark:text-slate-200" />
            </button>

            <div className="flex items-center gap-1.5">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCurrentPage(i)}
                  className={`h-2 rounded-full transition-all ${
                    currentPage === i
                      ? 'bg-indigo-600 w-6'
                      : 'bg-slate-300 dark:bg-neutral-600 hover:bg-slate-400 w-2'
                  }`}
                  aria-label={`Go to page ${i + 1}`}
                />
              ))}
            </div>

            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={currentPage === totalPages - 1}
              className="p-1.5 rounded-lg bg-white dark:bg-neutral-800 border border-slate-300 dark:border-neutral-700 shadow-xs disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 active:scale-95 transition-transform"
              aria-label="Next Page"
            >
              <ChevronRight className="w-4 h-4 text-slate-700 dark:text-slate-200" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
