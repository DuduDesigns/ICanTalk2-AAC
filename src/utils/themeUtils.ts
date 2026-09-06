import { FitzgeraldColor, ContrastMode } from '../types';

export function getTileThemeClasses(color: FitzgeraldColor, contrastMode: ContrastMode): string {
  if (contrastMode === 'yellow-on-black') {
    return 'bg-neutral-900 border-b-4 border-yellow-400 text-yellow-300 active:bg-neutral-800 shadow-md';
  }

  if (contrastMode === 'high-contrast-dark') {
    switch (color) {
      case 'pronoun':
        return 'bg-neutral-900 border-b-4 border-yellow-400 text-yellow-200 active:bg-neutral-800 shadow-md';
      case 'verb':
        return 'bg-neutral-900 border-b-4 border-emerald-400 text-emerald-200 active:bg-neutral-800 shadow-md';
      case 'noun':
        return 'bg-neutral-900 border-b-4 border-orange-400 text-orange-200 active:bg-neutral-800 shadow-md';
      case 'descriptor':
        return 'bg-neutral-900 border-b-4 border-sky-400 text-sky-200 active:bg-neutral-800 shadow-md';
      case 'social':
        return 'bg-neutral-900 border-b-4 border-pink-400 text-pink-200 active:bg-neutral-800 shadow-md';
      case 'emergency':
        return 'bg-neutral-900 border-b-4 border-red-500 text-red-300 active:bg-neutral-800 shadow-lg ring-2 ring-red-500/50 animate-pulse';
      case 'preposition':
      default:
        return 'bg-neutral-900 border-b-4 border-purple-400 text-purple-200 active:bg-neutral-800 shadow-md';
    }
  }

  if (contrastMode === 'high-contrast-light') {
    switch (color) {
      case 'pronoun':
        return 'bg-amber-100 hover:bg-amber-200 border-b-4 border-amber-600 text-black font-black active:translate-y-0.5 shadow-md';
      case 'verb':
        return 'bg-emerald-100 hover:bg-emerald-200 border-b-4 border-emerald-700 text-black font-black active:translate-y-0.5 shadow-md';
      case 'noun':
        return 'bg-orange-100 hover:bg-orange-200 border-b-4 border-orange-600 text-black font-black active:translate-y-0.5 shadow-md';
      case 'descriptor':
        return 'bg-sky-100 hover:bg-sky-200 border-b-4 border-sky-600 text-black font-black active:translate-y-0.5 shadow-md';
      case 'social':
        return 'bg-pink-100 hover:bg-pink-200 border-b-4 border-pink-600 text-black font-black active:translate-y-0.5 shadow-md';
      case 'emergency':
        return 'bg-red-500 hover:bg-red-600 border-b-4 border-red-800 text-white font-black active:translate-y-0.5 shadow-lg ring-2 ring-red-600 animate-pulse';
      case 'preposition':
      default:
        return 'bg-purple-100 hover:bg-purple-200 border-b-4 border-purple-700 text-black font-black active:translate-y-0.5 shadow-md';
    }
  }

  // Standard "Sleek Interface" Fitzgerald 3D Palette
  switch (color) {
    case 'pronoun':
      return 'bg-yellow-400 hover:bg-yellow-300 border-b-4 border-yellow-600 text-yellow-950 active:translate-y-0.5 shadow-md';
    case 'verb':
      return 'bg-green-400 hover:bg-green-300 border-b-4 border-green-600 text-green-950 active:translate-y-0.5 shadow-md';
    case 'noun':
      return 'bg-orange-400 hover:bg-orange-300 border-b-4 border-orange-600 text-orange-950 active:translate-y-0.5 shadow-md';
    case 'descriptor':
      return 'bg-blue-400 hover:bg-blue-300 border-b-4 border-blue-600 text-blue-950 active:translate-y-0.5 shadow-md';
    case 'social':
      return 'bg-pink-400 hover:bg-pink-300 border-b-4 border-pink-600 text-pink-950 active:translate-y-0.5 shadow-md';
    case 'emergency':
      return 'bg-red-500 hover:bg-red-600 border-b-4 border-red-700 text-white active:translate-y-0.5 shadow-lg ring-2 ring-red-400 animate-pulse';
    case 'preposition':
    default:
      return 'bg-slate-300 hover:bg-slate-200 border-b-4 border-slate-500 text-slate-900 active:translate-y-0.5 shadow-md';
  }
}

export function getChipThemeClasses(color: FitzgeraldColor, contrastMode: ContrastMode): string {
  if (contrastMode === 'yellow-on-black' || contrastMode === 'high-contrast-dark') {
    return 'bg-neutral-800 border-2 border-yellow-400 text-yellow-200';
  }
  if (contrastMode === 'high-contrast-light') {
    return 'bg-neutral-100 border-2 border-black text-black font-bold';
  }

  switch (color) {
    case 'pronoun':
      return 'bg-yellow-100 border-2 border-yellow-400 text-yellow-950';
    case 'verb':
      return 'bg-green-100 border-2 border-green-400 text-green-950';
    case 'noun':
      return 'bg-orange-100 border-2 border-orange-400 text-orange-950';
    case 'descriptor':
      return 'bg-blue-100 border-2 border-blue-400 text-blue-950';
    case 'social':
      return 'bg-pink-100 border-2 border-pink-400 text-pink-950';
    case 'emergency':
      return 'bg-red-100 border-2 border-red-500 text-red-950';
    case 'preposition':
    default:
      return 'bg-slate-200 border-2 border-slate-400 text-slate-900';
  }
}

export function getAppBackgroundClasses(contrastMode: ContrastMode): string {
  switch (contrastMode) {
    case 'yellow-on-black':
    case 'high-contrast-dark':
      return 'bg-slate-950 text-slate-100';
    case 'high-contrast-light':
      return 'bg-white text-black';
    case 'standard':
    default:
      return 'bg-slate-50 text-slate-900';
  }
}
