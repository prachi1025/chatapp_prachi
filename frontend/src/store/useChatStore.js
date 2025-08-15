import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set,get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const res = await axiosInstance.get("/messages/users");
      set({ users: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages } = get();
  const socket = useAuthStore.getState().socket;

  const newMessage = {
    ...messageData,
    senderId: useAuthStore.getState().authUser._id,
    receiverId: selectedUser._id,
    createdAt: new Date().toISOString(),
  };

  set({ messages: [...messages, newMessage] }); // optimistic UI update

  try {
    await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
    socket?.emit("sendMessage", newMessage); // real-time broadcast
  } catch (error) {
    toast.error(error.response?.data?.message || error.message);
  }
  },

  subscribeToMessages: () => {
    const { selectedUser } = get();
  const socket = useAuthStore.getState().socket;
  if (!selectedUser || !socket) return;

  socket.off("newMessage"); // remove previous listener

  socket.on("newMessage", (newMessage) => {
    // only add if it belongs to the currently selected chat
    const currentUserId = selectedUser._id;
    const isRelevantMessage =
      newMessage.senderId === currentUserId || newMessage.receiverId === currentUserId;

    if (!isRelevantMessage) return;

    set({ messages: [...get().messages, newMessage] });
  });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;
    socket.off("newMessage");
  },

  setSelectedUser: (user) => set({ selectedUser: user }),
}));
