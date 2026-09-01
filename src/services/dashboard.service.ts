//import type { Dashboard } from "@/features/dashboard/types/dashboard.types";
import { api } from "@/lib/api";


export const dashboardService = {
  async getDashboard() {
    try {
      const response = await api.get("/dashboard-stats");
      return response.data;
    } catch (error: any) {
      throw error;
    }
  }
};