export interface ToolUseRequest {
    toolName: string;
    toolInput: Record<string, any>;
  }
  
  export interface ToolResultRequest {
    toolUseId: string;
    content: string | object;
    isError?: boolean;
  }