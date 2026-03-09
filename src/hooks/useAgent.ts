import { useState, useCallback } from "react";

export interface AgentStatus {
  is_running: boolean;
  last_updates: Record<string, string>;
  pending_tasks: number;
  completed_tasks: number;
  memory_size: number;
}

export function useAgent() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<AgentStatus | null>(null);

  const startAgent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const base = (import.meta.env.VITE_CHATBOT_BACKEND_URL as string | undefined)?.trim();
      if (!base || !/^https?:\/\//i.test(base)) throw new Error('Agent backend not configured');
      const response = await fetch(`${base.replace(/\/$/, '')}/chatbot/agent/start/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error(`Failed to start agent: ${response.status}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const stopAgent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const base = (import.meta.env.VITE_CHATBOT_BACKEND_URL as string | undefined)?.trim();
      if (!base || !/^https?:\/\//i.test(base)) throw new Error('Agent backend not configured');
      const response = await fetch(`${base.replace(/\/$/, '')}/chatbot/agent/stop/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error(`Failed to stop agent: ${response.status}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getAgentStatus = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const base = (import.meta.env.VITE_CHATBOT_BACKEND_URL as string | undefined)?.trim();
      if (!base || !/^https?:\/\//i.test(base)) throw new Error('Agent backend not configured');
      const response = await fetch(`${base.replace(/\/$/, '')}/chatbot/agent/status/`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setStatus(data);
        return data;
      } else {
        throw new Error(`Failed to get agent status: ${response.status}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addAgentTask = useCallback(async (task: any) => {
    setIsLoading(true);
    setError(null);

    try {
      const base = (import.meta.env.VITE_CHATBOT_BACKEND_URL as string | undefined)?.trim();
      if (!base || !/^https?:\/\//i.test(base)) throw new Error('Agent backend not configured');
      const response = await fetch(`${base.replace(/\/$/, '')}/chatbot/generate-response/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [{
            type: 'user',
            content: `Agent task: ${JSON.stringify(task)}`,
            context: 'agent-control'
          }],
          context: 'agent-control',
          currentData: {},
        }),
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      } else {
        throw new Error(`Failed to add agent task: ${response.status}`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(errorMessage);
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    // State
    isLoading,
    error,
    status,

    // Actions
    startAgent,
    stopAgent,
    getAgentStatus,
    addAgentTask,

    // Utilities
    clearError: () => setError(null),
  };
}
