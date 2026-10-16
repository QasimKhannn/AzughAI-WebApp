import { create } from 'zustand';
import type { Aesthetic } from '@/features/aesthetics/types';

type HistoryEntry = {
	index: number;
	type: 'like' | 'dislike';
};

interface AestheticsState {
	// Data
	aesthetics: Aesthetic[];
	liked: Aesthetic[];
	disliked: Aesthetic[];
	currentIndex: number;
	leftStack: number[];
	rightStack: number[];
	history: HistoryEntry[];

	// Derived getters
	isComplete: () => boolean;
	currentAesthetic: () => Aesthetic | null;
	totalCount: () => number;

	// Actions
	setAesthetics: (items: Aesthetic[]) => void;
	like: () => void;
	dislike: () => void;
	undo: () => void;
	reset: () => void;
}

const getItemKey = (item: Aesthetic) => item.id;

const removeFromList = (list: Aesthetic[], item: Aesthetic) =>
	list.filter((entry) => getItemKey(entry) !== getItemKey(item));

const appendUnique = (list: Aesthetic[], item: Aesthetic) => {
	if (list.some((entry) => getItemKey(entry) === getItemKey(item))) return list;
	return [...list, item];
};

export const useAesthetics = create<AestheticsState>((set, get) => ({
	// Initial state
	aesthetics: [],
	liked: [],
	disliked: [],
	currentIndex: 0,
	leftStack: [],
	rightStack: [],
	history: [],

	// Derived getters
	isComplete: () => {
		const { currentIndex, aesthetics } = get();
		return aesthetics.length > 0 && currentIndex >= aesthetics.length;
	},

	currentAesthetic: () => {
		const { aesthetics, currentIndex } = get();
		return aesthetics[currentIndex] ?? null;
	},

	totalCount: () => get().aesthetics.length,

	// Actions
	setAesthetics: (items) => {
		// Ensure all items have an id
		const withIds = items.map((item, index) => ({
			...item,
			id: item.id ?? `aesthetic-${index}`,
		}));
		set({
			aesthetics: withIds,
			liked: [],
			disliked: [],
			currentIndex: 0,
			leftStack: [],
			rightStack: [],
			history: [],
		});
	},

	like: () => {
		const { aesthetics, currentIndex, liked, disliked, rightStack, history } = get();
		if (currentIndex >= aesthetics.length) return;

		const candidate = aesthetics[currentIndex];
		if (!candidate) return;

		const newLiked = appendUnique(removeFromList(liked, candidate), candidate);
		const newDisliked = removeFromList(disliked, candidate);

		set({
			liked: newLiked,
			disliked: newDisliked,
			rightStack: [...rightStack, currentIndex],
			currentIndex: currentIndex + 1,
			history: [...history, { index: currentIndex, type: 'like' }],
		});
	},

	dislike: () => {
		const { aesthetics, currentIndex, liked, disliked, leftStack, history } = get();
		if (currentIndex >= aesthetics.length) return;

		const candidate = aesthetics[currentIndex];
		if (!candidate) return;

		const newDisliked = appendUnique(removeFromList(disliked, candidate), candidate);
		const newLiked = removeFromList(liked, candidate);

		set({
			liked: newLiked,
			disliked: newDisliked,
			leftStack: [...leftStack, currentIndex],
			currentIndex: currentIndex + 1,
			history: [...history, { index: currentIndex, type: 'dislike' }],
		});
	},

	undo: () => {
		const { aesthetics, currentIndex, history, liked, disliked, leftStack, rightStack } = get();
		if (history.length === 0 || currentIndex === 0) return;

		const lastAction = history[history.length - 1];
		const target = aesthetics[lastAction.index];
		if (!target) return;

		const newLiked = lastAction.type === 'like' ? removeFromList(liked, target) : liked;
		const newDisliked = lastAction.type === 'dislike' ? removeFromList(disliked, target) : disliked;
		const newLeftStack = lastAction.type === 'dislike'
			? leftStack.filter((idx) => idx !== lastAction.index)
			: leftStack;
		const newRightStack = lastAction.type === 'like'
			? rightStack.filter((idx) => idx !== lastAction.index)
			: rightStack;

		set({
			liked: newLiked,
			disliked: newDisliked,
			leftStack: newLeftStack,
			rightStack: newRightStack,
			currentIndex: lastAction.index,
			history: history.slice(0, -1),
		});
	},

	reset: () => {
		set({
			aesthetics: [],
			liked: [],
			disliked: [],
			currentIndex: 0,
			leftStack: [],
			rightStack: [],
			history: [],
		});
	},
}));