// UserService.js - Handles API requests
export const fetchUsers = async () => {
    try {
        const response = await fetch("/api/users");
        if (!response.ok) throw new Error("Failed to fetch users");
        return await response.json();
    } catch (error) {
        console.error("Error fetching users:", error);
        return [];
    }
};

export const deleteUser = async (id) => {
    try {
        await fetch(`/api/users/${id}`, { method: "DELETE" });
    } catch (error) {
        console.error("Error deleting user:", error);
    }
};
    