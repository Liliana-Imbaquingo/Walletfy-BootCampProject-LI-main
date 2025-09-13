// src/managers/LLMOpenAICompatibleManager.ts
import OpenAI from 'openai';

import { LLMBaseManager} from './LLMBaseManager';
import type { InferenceResult, LLMParams} from './LLMBaseManager';
import type { ChatCompletionMessageParam } from '@mlc-ai/web-llm';

    type OpenAIParams = LLMParams & {
    apiKey: string;
    projectId?: string; // Opcional, si se usa con OpenAI
    };

    export class LLMOpenAICompatibleManager extends LLMBaseManager {
    private apiKey: string;
    private projectId: string;
    private client: OpenAI | null = null;

    constructor(params: OpenAIParams) {
        super(params);
        this.apiKey = params.apiKey;
        this.projectId = params.projectId || '';
    }

    loadModel() {
        if (this.client) {
        console.log(`[OpenAI] Client already initialized for ${this.modelName}.`);
        return;
        }
        console.log(`[OpenAI] Initializing client for model: ${this.modelName}...`);
        try {
        if (!this.apiKey) {
            throw new Error('Missing OpenAI API key');
        }

        this.client = new OpenAI({
            apiKey: this.apiKey,
            project: this.projectId,
            dangerouslyAllowBrowser: true,
        });
        console.log('[OpenAI] Client ready.');
        } catch (err) {
        console.error('[OpenAI] Init error:', err);
        throw new Error('Failed to init OpenAI client');
        }
    }

    unloadModel() {
        console.log(
        `[OpenAI] Cleaning up resources for ${this.modelName} (no unload needed).`
        );
        this.client = null;
        this.model = null;
    }

    async infer(prompt: string): Promise<InferenceResult> {
        await this.ensureModelLoaded();

        if (!this.client) throw new Error('OpenAI client not ready');
        console.log(`[OpenAI] Inferring: ${prompt}`);

        const messages: Array<ChatCompletionMessageParam> = [
        {
            role: 'system',     
            content: this.systemPrompt || 'Eres un asistente útil, responde de forma concisa.',
        },
        { role: 'user', content: prompt },
        ];
        const resp = await this.client.chat.completions.create({
        model: this.modelName,
        messages,
        temperature: this.temperature,
        });
        const text = resp.choices[0]?.message?.content ?? '';
        return { text };
    }

    async *stream(prompt: string): AsyncIterable<string> {
        await this.ensureModelLoaded();

        if (!this.client) throw new Error('OpenAI client not ready');

        console.log(`[OpenAI] Inferring: ${prompt}`);
        const messages: Array<ChatCompletionMessageParam> = [
        {
            role: 'system',
            content: this.systemPrompt || 'Eres un asistente útil, responde de forma concisa.',
        },
        { role: 'user', content: prompt },
        ];
        const streamIter = await this.client.chat.completions.create({
        model: this.modelName,
        messages,
        temperature: this.temperature,
        stream: true,
        stream_options: { include_usage: true },
        });
        for await (const chunk of streamIter) {
        const {content} = chunk.choices[0].delta;
        if (content) yield content
        
        }
    }
}