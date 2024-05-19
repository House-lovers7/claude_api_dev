import { ToolInputSchema } from "../types";

export interface ToolDefinition {
  name: string;
  description: string;
  inputSchema: ToolInputSchema;
}