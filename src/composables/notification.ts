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
  newNotification.duration = 50000 || newNotification.duration;
  notifications.value.push(newNotification);

  setTimeout(() => {
    removeNotification(newNotification.key);
    console.log(newNotification.duration);
  }, notification.duration);
};

export const removeNotification = (key: string) => {
  const index = notifications.value.findIndex(
    (notification) => notification.key === key
  );
  if (index !== -1) {
    notifications.value.splice(index, 1);
  }
};
