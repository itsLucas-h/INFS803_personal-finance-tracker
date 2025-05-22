import { Goal } from "@/components/goal";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
const API_URL = `${API_BASE_URL}/api/goals`;

const getAuthToken = () => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("token");
};

const getAuthHeaders = () => {
  const token = getAuthToken();
  if (!token) throw new Error("Not authenticated");

  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
};

export const goalService = { 
    async createGoal(goal: Goal) {
        try{
            const response = await fetch(API_URL, {
                method: "POST",
                headers: getAuthHeaders(),
                body: JSON.stringify(goal),
            });

            if(!response.ok){
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || "Failed to create new goal");
            }

            const data = await response.json();
            return data.goal;
        } catch(error){
            console.error("Error creating goal: ", error);
            throw new Error("Could not create new goal.");
        }
    },

    async getGoals() {
        try{
            const response = await fetch(API_URL, {
                method: "GET",
                headers: getAuthHeaders(),
            });

            if(!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || "Failed to fetch saving goals");
            }

            const data = await response.json();
            return data.goals;
        } catch(error) {
            console.error("Error fetching goals: ", error);
            throw new Error("Could not fetch goals.");
        }
    },

    async deleteGoal(id: string) {
        try{
            const response = await fetch(`${API_URL}/${id}`, {
                method: "DELETE",
                headers: getAuthHeaders(),
            });

            if(!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || "Failed to delete savings goal");
            }

            return true;
        } catch(error) {
            console.error("Error delete goal: ", error);
            throw new Error("Could not delete savings goal.");
        }
    },

    async updateGoal(id: string, updatedGoal : Goal) {
        try{
            const response = await fetch(`${API_URL}/${id}`, {
                method: "PUT",
                headers: getAuthHeaders(),
                body: JSON.stringify(updatedGoal),
            });

            if(!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.message || "Failed to update savings goal");
            }

            const data = await response.json();
            return data.goal;
            
        } catch(error) {
            console.error("Error delete goal: ", error);
            throw new Error("Could not update savings goal.");
        }
    },


};