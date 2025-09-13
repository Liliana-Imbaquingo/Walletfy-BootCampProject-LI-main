// src/managers/LLMBaseManager.ts

// Definiciones básicas de tipos
export interface LLMParams {
    modelName: string;
    // Agrega aquí parámetros comunes si los hay, como temperature, etc.
    temperature?: number;
    systemprompt?: string; // Ejemplo de otro parámetro común
    topP?: number;
}

export interface LLMOptions {
  // Parámetros específicos para cada tipo de manager
  // Esto permite que cada manager defina sus propias opciones.
    [key: string]: any;
}

export interface InferenceResult {
    text: string;
}

const DEFAULT_SSYSTEM_PROMPT = "Eres un asistente útil y amigable. T";

export  abstract class LLMBaseManager {
    protected modelName: string;
    protected temperature: number;
    protected model: unknown; // El modelo cargado o cliente API
    protected systemPrompt?: string;
    protected topP?: number;

    constructor(params: LLMParams) {
        this.modelName = params.modelName;
        this.temperature = params.temperature || 0.7; // Valor por defecto
        this.model = null; // Inicialmente no hay modelo cargado
        this.systemPrompt = params.systemprompt || DEFAULT_SSYSTEM_PROMPT
        this.topP = params.topP || 0.9; // Valor por defecto
    }

    // Abstract: Cada Manager debe implementar cómo cargar el modelo
    abstract loadModel(): Promise<void> | void;

    // Abstract: Cada Manager debe implementar cómo liberar recursos
    abstract unloadModel(): Promise<void> | void;

    // Abstract: Cada Manager debe implementar la inferencia (completar texto)
    abstract infer(prompt: string): Promise<InferenceResult>;

    // Abstract: Cada Manager debe implementar la inferencia con streaming
    // Esto devolverá un AsyncIterable o un stream para poder iterar sobre las palabras
    abstract stream(prompt: string): AsyncIterable<string>;

    // --- Métodos comunes (o protegidos) ---
    protected async ensureModelLoaded(): Promise<void> {   // base
        if (!this.model) {
        await this.loadModel();
        }
    }

    protected async ensureModelUnloaded(): Promise<void> {
        // Esto es más para limpieza explícita si fuera necesario.
        // loadModel y unloadModel se llaman externamente.
    }
}