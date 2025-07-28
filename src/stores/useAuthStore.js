import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";

export const useAuthStore = create(
  devtools(
    (set, get) => ({
      // Auth State
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (credentials) => {
        set({ isLoading: true }, false, "login:start");

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/login.php`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(credentials),
            }
          );

          const data = await response.json();

          if (data.success) {
            const { token, user } = data;

            localStorage.setItem("token", token);

            set(
              {
                user,
                token,
                isAuthenticated: true,
                isLoading: false,
              },
              false,
              "login:success"
            );

            return { success: true, user };
          } else {
            set({ isLoading: false }, false, "login:error");
            return { success: false, error: data.message || "Login failed" };
          }
        } catch (error) {
          console.error("Login error:", error);
          set({ isLoading: false }, false, "login:error");
          return { success: false, error: "Network error" };
        }
      },

      signup: async (userData) => {
        set({ isLoading: true }, false, "signup:start");

        try {
          const response = await fetch(
            `${process.env.NEXT_PUBLIC_API_BASE_URL}/signup.php`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(userData),
            }
          );

          const data = await response.json();

          if (data.success) {
            set({ isLoading: false }, false, "signup:success");
            return { success: true, message: data.message };
          } else {
            set({ isLoading: false }, false, "signup:error");
            return { success: false, error: data.message || "Signup failed" };
          }
        } catch (error) {
          console.error("Signup error:", error);
          set({ isLoading: false }, false, "signup:error");
          return { success: false, error: "Network error" };
        }
      },

      logout: () => {
        localStorage.removeItem("token");

        set(
          {
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
          },
          false,
          "logout"
        );
      },

      checkAuth: () => {
        const token = localStorage.getItem("token");

        if (token) {
          set(
            {
              token,
              isAuthenticated: true,
            },
            false,
            "checkAuth:authenticated"
          );
          return true;
        } else {
          set(
            {
              token: null,
              isAuthenticated: false,
            },
            false,
            "checkAuth:unauthenticated"
          );
          return false;
        }
      },

      initializeAuth: () => {
        const token = localStorage.getItem("token");

        if (token) {
          set(
            {
              token,
              isAuthenticated: true,
            },
            false,
            "initializeAuth:authenticated"
          );
        } else {
          set(
            {
              token: null,
              isAuthenticated: false,
            },
            false,
            "initializeAuth:unauthenticated"
          );
        }
      },

      // Update user info
      updateUser: (userData) => {
        set(
          {
            user: { ...get().user, ...userData },
          },
          false,
          "updateUser"
        );
      },
    }),
    {
      name: "auth-store",
    }
  )
);
