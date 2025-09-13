// src/Chat.tsx
import { useEffect, useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { LLMWebLLMManager } from '../managers/LLMWebLLMManager';
import type { LLMBaseManager } from '@/managers/LLMBaseManager';

// Datos de ejemplo
const dataLocalStorage = [ /* tus eventos aquí */ ];

// --- System Prompt fijo ---
const SYSTEM_PROMPT = `
Eres WalletAI, un asistente útil y confiable.
Tu rol es responder consultas sobre eventos, ingresos y gastos de los usuarios.
No inventes información; solo utiliza los datos proporcionados en cada consulta.
Responde de forma clara, concisa y organizada.
El usuario te proporcionará un JSON con los eventos y podrá pedir información filtrada por mes, año u otros criterios.
Siempre adapta tu respuesta a la consulta específica.
`;

export default function Chat() {
  const [llmManager, setLlmManager] = useState<LLMBaseManager | null>(null);
  const [userPrompt, setUserPrompt] = useState<string>('');
  const [response, setResponse] = useState<string>('');
  const [streamingResponse, setStreamingResponse] = useState<string>('');
  const [loadingModel, setLoadingModel] = useState(true);
  const [errorModel, setErrorModel] = useState<string | null>(null);

  const queryClient = useQueryClient();

  // --- Inicializar modelo ---
  useEffect(() => {
    const initializeManager = async () => {
      try {
        setLoadingModel(true);
        setErrorModel(null);

        const manager: LLMBaseManager = new LLMWebLLMManager({
          modelName: 'TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC',
          temperature: 0.7,
          topP: 0.9,
          systemprompt: SYSTEM_PROMPT,
        });

        setLlmManager(manager);
        await manager.loadModel();
        console.log('✅ Modelo cargado!');
      } catch (err: any) {
        console.error(err);
        setErrorModel('Error al cargar el modelo');
      } finally {
        setLoadingModel(false);
      }
    };

    initializeManager();

    return () => {
      if (llmManager) llmManager.unloadModel();
    };
  }, []);

  // --- Mutación de inferencia ---
  const inferMutation = useMutation({
    mutationFn: async (prompt: string) => {
      if (!llmManager) throw new Error('LLM Manager no inicializado.');

      setResponse('');
      setStreamingResponse('');

      // --- Construimos prompt dinámico ---
      const userPrompt = `
Dame los eventos filtrados según la consulta del usuario: "${prompt}".
Datos de usuario: ${JSON.stringify(dataLocalStorage)}
      `;

      return llmManager.infer({ prompt: userPrompt, systemPrompt: SYSTEM_PROMPT });
    },
    onSuccess: (data) => {
      setResponse(data.text);
      setUserPrompt('');
      queryClient.invalidateQueries(['llmResponse']);
    },
    onError: (error: any) => {
      console.error(error);
      setResponse('Error: ' + (error?.message || 'Unknown error'));
    },
  });

  // --- UI ---
  return (
    <div className="flex flex-col h-90vh bg-zinc-50 text-black dark:bg-zinc-900">
      {loadingModel && (
        <div className="flex-1 flex flex-col items-center justify-center space-y-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-lg font-semibold text-gray-700 dark:text-gray-200">
            Cargando modelo, por favor espera...
          </p>
        </div>
      )}

      {errorModel && (
        <div className="flex-1 flex items-center justify-center text-red-500">
          <p>{errorModel}</p>
        </div>
      )}

      {!loadingModel && !errorModel && (
        <>
          <div className="flex-1 flex flex-col p-4 overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Chat</h2>

            {response && (
              <div className="mb-2 p-3 bg-zinc-200 dark:bg-zinc-800 rounded-md">
                <p className="font-semibold text-blue-500">Respuesta:</p>
                <p>{response}</p>
              </div>
            )}

            {!response && (
              <p className="text-center text-gray-500">
                Escribe un prompt para empezar...
              </p>
            )}
          </div>

          <div className="flex items-center p-4 bg-zinc-100 dark:bg-zinc-800">
            <input
              type="text"
              value={userPrompt}
              onChange={(e) => setUserPrompt(e.target.value)}
              placeholder="Ej: Dame los eventos de enero 2025"
              className="flex-1 p-3 mr-4 rounded bg-white dark:bg-zinc-700 focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && userPrompt) {
                  inferMutation.mutate(userPrompt);
                }
              }}
            />
            <button
              className="px-6 py-3 bg-purple-600 text-white rounded hover:bg-purple-700 disabled:opacity-50"
              onClick={() => inferMutation.mutate(userPrompt)}
              disabled={!userPrompt || !llmManager}
            >
              Enviar
            </button>
          </div>
        </>
      )}
    </div>
  );
}
