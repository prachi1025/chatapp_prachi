import { create } from "zustand"
import { axiosInstance } from "../lib/axios.js"

export const useAuthStore = create((set) => ({
    authUser: null,
    isCheckingAuth: true,
    isSignUp: false,
    isLoginIn: false,
    isUpdatingProfile: false,

    checkAuth: async () => {
        try {
            const res = await axiosInstance.get("/auth/check")
            set({ authUser: res.data })
        } catch (error) {
            console.log("Error in checkAuth: ", error);
            set({ authUser: null })
        } finally {
            set({ isCheckingAuth: false })
        }
    }
}))