export interface RepoContext {
  owner: string;
  repo: string;
  description: string | null;
  language: string | null;
  stars: number;
  forks: number;
  topics: string[];
  readme: string | null;
  fileTree: FileTreeEntry[];
  packageJson: Record<string, unknown> | null;
  techStack: string[];
}

export interface FileTreeEntry {
  path: string;
  type: "blob" | "tree";
  size?: number;
}

export interface AnalysisResult {
  techStack: string[];
  architecture: string;
  asciiBlueprint: string;
  buildPrompt: string;
  dependencies: DependencyInfo[];
  apiRoutes: ApiRoute[];
  envVars: EnvVar[];
  deploymentSteps: string[];
}

export interface DependencyInfo {
  name: string;
  version: string;
  purpose: string;
  category: "runtime" | "dev" | "peer";
}

export interface ApiRoute {
  method: string;
  path: string;
  description: string;
}

export interface EnvVar {
  key: string;
  required: boolean;
  description: string;
  example?: string;
}

export interface LibraryEntry {
  id: string;
  owner: string;
  repo: string;
  title: string;
  description: string;
  stars: number;
  language: string | null;
  createdAt: string;
  promptPreview: string;
}

export type LLMProvider = "grok" | "openrouter" | "azure" | "google" | "auto";
export type AnalysisMode = "quick" | "deep";
