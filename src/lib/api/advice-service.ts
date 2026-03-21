/**
 * Advice Hub Service
 * Handles all API calls for advice messages from the backend
 */

import { djangoGet, djangoPost, djangoPatch } from "@/lib/api/django-client";

// Backend interface - what Django returns
interface BackendAdviceMessage {
  id: number;
  module_id: string;
  module_name: string;
  module_icon: string;
  title: string;
  content: string;
  is_read: boolean;
  created_at: string;
  updated_at: string;
}

// Frontend interface - what the component expects
export interface AdviceMessage {
  id: string;
  moduleId: string;
  moduleName: string;
  moduleIcon: string;
  title: string;
  content: string;
  timestamp: Date;
  isRead: boolean;
}

const API_BASE = "/api/advice";

/**
 * Transform backend data to frontend format
 */
function transformBackendMessage(msg: BackendAdviceMessage): AdviceMessage {
  return {
    id: String(msg.id),
    moduleId: msg.module_id,
    moduleName: msg.module_name,
    moduleIcon: msg.module_icon,
    title: msg.title,
    content: msg.content,
    timestamp: new Date(msg.created_at),
    isRead: msg.is_read,
  };
}

/**
 * Fetch all advice messages for the current user
 */
export async function listAdviceMessages(): Promise<AdviceMessage[]> {
  const response: any = await djangoGet(`${API_BASE}/messages/`);
  const messages: BackendAdviceMessage[] = (response?.results || response || []) as BackendAdviceMessage[];
  return messages.map(transformBackendMessage);
}

/**
 * Fetch advice messages filtered by module
 */
export async function listAdviceMessagesByModule(
  moduleId: string
): Promise<AdviceMessage[]> {
  const response: any = await djangoGet(
    `${API_BASE}/messages/?module_id=${moduleId}`
  );
  const messages: BackendAdviceMessage[] = (response?.results || response || []) as BackendAdviceMessage[];
  return messages.map(transformBackendMessage);
}

/**
 * Mark a single advice message as read
 */
export async function markAdviceAsRead(
  messageId: string
): Promise<AdviceMessage> {
  const response: BackendAdviceMessage = await djangoPost(
    `${API_BASE}/messages/${messageId}/mark_read/`,
    {}
  );
  return transformBackendMessage(response);
}

/**
 * Mark all advice messages as read
 */
export async function markAllAdviceAsRead(): Promise<{ status: string }> {
  const response: any = await djangoPost(`${API_BASE}/messages/mark_all_read/`, {});
  return response || { status: "success" };
}

/**
 * Get count of unread advice messages
 */
export async function getUnreadAdviceCount(): Promise<number> {
  const response: any = await djangoGet(`${API_BASE}/messages/unread_count/`);
  return response?.unread_count || 0;
}

/**
 * Create a new advice message (admin/backend use)
 */
export async function createAdviceMessage(
  data: Partial<Omit<AdviceMessage, "id" | "timestamp">>
): Promise<AdviceMessage> {
  // Transform component format to backend format before sending
  const backendData = {
    module_id: (data as any).moduleId,
    module_name: (data as any).moduleName,
    module_icon: (data as any).moduleIcon,
    title: data.title,
    content: data.content,
  };
  const response: BackendAdviceMessage = await djangoPost(
    `${API_BASE}/messages/`,
    backendData
  );
  return transformBackendMessage(response);
}

/**
 * Update an advice message (admin/backend use)
 */
export async function updateAdviceMessage(
  messageId: string,
  data: Partial<Omit<AdviceMessage, "id" | "timestamp">>
): Promise<AdviceMessage> {
  const backendData = {
    module_id: (data as any).moduleId,
    module_name: (data as any).moduleName,
    module_icon: (data as any).moduleIcon,
    title: data.title,
    content: data.content,
  };
  const response: BackendAdviceMessage = await djangoPatch(
    `${API_BASE}/messages/${messageId}/`,
    backendData
  );
  return transformBackendMessage(response);
}
