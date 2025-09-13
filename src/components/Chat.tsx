// src/Chat.tsx
import  { useEffect, useState  } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Card } from '@mantine/core';
 // LLParams
import { LLMWebLLMManager } from '../managers/LLMWebLLMManager';
import type { LLMBaseManager } from '@/managers/LLMBaseManager';

// --- Configuración global de la aplicación (ejemplo) ---
localStorage.setItem("events", JSON.stringify([{"name":"Bono navidad","description":"Décimo","amount":500,"date":"2024-12-16","type":"Income","id":"4b2a95f7-e7f5-406f-9b3b-86ae8fbdc73b"},{"name":"Sueldo","description":"1 quincena","amount":500,"date":"2025-01-15","type":"Income","id":"94f57016-a05d-4161-b5dd-f3a5bc41adf5"},{"name":"compra ropa","description":"HYM","amount":120,"date":"2025-01-15","type":"Expense","id":"3d90f9f5-2ea4-45bc-9714-78c0f1d6a208"},{"name":"Sueldo","description":"total","amount":1000,"date":"2025-02-27","type":"Income","id":"00d375d9-b301-452e-b30e-dd63709abea6"},{"name":"Sueldo","description":"quincena","amount":500,"date":"2025-03-15","type":"Income","id":"8070ea7f-7948-4842-8788-93685c6fe2d2"},{"name":"Compra víveres","description":"Comisariato","amount":64,"date":"2025-03-19","type":"Expense","id":"fa978b4a-c13d-49f3-b03d-50aa48e088d2"},{"name":"luz","description":"CNEL","amount":30,"date":"2025-03-28","type":"Expense","id":"9d69b882-e0a2-43e8-9ef7-b9707e5529e7"},{"name":"helado","description":"chocolate","amount":4,"date":"2025-02-10","type":"Expense","id":"d19168f6-c784-4a7e-9403-9be1181492bc"},{"name":"Compra de zapatos","description":"Adidas","amount":120,"date":"2025-06-23","type":"Expense","id":"0699b7e6-47e2-4b00-8ad1-3e7bf35b537e"},{"name":"Viaje","description":"Vacaciones","amount":500,"date":"2024-12-30","type":"Expense","id":"961e40d8-0695-47bf-9bda-e52d325f79ac"},{"name":"Sueldo","description":"quincena","amount":300,"date":"2025-06-30","type":"Income","id":"7ed86ee9-85b3-4e08-8f71-3bbff5998c1a"},{"name":"Utilidades","description":"abono","amount":400,"date":"2025-04-11","type":"Income","id":"22522eb9-1944-4b0b-9ac1-7aee79c152f9"},{"name":"Sueldo","description":"abono quincena","amount":400,"date":"2025-06-21","type":"Income","id":"8bbca1c0-e75b-4632-8e9b-00acf55c282c"},{"name":"Compra comida","description":"Supermaxi","amount":120,"date":"2025-04-21","type":"Expense","id":"c3787bdb-d389-43d9-95c5-1d65b3701c82"},{"name":"Compra ropa","description":"Regalos","amount":300,"date":"2024-12-27","type":"Expense","id":"8287d1a1-584e-4aa7-bf1b-031a2b830638"},{"name":"Sueldo","description":"2da quincena","amount":500,"date":"2025-01-31","type":"Income","id":"853bf726-2a47-4c02-ab89-461be1bbab9d"},{"name":"Sueldo","description":"quincena","amount":400,"date":"2025-08-15","type":"Income","id":"62ec9ae5-d607-4067-9343-4527e7581cc1"},{"name":"Salida cumple","description":"Pizza","amount":30,"date":"2025-02-28","type":"Expense","id":"b7cd4ba4-ee09-49a8-bf63-09b11f6035e3"}]));
let storedEvents = localStorage.getItem("events");
let events = storedEvents ? JSON.parse(storedEvents) : [];
const CONFIG = {
  webLLM: {
    modelName: 'Qwen3-0.6B-q4f32_1-MLC', // Modelo de ejemplo para web-llm
    // modelName: 'TinyLlama-1.1B-Chat-v1.0-q4f16_1-MLC', 
    // Llama-3-8B-Instruct-q5_k_m.gguf 'Llama-3-8B-Instruct-q4f32_1-MLC' 
    systemprompt: `Eres un asistente útil y tu nombre es WalletAI. Responderás consultas de eventos de usuario sobre ingreos y egresos de dinero.
    Cada movimiento de ingreso y egreso se considera evento. 
    A continuación te enviaré una descripción de los eventos de usuario: ${JSON.stringify(events, null, 2)}. `,
    repetition_penalty: 1.2,
  }
};

export default function Chat() {
  type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const [messages, setMessages] = useState<Array<Message>>([]);

  // Estado para el manager actual
  const [llmManager, setLlmManager] = useState<LLMBaseManager | null>(null);
 // const [currentModelType, setCurrentModelType] = useState<'local-web' | 'remote-api'>('remote-api');
  const [userPrompt, setUserPrompt] = useState<string>('');
  // const [response, setResponse] = useState<string>('');
  const [streamingResponse, setStreamingResponse] = useState<string>('');

  // estados separados para parámetros
  const [temperature, setTemperature] = useState(0.1)
  const [topP, setTopP] = useState(0.2)
  const clearChat = () => {
    setMessages([]);
    setStreamingResponse('');
  };

  const queryClient = useQueryClient();

   // Nuevo estado para mostrar "Cargando..."
  const [loadingModel, setLoadingModel] = useState(true);
  const [errorModel, setErrorModel] = useState<string | null>(null);

  // Añadir mensaje al historial
  const addMessage = (role: 'user' | 'assistant', content: string) => {
    setMessages(prev => [...prev, { role, content }]);
  };  

  // Estado para controlar si el chat está abierto o cerrado
  const [isChatOpen, setIsChatOpen] = useState(false); // true si quieres que aparezca al cargar

  // Inicialización y carga del modelo
  useEffect(() => {
    const initializeManager = async () => {
      try {
        setLoadingModel(true);
        setErrorModel(null);
        storedEvents = localStorage.getItem("events");
        events = storedEvents ? JSON.parse(storedEvents) : [];
        const manager: LLMBaseManager = new LLMWebLLMManager({
          modelName: CONFIG.webLLM.modelName,
          temperature,
          topP,
          systemprompt: CONFIG.webLLM.systemprompt,
        });
        setLlmManager(manager);
        await manager.loadModel();
        console.log("Modelo cargado!");
      } catch (err: any) {
        console.error("Error al cargar modelo:", err);
        setErrorModel("Error al cargar el modelo");
      } finally {
        setLoadingModel(false);
      }
    };
    initializeManager();
    return () => {
      if (llmManager) {
        llmManager.unloadModel();
      }
    };
  }, ['local-web']); 


  // --- Inferencia (respuesta completa) ---
  const inferMutation = useMutation({
    mutationFn: async (prompt: string) => {
      if (!llmManager) throw new Error("LLM Manager not initialized.");
      return llmManager.infer(prompt);
    },
    onSuccess: (data) => {
      addMessage('assistant', data.text.replace(/<think>[\s\S]*?<\/think>/g, '').trim());
      queryClient.invalidateQueries({
        queryKey: ['llmResponse'],
      }); 
      setUserPrompt(''); 
    },
    onError: (error) => {
      console.error('Inference error:', error);
    }
  });

  // --- Streaming ---
  const streamMutation = useMutation({
    mutationFn: async (prompt: string) => {
      if (!llmManager) throw new Error("LLM Manager not initialized.");
      addMessage('user', prompt);
      setStreamingResponse(''); 
      const stream = llmManager.stream(prompt);
      for await (const chunk of stream) {
        setStreamingResponse(prev => prev + chunk); // Añadir chunks al estado
      }
      setUserPrompt(''); 
    },
    onError: (error) => {
      console.error('Streaming error:', error);
      setStreamingResponse('Error during streaming: ' + (error as any).message || 'Unknown error');
    }
  });

  
  return (
    <div>
      {/* Abrir/cerrar chat */}
      <button
        onClick={() => setIsChatOpen(prev => !prev)}
        className="fixed bottom-4 right-4 z-50 px-6 py-3 bg-blue-600 text-white rounded-full shadow-lg hover:bg-blue-700"
      >
        {isChatOpen ? "Cerrar Chat" : "Abrir Chat"}
      </button>
      {/* Chat flotante */}
      {isChatOpen && (
        <div className="fixed bottom-20 right-4 w-100 h-[800px] bg-zinc-50 dark:bg-zinc-900 shadow-3xl rounded-lg flex flex-col overflow-hidden transform transition-all duration-300 scale-100 opacity-100 ">
          <Card shadow='xl' padding='sm' radius='md' withBorder  className="flex flex-col h-full p-   ">
          {/* Estado de carga */}
          {loadingModel && (
            <div className="flex flex-col my-3 p-3 items-center justify-center ">
              <div className="flex flex-row items-center w-12 h-12  border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
              <p className="mt-4  text-center  text-lg font-semibold"> Cargando modelo, por favor espera...</p>
            </div>
          )}
          {errorModel && (
            <div className="flex-1 flex items-center justify-center text-red-500">
              <p>{errorModel}</p>
            </div>
          )}
          {!loadingModel && !errorModel && (
            <>
              {/* Historial de Chat */}
              <div className="flex-1 flex flex-col bg-white-10 text-black dark:bg-zinc-900 dark:text-white rounded-lg p-4 overflow-y-auto mb-4">
                <h2 className="text-3xl font-bold mb-4">Chat</h2>
                {messages.map((msg, idx) => (
                  <div
                    key={idx}
                    className={`mb-2 p-3 rounded-md   ${
                      msg.role === 'user' ? 'flex justify-end pl-0.5rem bg-zinc-100 text-black dark:bg-gray-700 dark:text-white' :
                      ' text-black  dark:text-white'
                    }`}
                  >
                    <p className="font-semibold">{msg.role === 'user' ? '' : ''}</p>
                    <p>{msg.content}</p>
                  </div>
                ))}
                {streamingResponse && (
                  <div className="mb-2 p-3  text-black dark:bg-green-800 dark:text-white rounded-md">
                    <p className="font-semibold"></p>
                    <p>{streamingResponse.replace(/<think>[\s\S]*?<\/think>/g, '').trim()}</p>
                  </div>
                )}
                {!messages.length && !streamingResponse && (
                  <p className="text-center text-gray-500">Escribe un prompt para empezar...</p>
                )}
              </div>

              {/* Área de Input */}
              <div className="flex flex-col items-center w-100  p-4 bg-zinc-50 text-black dark:bg-zinc-900 dark:text-white  rounded-lg">
                <input
                  type="text"
                  value={userPrompt}
                  onChange={(e) => setUserPrompt(e.target.value)}
                  disabled={!llmManager || inferMutation.isPending || streamMutation.isPending}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' && userPrompt && !inferMutation.isPending && !streamMutation.isPending) {
                      if (e.shiftKey) { // Shift + Enter para streaming
                        streamMutation.mutate(userPrompt);
                      } else { // Enter solo para inferencia completa
                          addMessage('user', userPrompt);
                          inferMutation.mutate(userPrompt);
                      }
                    }
                  }}
                  placeholder="Escribe tu prompt aquí..."
                  className="flex-1 p-3 mr-4 my-1 w-90 rounded bg-white text-black dark:bg-zinc-800 dark:text-white  focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <div className="flex flex-row items-center p-1 bg-zinc-50 text-black dark:bg-zinc-900 dark:text-white  rounded-lg gap-4 mb-4">
                  <label className="flex flex-row  gap-1 w-full">
                    <span className="text-center align-center text-sm p-2 text-gray-600 dark:text-gray-300">Temperature:</span>
                    <input
                      type="number"
                      value={temperature}
                      min={0}
                      max={2}
                      onChange={(e) => setTemperature(Number(e.target.value))}
                      placeholder="Temperatura: 0-2"
                      disabled={!llmManager || !userPrompt || inferMutation.isPending || streamMutation.isPending}
                      className="flex-1 px-4 py-0 border dark:bg-zinc-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                    />
                  </label> 
                  <label className="flex flex-row gap-1 w-full">
                    <span className="text-center align-center text-sm p-2 text-gray-600 dark:text-gray-300">Top P:</span>
                      <input
                        type="number"
                        value={topP}
                        min={0}
                        max={1}
                        onChange={(e) => setTopP(Number(e.target.value))}
                        placeholder="Top P: 0-1"
                        disabled={!llmManager || !userPrompt || inferMutation.isPending || streamMutation.isPending}
                        className="flex-1 px-4 py0-0 border dark:bg-zinc-900 border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                      />
                  </label>
                </div>
                <div className='flex flex-row m-0.5'>
                  <button
                    onClick={() => {
                        
                        addMessage('user', userPrompt);
                        inferMutation.mutate(userPrompt);
                      }}
                    disabled={!llmManager || !userPrompt || inferMutation.isPending || streamMutation.isPending}
                    className="px-6 py-1 bg-blue-600  text-white dark:text-white rounded hover:bg-blue-700 disabled:opacity-50"
                  >
                  Enviar
                  </button>
                  <button
                    onClick={() => streamMutation.mutate(userPrompt)}
                    disabled={!llmManager || 
                      !userPrompt || 
                      inferMutation.isPending || 
                      streamMutation.isPending
                    }
                    className="ml-2 px-6 py-1 bg-cyan-600 text-white dark:text-white rounded hover:bg-teal-700 disabled:opacity-50"
                  >
                    Stream
                  </button>
                  <button
                    onClick={clearChat}
                    disabled={inferMutation.isPending || streamMutation.isPending}
                    className="ml-2 px-6 py-1 bg-red-600 text-white dark:text-white rounded hover:bg-red-700 disabled:opacity-50"
                  >
                    Limpiar Chat
                  </button>
                </div> 
              </div>
            </>
          )}
          </Card>
        </div>
      )}
    </div>
  );
}
