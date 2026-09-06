import React, { useRef } from 'react';
import { AACTile, ContrastMode } from '../types';
import { getTileThemeClasses } from '../utils/themeUtils';
import { getTileDisplayLabel } from '../data/translations';
import { Mic, Volume2, Edit3 } from 'lucide-react';
import * as Icons from 'lucide-react';

interface TileItemProps {
  tile: AACTile;
  langCode: string;
  contrastMode: ContrastMode;
  isEditMode?: boolean;
  onSelect: (tile: AACTile) => void;
  onEdit?: (tile: AACTile) => void;
  isHighlighted?: boolean;
}

export const TileItem: React.FC<TileItemProps> = ({
  tile,
  langCode,
  contrastMode,
  isEditMode = false,
  onSelect,
  onEdit,
  isHighlighted = false,
}) => {
  const longPressTimer = useRef<NodeJS.Timeout | null>(null);

  // Get localized label from centralized dictionary or tile
  const displayLabel = getTileDisplayLabel(tile, langCode);
  const themeClasses = getTileThemeClasses(tile.fitzgeraldColor, contrastMode);

  // Dynamic Lucide icon lookup if specified
  const LucideIconComponent = tile.iconName ? (Icons as unknown as Record<string, React.ComponentType<{ className?: string }>>)[tile.iconName] : null;

  const handleTouchStart = () => {
    if (isEditMode) return;
    longPressTimer.current = setTimeout(() => {
      onEdit?.(tile);
    }, 650);
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    onEdit?.(tile);
  };

  return (
    <button
      type="button"
      id={`tile-${tile.id}`}
      onClick={() => (isEditMode ? onEdit?.(tile) : onSelect(tile))}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchEnd}
      onTouchEnd={handleTouchEnd}
      onTouchCancel={handleTouchEnd}
      onContextMenu={handleContextMenu}
      className={`relative group flex flex-col items-center justify-center p-2.5 sm:p-4 rounded-3xl cursor-pointer transition-all duration-100 select-none focus:outline-none focus:ring-4 focus:ring-indigo-500/50 ${themeClasses} ${
        isHighlighted ? 'scale-105 ring-4 ring-indigo-600 z-10 animate-pulse' : ''
      }`}
      style={{ minHeight: '80px', touchAction: 'manipulation' }}
      aria-label={displayLabel}
    >
      {/* Edit indicator badge */}
      {isEditMode && (
        <div className="absolute top-2 right-2 p-1.5 bg-indigo-600 text-white rounded-full shadow-md">
          <Edit3 className="w-3.5 h-3.5" />
        </div>
      )}

      {/* Recorded Voice Indicator */}
      {tile.audioRecordedBase64 && (
        <div
          className="absolute top-2 left-2 p-1 bg-purple-700/90 text-white rounded-full shadow-sm"
          title="Custom human voice recorded"
        >
          <Mic className="w-3 h-3" />
        </div>
      )}

      {/* Visual media: Custom Image > Emoji > Lucide Icon */}
      <div className="flex items-center justify-center flex-1 max-h-[60%] mb-1 pointer-events-none">
        {tile.customImageUrl ? (
          <img
            src={tile.customImageUrl}
            alt={displayLabel}
            referrerPolicy="no-referrer"
            className="w-10 h-10 sm:w-14 sm:h-14 object-cover rounded-2xl shadow-xs"
          />
        ) : tile.emoji ? (
          <span className="text-3xl sm:text-4xl md:text-5xl leading-none select-none filter drop-shadow-xs">
            {tile.emoji}
          </span>
        ) : LucideIconComponent ? (
          <LucideIconComponent className="w-8 h-8 sm:w-10 sm:h-10 opacity-90" />
        ) : (
          <Volume2 className="w-8 h-8 opacity-70" />
        )}
      </div>

      {/* Tile Label */}
      <span className="w-full text-center font-black tracking-tight text-xs sm:text-sm md:text-base lg:text-lg uppercase leading-tight truncate px-1 pointer-events-none font-sans">
        {displayLabel}
      </span>
    </button>
  );
};
