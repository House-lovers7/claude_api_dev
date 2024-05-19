export interface ToolUseContent {
    type: "tool_use";
    id: string;
    name: string;
    input: Record<string, any>;
  }
  
  export interface ToolUseResponse {
    id: string;
    model: string;
    stopReason: "tool_use";
    content: ToolUseContent[];
  }