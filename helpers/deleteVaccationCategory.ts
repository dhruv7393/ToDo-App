import axios, { isAxiosError } from "axios";
import { API_BASE_URL } from "./endpoint";

export interface DeleteVaccationData {
  // Define the structure of your update data here
  // You can update this interface based on the actual data structure
  ids: string[];
}

interface ApiResponse {
  data?: any;
  error?: string;
}

const deleteVaccationCategory = async (
  data: DeleteVaccationData
): Promise<ApiResponse> => {
  try {
    const response = await axios.delete(API_BASE_URL, { data });

    return {
      data: response.data,
      error: undefined,
    };
  } catch (error) {
    console.error("Error deleting vacation category:", error);

    // Handle different types of errors
    if (isAxiosError(error)) {
      return {
        data: undefined,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to delete vacation category",
      };
    }

    return {
      data: undefined,
      error: "An unexpected error occurred",
    };
  }
};

export default deleteVaccationCategory;
