import { useEffect } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { getUserId, getRoles, getToken } from '@/lib/auth';
import { useToast } from '@/contexts/ToastContext';
import { translateMessage } from '@/lib/translateMessage';
import { TOAST } from '@/lib/toastMessages';

/**
 * NotificationManager handles real-time tactical signal interception.
 * It establishes a persistent WebSocket relay via STOMP/SockJS
 * and triggers HUD Toasts for incoming operational alerts.
 */
export default function NotificationManager() {
  const { info } = useToast();
  const userId = getUserId();
  const roles = getRoles();

  useEffect(() => {
    if (!userId) return;

    // Tactical Signal Relay Configuration - Using absolute URL to bypass proxy issues on port 8081
    // Tactical Signal Relay Configuration - Using Gateway URL with correct prefix
    const socket = new SockJS('/api-notification/ws-notifications');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      connectHeaders: {
        Authorization: `Bearer ${getToken()}`
      },
      debug: (str) => {
        if (import.meta.env.DEV) {
          console.debug('[KIZUNA-STOMP] ' + str);
        }
      },
      onConnect: () => {
        console.info('[KIZUNA-STOMP] Tactical Relay Connected. Synchronizing sectors...');

        // Sector 1: Private Channels (User Specific)
        client.subscribe(`/topic/user/${userId}`, (message) => {
          console.debug('[KIZUNA-STOMP] Incoming private signal:', message.body);
          try {
            const notification = JSON.parse(message.body);
            info(
              translateMessage(notification.title) || TOAST.notifications.privateDefault.title,
              translateMessage(notification.message) || TOAST.notifications.privateDefault.message
            );
          } catch (e) {
            console.error('[KIZUNA-STOMP] Signal parsing error:', e);
          }
        });

        // Sector 2: Operational Channels (Role Based)
        const roleTopics = new Set<string>();
        roles.forEach((role: string) => {
          const upper = role.toUpperCase();
          const bare = upper.startsWith("ROLE_") ? upper.slice(5) : upper;
          roleTopics.add(bare);
          roleTopics.add(`ROLE_${bare}`);
        });

        roleTopics.forEach((normalizedRole) => {
          client.subscribe(`/topic/role/${normalizedRole}`, (message) => {
            console.debug(`[KIZUNA-STOMP] Incoming role signal [${normalizedRole}]:`, message.body);
            try {
              const notification = JSON.parse(message.body);
              const roleToast = TOAST.notifications.roleDefault(normalizedRole);
              info(
                translateMessage(notification.title) || roleToast.title,
                translateMessage(notification.message) || roleToast.message
              );
            } catch (e) {
              console.error('[KIZUNA-STOMP] Role signal parsing error:', e);
            }
          });
        });
      },
      onStompError: (frame) => {
        console.error('[KIZUNA-STOMP] Relay failure: ' + frame.headers['message']);
      },
      onWebSocketClose: () => {
        console.warn('[KIZUNA-STOMP] Connection lost. Attempting tactical re-link...');
      }
    });

    client.activate();

    return () => {
      console.info('[KIZUNA-STOMP] Terminating tactical relay.');
      client.deactivate();
    };
  }, [userId, roles.join(','), info]);

  return null;
}
