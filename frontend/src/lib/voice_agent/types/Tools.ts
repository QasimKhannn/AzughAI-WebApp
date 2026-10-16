export interface ParamMeta {
    type: string;
    description: string;
}

export interface ReturnMeta {
    [key: string]: {
        type: string;
        description: string;
    };
}

export interface FunctionMeta {
    name: string;
    description: string;
    params: { [key: string]: ParamMeta };
    required: string[];
    returns: ReturnMeta;
}

export interface ToolProperty {
    type: string;
    description: string;
    enum?: string[];
}

export interface ToolParameters {
    type: string;
    properties: Record<string, ToolProperty>;
    required: string[];
}

export interface ToolObject {
    type: string;
    name: string;
    description: string;
    parameters: ToolParameters;
}

export interface ToolCall {
    object: string;
    id: string;
    type: string;
    status: string;
    name: string;
    call_id: string;
    arguments: string;
}

export interface ToolCallOutput {
    type: string;
    call_id: string;
    output: string;
}
