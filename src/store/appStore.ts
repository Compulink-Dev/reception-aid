// store/appStore.ts
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AppState {
  // User state
  user: any | null
  setUser: (user: any) => void

  // UI state
  sidebarOpen: boolean
  toggleSidebar: () => void

  // Quick actions
  quickVisitorCheckin: boolean
  setQuickVisitorCheckin: (value: boolean) => void

  // Notifications
  notifications: Notification[]
  addNotification: (notification: Notification) => void
  removeNotification: (id: string) => void
}

interface Notification {
  id: string
  type: 'success' | 'error' | 'info' | 'warning'
  message: string
  timestamp: Date
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),

      sidebarOpen: true,
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),

      quickVisitorCheckin: false,
      setQuickVisitorCheckin: (value) => set({ quickVisitorCheckin: value }),

      notifications: [],
      addNotification: (notification) =>
        set((state) => ({
          notifications: [...state.notifications, notification],
        })),
      removeNotification: (id) =>
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        })),
    }),
    {
      name: 'reception-aid-storage',
    },
  ),
)
