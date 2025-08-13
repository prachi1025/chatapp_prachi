import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"
import toast from "react-hot-toast";

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSignUp: false,
    isLoginIn: false,
    isUpdatingProfile: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check", {
                withCredentials: true // ✅ ensures cookies are sent
            });
            set({ authUser: res.data });
        } catch (error) {
            if (error.response?.status === 401) {
                console.warn("User not authenticated"); // ✅ expected if not logged in
            } else {
                console.error("Error in checkAuth:", error.message);
            }
            set({ authUser: null });
        } finally {
            set({ isCheckingAuth: false });
        }
    },

    signup: async (data) => {
        set({ isSigningUp: true })
        try {
            const res = await axiosInstance.post("/auth/signup", data)
            set({ authUser: res.data })
            toast.success("Account created successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        } finally {
            set({ isSigningUp: false })
        }
    },

    logout: async () => {
        try {
            await axiosInstance.post("/auth/logout")
            set({ authUser: null })
            toast.success("Logged out successfully")
        } catch (error) {
            toast.error(error.response.data.message)
        }
    }
}))