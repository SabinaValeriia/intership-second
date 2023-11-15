import { ref } from "vue";

export const notifications = ref<Notification[]>([]);

interface Notification {
  text: string;
  type: NotificationType;
  duration?: number;
  key: string;
}
export enum NotificationType {
  Success = "success",
  Failed = "failed",
  Info = "info",
  Warning = "warning",
}

export const pushNotification = (notification: Notification) => {
  const newNotification = { ...notification };
  newNotification.duration = newNotification.duration
    ? newNotification.duration
    : 5000;
  notifications.value.push(newNotification);

  setTimeout(() => {
    removeNotification(newNotification.key);
  }, newNotification.duration);
};

export const removeNotification = (key: string) => {
  const index = notifications.value.findIndex(
    (notification) => notification.key === key
  );
  if (index !== -1) {
    notifications.value.splice(index, 1);
  }
};
