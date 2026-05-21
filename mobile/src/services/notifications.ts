import * as Notifications from "expo-notifications";
import * as Device from "expo-device";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Reminder } from "../types";

const PERMISSION_KEY = "@petai:notif-asked";
const SCHEDULED_KEY = "@petai:notif-scheduled";

// Show notifications even when app is foregrounded
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export async function setupNotificationChannel() {
  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("reminders", {
      name: "Pet reminders",
      description: "Vaccinations, medications, checkups",
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#22c55e",
    });
  }
}

export async function requestPermissionsIfNeeded(): Promise<boolean> {
  if (!Device.isDevice) return false;

  const asked = await AsyncStorage.getItem(PERMISSION_KEY);

  const { status } = await Notifications.getPermissionsAsync();
  if (status === "granted") return true;
  if (status === "denied" && asked) return false;

  const { status: newStatus } = await Notifications.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
    },
  });

  await AsyncStorage.setItem(PERMISSION_KEY, "1");
  return newStatus === "granted";
}

interface ScheduledMap {
  [reminderId: string]: string; // notification ID
}

async function getScheduled(): Promise<ScheduledMap> {
  const raw = await AsyncStorage.getItem(SCHEDULED_KEY);
  return raw ? JSON.parse(raw) : {};
}

async function saveScheduled(map: ScheduledMap) {
  await AsyncStorage.setItem(SCHEDULED_KEY, JSON.stringify(map));
}

export async function scheduleReminder(reminder: Reminder, petName: string): Promise<string | null> {
  const dueDate = new Date(reminder.dueDate);
  // Schedule for 9 AM on the due date
  dueDate.setHours(9, 0, 0, 0);
  if (dueDate.getTime() < Date.now()) return null; // skip past reminders

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: `🐾 ${reminder.title}`,
      body: `${petName} — ${reminder.description ?? reminder.type}`,
      data: { reminderId: reminder.id, petName },
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: dueDate,
      channelId: "reminders",
    },
  });

  const map = await getScheduled();
  map[reminder.id] = id;
  await saveScheduled(map);
  return id;
}

export async function cancelReminder(reminderId: string) {
  const map = await getScheduled();
  const notifId = map[reminderId];
  if (notifId) {
    await Notifications.cancelScheduledNotificationAsync(notifId);
    delete map[reminderId];
    await saveScheduled(map);
  }
}

export async function syncReminders(reminders: Reminder[], petName: (id: string) => string) {
  await setupNotificationChannel();
  const granted = await requestPermissionsIfNeeded();
  if (!granted) return;

  // Cancel all then re-schedule pending only
  const map = await getScheduled();
  for (const notifId of Object.values(map)) {
    await Notifications.cancelScheduledNotificationAsync(notifId).catch(() => {});
  }
  await saveScheduled({});

  for (const r of reminders) {
    if (!r.completed) {
      await scheduleReminder(r, petName(r.petId)).catch(() => {});
    }
  }
}

export async function sendTestNotification() {
  await setupNotificationChannel();
  const granted = await requestPermissionsIfNeeded();
  if (!granted) return false;

  await Notifications.scheduleNotificationAsync({
    content: {
      title: "🐾 PetAI test",
      body: "Your notifications are working. Luna says hi!",
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 2,
      channelId: "reminders",
    },
  });
  return true;
}

export async function getScheduledCount(): Promise<number> {
  const all = await Notifications.getAllScheduledNotificationsAsync();
  return all.length;
}
