from typing import List


# Try import the message models from django project if available
try:
    from agent.models import Message
except ImportError:
    from .models import Message  # Fallback to local models
#from .models import Sender


#from langchain.schema.runnable import Runnable
from langchain_core.messages import AIMessage, HumanMessage, ToolMessage


def recompose_thread_messages(messages: List[Message]) -> List:
    """
    Recompose messages from the thread into a format suitable for the agent.
    """
    recomposed_messages = []
    for message in messages:
        if message.sender == Message.Sender.USER:
            recomposed_messages.append(HumanMessage(content=message.content))
        elif message.sender == Message.Sender.AGENT and message.msg_type == Message.MsgType.TEXT:
            recomposed_messages.append(AIMessage(content=message.content))
        elif message.sender == Message.Sender.AGENT and message.msg_type == Message.MsgType.TOOL_CALL:
            print(f"Tool call: {message.tool_call.tool.name} with args: {message.tool_call.arguments}")
            tool_call_message = AIMessage(
                content=message.content,
                tool_calls=[{
                    "name": message.tool_call.tool.name,
                    "args": message.tool_call.arguments if message.tool_call.arguments else {},
                    "id": str(message.tool_call.id),
                }]
            )
            recomposed_messages.append(tool_call_message)
            # attach the tool call execution result if available
            tool_call_execution = ToolMessage(
                content=message.tool_call.result_data if message.tool_call.result_data else "",
                tool_call_id=str(message.tool_call.id),
            )
            recomposed_messages.append(tool_call_execution)
        else:
            raise ValueError(f"Unknown sender type: {message.sender}")
    return recomposed_messages


def add_chunk_delimiters(chunk: str, delimiter: str = "####CHUNK_DELIMITER####") -> str:
    """
    Add delimiters to a chunk of text to separate it from other chunks.
    
    Args:
        chunk: The text chunk to delimit
        delimiter: The delimiter string to use
    
    Returns:
        Text with delimiters added
    """
    return f"{delimiter}{chunk}{delimiter}"