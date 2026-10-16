/**
 * WidgetRenderer Component
 * 
 * PURPOSE: Renders interactive widgets and tool calls in agent messages
 * 
 * RESPONSIBILITIES:
 * - Receive widget/tool call information from AgentMessage
 * - Determine which widget to render based on tool_name
 * - Pass widget-specific props to specialized widget components
 * - Handle unknown widget types gracefully
 * 
 * PROPS:
 * - name: string (tool_name from message.tool_call)
 * - arguments: Record<string, unknown> (tool arguments)
 * - messageId: string (for tracking interactions)
 * - onInteraction?: (data) => void (callback for widget interactions)
 * - onExpand?: () => void (optional expand/fullscreen handler)
 * - showExpandButton?: boolean (whether to show expand option)
 * 
 * WIDGET TYPES:
 * - Currently commented out: choose_strategy, collect_trade_details, draw_setup
 * - TODO: Define widgets for digital archive context:
 *   → document_viewer (display document preview)
 *   → search_results (show search results)
 *   → document_summary (summarized content)
 *   → deep_search (advanced search interface)
 * 
 * USAGE IN AgentMessage:
 * ```tsx
 * {message.msg_type === 'tool_call' && message.tool_call && (
 *   <WidgetRenderer 
 *     name={message.tool_call.tool_name}
 *     arguments={message.tool_call.arguments}
 *     messageId={message.id}
 *   />
 * )}
 * ```
 * 
 * IMPLEMENTATION GUIDE:
 * 1. Uncomment and adapt existing code structure
 * 2. Define widget components for archive features
 * 3. Add switch cases for each widget type
 * 4. Include fallback for unknown widgets (with debug info)
 * 5. Style consistently with message design
 * 
 * CURRENT STATE:
 * - All code is commented out
 * - Need to uncomment and adapt to digital archive use case
 * - Remove trading-specific widgets, add archive-specific ones
 */

import type { WidgetProps } from '../../types';
import { ItemsWidget } from './main';
import { OpenAestheticsWidget, UploadImagesWidget, UploadClosetItemsWidget, FinishOnboardingWidget } from './onboarding';

interface WidgetRendererProps extends WidgetProps {
  name: string;
}

export default function WidgetRenderer({ name, arguments: args, messageId, onInteraction}: WidgetRendererProps) {
  const widgetProps = { arguments: args, messageId, onInteraction};

  const renderWidget = () => {
    switch (name) {
      case 'lookup_items':
        console.log('Rendering ItemsWidget with args:', args);
        return <ItemsWidget {...widgetProps} />;
      case 'open_aesthetics':
        return <OpenAestheticsWidget {...widgetProps} />;
      case 'upload_images':
        return <UploadImagesWidget {...widgetProps} />;
      case 'upload_closet_items':
        return <UploadClosetItemsWidget {...widgetProps} />;
      case 'finish_onboarding':
        return <FinishOnboardingWidget {...widgetProps} />;
      case 'create_plan':
        return null; // Handled internally by agent, no UI widget needed
      default:
        return (
          <div className="rounded-lg p-4 bg-chat-assistant">
            <div className="text-yellow-400 text-sm">
              ⚠️ Unknown widget type: <code className="bg-gray-700 px-2 py-1 rounded">{name}</code>
            </div>
            <details className="mt-2">
              <summary className="text-gray-400 text-xs cursor-pointer">Debug Info</summary>
              <pre className="text-xs text-gray-500 mt-1 overflow-x-auto">
                {JSON.stringify({ name, arguments: args }, null, 2)}
              </pre>
            </details>
          </div>
        );
    }
  };

  return (
    <div className="relative">
      {/* Widget Content */}
      {renderWidget()}
    </div>
  );
}

/**
 * TODO: Uncomment above code and adapt for digital archive widgets
 * 
 * Steps:
 * 1. Remove trading-specific widget imports
 * 2. Create new widget components for archive features
 * 3. Update switch cases with archive widget names
 * 4. Keep the default case (unknown widget handler)
 * 5. Test with different tool calls from backend
 */
