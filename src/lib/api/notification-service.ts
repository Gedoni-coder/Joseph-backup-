/**
 * Notification Service
 * Handles all API calls for notifications from the backend
 */

import { djangoGet, djangoPost, djangoPatch, djangoPut } from "@/lib/api/django-client";

// Backend interface - what Django returns
interface BackendNotification {
  id: number;
  sender: string;
  subject: string;
  preview: string;
  body: string;
  type: "forecast" | "alert" | "info" | "market" | "system";
  priority: "urgent" | "high" | "normal" | "low";
  category: string;
  is_read: boolean;
  starred: boolean;
  archived: boolean;
  created_at: string;
  updated_at: string;
}

// Frontend interface - what the component expects
export interface Notification {
  id: string;
  sender: string;
  subject: string;
  preview: string;
  body: string;
  type: "forecast" | "alert" | "info" | "market" | "system";
  priority: "urgent" | "high" | "normal" | "low";
  category: string;
  read: boolean;
  starred: boolean;
  archived: boolean;
  timestamp: Date;
}

const API_BASE = "/api/notifications";

/**
 * Transform backend data to frontend format
 */
function transformBackendNotification(
  notif: BackendNotification
): Notification {
  return {
    id: String(notif.id),
    sender: notif.sender,
    subject: notif.subject,
    preview: notif.preview,
    body: notif.body,
    type: notif.type,
    priority: notif.priority,
    category: notif.category,
    read: notif.is_read,
    starred: notif.starred,
    archived: notif.archived,
    timestamp: new Date(notif.created_at),
  };
}

/**
 * Fetch all notifications for the current user
 */
export async function listNotifications(): Promise<Notification[]> {
  const response: any = await djangoGet(`${API_BASE}/messages/`);
  const notifications: BackendNotification[] = (response?.results || response || []) as BackendNotification[];
  return notifications.map(transformBackendNotification);
}

/**
 * Fetch notifications filtered by type
 */
export async function listNotificationsByType(
  type: string
): Promise<Notification[]> {
  const response: any = await djangoGet(
    `${API_BASE}/messages/?type=${type}`
  );
  const notifications: BackendNotification[] = (response?.results || response || []) as BackendNotification[];
  return notifications.map(transformBackendNotification);
}

/**
 * Fetch notifications filtered by category
 */
export async function listNotificationsByCategory(
  category: string
): Promise<Notification[]> {
  const response: any = await djangoGet(
    `${API_BASE}/messages/?category=${category}`
  );
  const notifications: BackendNotification[] = (response?.results || response || []) as BackendNotification[];
  return notifications.map(transformBackendNotification);
}

/**
 * Mark a single notification as read
 */
export async function markNotificationAsRead(
  notificationId: string
): Promise<Notification> {
  const response: any = await djangoPut(
    `${API_BASE}/messages/${notificationId}/mark_read/`,
    {}
  );
  return transformBackendNotification(response as BackendNotification);
}

/**
 * Mark all notifications as read
 */
export async function markAllNotificationsAsRead(): Promise<{ status: string }> {
  const response: any = await djangoPut(
    `${API_BASE}/messages/mark_all_read/`,
    {}
  );
  return response || { status: "success" };
}

/**
 * Toggle starred status of a notification
 */
export async function toggleNotificationStarred(
  notificationId: string
): Promise<Notification> {
  const response: any = await djangoPut(
    `${API_BASE}/messages/${notificationId}/toggle_starred/`,
    {}
  );
  return transformBackendNotification(response as BackendNotification);
}

/**
 * Toggle archived status of a notification
 */
export async function toggleNotificationArchived(
  notificationId: string
): Promise<Notification> {
  const response: any = await djangoPut(
    `${API_BASE}/messages/${notificationId}/toggle_archived/`,
    {}
  );
  return transformBackendNotification(response as BackendNotification);
}

/**
 * Get count of unread notifications
 */
export async function getUnreadNotificationCount(): Promise<number> {
  const response: any = await djangoGet(
    `${API_BASE}/messages/unread_count/`
  );
  return response?.unread_count || 0;
}

/**
 * Create a new notification (admin/backend use)
 */
export async function createNotification(
  data: Partial<Omit<Notification, "id" | "timestamp">>
): Promise<Notification> {
  const backendData = {
    sender: data.sender,
    subject: data.subject,
    preview: data.preview,
    body: data.body,
    type: data.type,
    category: data.category,
    priority: data.priority,
  };
  const response: any = await djangoPost(`${API_BASE}/messages/`, backendData);
  return transformBackendNotification(response as BackendNotification);
}

/**
 * Update a notification (admin/backend use)
 */
export async function updateNotification(
  notificationId: string,
  data: Partial<Omit<Notification, "id" | "timestamp">>
): Promise<Notification> {
  const backendData = {
    sender: data.sender,
    subject: data.subject,
    preview: data.preview,
    body: data.body,
    type: data.type,
    category: data.category,
    priority: data.priority,
  };
  const response: any = await djangoPatch(
    `${API_BASE}/messages/${notificationId}/`,
    backendData
  );
  return transformBackendNotification(response as BackendNotification);
}
