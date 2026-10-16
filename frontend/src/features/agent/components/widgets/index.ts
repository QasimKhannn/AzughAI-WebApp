/**
 * Widget Components Index
 * 
 * PURPOSE: Central export point for widget components
 * 
 * CURRENT EXPORTS:
 * - NewChatWidgetOptions: Initial chat options (working)
 * 
 * TODO EXPORTS (when implemented):
 * - WidgetRenderer: Main widget router
 * - DeepSearchWidget: Deep search results
 * - Other archive-specific widgets
 * 
 * USAGE:
 * import { NewChatWidgetOptions, WidgetRenderer } from '@/features/agent/components/widgets';
 * 
 * See docs/CHAT_FEEDBACK.md for detailed implementation guide
 */

export { default as StartOptionsWidget } from "./StartOptionsWidget";
export { default as WidgetRenderer } from './WidgetRenderer'; // TODO: Uncomment after implementation
