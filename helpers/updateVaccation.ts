import axios, { isAxiosError } from "axios";
import { API_BASE_URL } from "./endpoint";

export interface UpdateVaccationData {
  // Define the structure of your update data here
  // You can update this interface based on the actual data structure
  [key: string]: any;
}

interface ApiResponse {
  data?: any;
  error?: string;
}

const updateVaccation = async (
  data: UpdateVaccationData
): Promise<ApiResponse> => {
  try {
    const response = await axios.patch(API_BASE_URL, data);

    return {
      data: response.data,
      error: undefined,
    };
  } catch (error) {
    console.error("Error updating vacation:", error);

    // Handle different types of errors
    if (isAxiosError(error)) {
      return {
        data: undefined,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to update vacation",
      };
    }

    return {
      data: undefined,
      error: "An unexpected error occurred",
    };
  }
};

export default updateVaccation;
