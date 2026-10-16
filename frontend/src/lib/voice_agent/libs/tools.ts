import { log } from './utils'
import { FunctionMeta, ToolObject, ToolCall, ToolCallOutput } from '../types/Tools';
import { UserProfileService } from '../../../services/UserProfileService';

export class Tools {
    public toolObjectRegistry: Map<string, ToolObject> = new Map();
    public toolRegistry: Map<string, Function> = new Map();

    constructor() {
        // Initialize tool registry if needed
        this.init();

    }

    init() {
        // record all the tools into the registry
        const tools = Object.getOwnPropertyNames(Object.getPrototypeOf(this))
            .filter(name => {
                // Filter out methods that should be excluded and non-functions
                const excludedMethods = ['constructor', 'registerToolObject', 'getToolObject', 'getAllToolObjects', 'extractMeta', 'composeToolObject', 'runToolCall', 'init'];
                return !excludedMethods.includes(name) && typeof this[name as keyof this] === 'function';
            });

        for (const toolName of tools) {
            const toolFunction = this[toolName as keyof this] as Function;

            // Extract metadata from the function
            const meta = this.extractMeta(toolFunction);

            if (meta) {
                // Create tool object and register it
                const toolObject = this.composeToolObject(meta);
                this.toolRegistry.set(toolName, toolFunction);
                this.registerToolObject(toolName, toolObject);
                //console.log(`Registered tool: ${toolName}`);
            } else {
                console.warn(`No metadata found for method: ${toolName}`);
            }
        }
        return this;
    }

    registerToolObject(toolName: string, metadata: any) {
        this.toolObjectRegistry.set(toolName, metadata);
    }

    getToolObject(toolName: string): any {
        return this.toolObjectRegistry.get(toolName);
    }

    getAllToolObjects(): ToolObject[] {
        const toolObjects: ToolObject[] = [];
        this.toolObjectRegistry.forEach((toolObject) => {
            toolObjects.push(toolObject);
        });
        return toolObjects;
    }

    extractMeta(fn: Function): FunctionMeta | null {
        const fnStr = fn.toString();

        const metaMatch = fnStr.match(/\/\*\s*@meta\s*([\s\S]*?)\*\//);
        if (!metaMatch) return null;

        const jsonStr = metaMatch[1]
            .replace(/^\s*\*\s?/gm, '') // remove leading `*` from each line (if any)
            .trim();

        try {
            const parsed = JSON.parse(jsonStr);
            //console.log(`Extracted meta for function: ${fn.name}`);
            parsed.name = fn.name;
            return parsed;
        } catch (err) {
            console.error('Failed to parse @meta JSON:', err);
            return null;
        }
    }

    composeToolObject(meta: FunctionMeta): ToolObject {
        const toolObject = {
            type: 'function',
            name: meta.name,
            description: meta.description,
            parameters: {
                type: 'object',
                properties: {} as Record<string, { type: string, description: string, enum?: string[] }>,
                required: meta.required || [],
            }
        }
        for (const [key, value] of Object.entries(meta.params)) {
            const paramObject: { type: string, description: string, enum?: string[] } = {
                type: value.type,
                description: value.description,
            };

            // Add enum if it exists
            if ('enum' in value) {
                paramObject.enum = (value as any).enum;
            }

            toolObject.parameters.properties[key] = paramObject;
        }
        return toolObject;
    }

    runToolCall(toolCall: ToolCall ): ToolCallOutput {
        // Extract the tool name and arguments from the tool call
        const { name, arguments: argsString } = toolCall;
        const args = JSON.parse(argsString);

        // Check if the tool exists in the registry
        const toolObject = this.getToolObject(name);
        if (!toolObject) {
            const toolCallOutput: ToolCallOutput = {
                type: 'function_call_output',
                call_id: toolCall.call_id,
                output: JSON.stringify({ error: `Tool ${name} not found, try again with a given tool` }),
            }
            return toolCallOutput;
        }

        // Call the tool function with the provided arguments
        const result = this.toolRegistry.get(name)!.call(this, ...Object.values(args));
        const toolCallOutput: ToolCallOutput = {
            type: 'function_call_output',
            call_id: toolCall.call_id,
            output: JSON.stringify(result),
        }
        return toolCallOutput;
    }

    record_name(name: string): object {
        /*
        @meta
        {
            "description": "Records the user's name",
            "params": {
                "name": {
                    "type": "string",
                    "description": "The user's name"
                }
            },
            "required": ["name"],
            "returns": {
                "output": {
                    "type": "object",
                    "description": "The result of the operation"
                }
            }
        }
        */
        log(`Recording user name: ${name}`);

        UserProfileService.getInstance().updateProfile('name', name);
        const output = {
            outcome: 'success',
            message: 'User name recorded successfully',
        }
        return output;
    }

    record_gender(gender: string): object {
        /*
        @meta
        {
            "description": "Records the user's gender identity",
            "params": {
                "gender": {
                    "type": "string",
                    "description": "The user's gender identity (men, women, non-binary, gender fluid, prefer not to say)",
                    "enum": ["men", "women", "non-binary", "gender fluid", "prefer not to say"]
                }
            },
            "required": ["gender"],
            "returns": {
                "output": {
                    "type": "object",
                    "description": "The result of the operation"
                }
            }
        }
        */
        log(`Recording user gender identity: ${gender}`);
        UserProfileService.getInstance().updateProfile('gender', gender)
        const output = {
            outcome: 'success',
            message: 'User gender identity recorded successfully',
        }
        return output;
    }

    record_age(age: number): object {
        /*
        @meta
        {
            "description": "Records the user's age",
            "params": {
                "age": {
                    "type": "number",
                    "description": "The user's age"
                }
            },
            "required": ["age"],
            "returns": {
                "output": {
                    "type": "object",
                    "description": "The result of the operation"
                }
            }
        }
        */
        log(`Recording user age: ${age}`);
        UserProfileService.getInstance().updateProfile('age', age);
        const output = {
            outcome: 'success',
            message: 'User age recorded successfully',
        }
        return output;
    }

    record_spending(amount: number, currency: string): object {
        /*
        @meta
        {
            "description": "Records the user's average spending on clothing",
            "params": {
                "amount": {
                    "type": "number",
                    "description": "The average amount the user spends on a piece of clothing"
                },
                "currency": {
                    "type": "string",
                    "description": "The currency of the amount",
                    "enum": ["USD", "EUR", "GBP"]
                }
            },
            "required": ["amount", "currency"],
            "returns": {
                "output": {
                    "type": "object",
                    "description": "The result of the operation"
                }
            }
        }
        */
        log(`Recording user average spending: ${amount} ${currency}`);
        UserProfileService.getInstance().updateProfile('spending', { amount, currency });
        const output = {
            outcome: 'success',
            message: 'User average spending recorded successfully',
        }
        return output;
    }
    
    display_details(): object {
        /*
        @meta
        {
            "description": "Displays the user's profile details in the UI",
            "params": {},
            "required": [],
            "returns": {
                "output": {
                    "type": "object",
                    "description": "The result of the operation and the user profile data"
                }
            }
        }
        */
        log("Displaying user details in the UI");
        
        // Get the user profile data
        const userProfile = UserProfileService.getInstance().getProfile();
        
        // Dispatch a custom event that the VoiceAgent component will listen for
        const displayDetailsEvent = new CustomEvent('displayUserDetails', { 
            detail: userProfile 
        });
        document.dispatchEvent(displayDetailsEvent);
        
        const output = {
            outcome: 'success',
            message: 'User details displayed successfully',
            data: userProfile
        }
        return output;
    }
}