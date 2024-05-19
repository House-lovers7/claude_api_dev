export interface ToolParameter {
    type: string;
    description: string;
    enum?: string[];
  }
  
  export interface ToolInputSchema {
    type: "object";
    properties: Record<string, ToolParameter>;
    required?: string[];
  }