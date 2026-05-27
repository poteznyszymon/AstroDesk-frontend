import { useEffect, useRef } from 'react';
import { queryClient } from '@/main';
const TICKETS_KEY = "tickets";
const BASE_URL = import.meta.env.VITE_API_BASE_URL as string;
const WS_PATH = import.meta.env.VITE_WS_PATH as string || "/ws/tickets";
export const useTicketMessagesSocket = (ticketId: string | undefined) => {
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  useEffect(() => {
    if (!ticketId) return;
    const invalidate = () => {
      queryClient.invalidateQueries({ queryKey: [TICKETS_KEY, ticketId, "messages"] });
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        invalidate();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    const connect = () => {
      try {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;
        
        const protocol = BASE_URL.startsWith('https') ? 'wss:' : 'ws:';
        const wsUrl = `${protocol}//${BASE_URL.replace(/^https?:\/\//, '')}${WS_PATH}/${ticketId}`;
        
        wsRef.current = new WebSocket(wsUrl);
        wsRef.current.onopen = () => {
          console.log(`WebSocket connected for ticket ${ticketId}`);
        };
        wsRef.current.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'NEW_MESSAGE') {
              queryClient.setQueryData(
                [TICKETS_KEY, ticketId, "messages"],
                (old: unknown) => {
                  const arr = old as { id: string }[] | undefined;
                  if (!data.message) return arr ?? [];
                  if (!arr) return [data.message];
                  if (arr.some((m: { id: string }) => m.id === data.message.id)) return arr;
                  return [...arr, data.message];
                }
              );
            } else if (data.type === 'DELETE_MESSAGE') {
              queryClient.setQueryData(
                [TICKETS_KEY, ticketId, "messages"],
                (old: unknown) => (old as { id: string }[] | undefined)?.filter((m: { id: string }) => m.id !== data.messageId) ?? []
              );
            } else if (data.type === 'UPDATE_MESSAGE') {
              queryClient.setQueryData(
                [TICKETS_KEY, ticketId, "messages"],
                (old: unknown) => (old as { id: string }[] | undefined)?.map((m: { id: string }) => m.id === data.message?.id ? data.message : m) ?? []
              );
            }
          } catch (e) {
            console.error('Failed to parse WebSocket message:', e);
          }
        };
        wsRef.current.onclose = () => {
          if (reconnectTimeoutRef.current) {
            clearTimeout(reconnectTimeoutRef.current);
          }
          reconnectTimeoutRef.current = setTimeout(connect, 2000);
        };
        wsRef.current.onerror = (error) => {
          console.error('WebSocket error:', error);
          wsRef.current?.close();
        };
      } catch (e) {
        console.error('WebSocket connection failed:', e);
        reconnectTimeoutRef.current = setTimeout(connect, 2000);
      }
    };
    connect();
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      wsRef.current?.close();
    };
  }, [ticketId]);
};
