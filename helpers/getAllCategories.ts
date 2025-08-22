import axios, { isAxiosError } from "axios";

export interface CategoryData {
  // Define the structure of your todo data here
  // You can update this interface based on the actual data structure
  [key: string]: any;
}

interface ApiResponse {
  data?: CategoryData[];
  error?: string;
}

const getAllCategories = async (): Promise<ApiResponse> => {
  try {
    const response = await axios.get(
      "https://main.dgsooy6yeh5ar.amplifyapp.com/api/vaccation/"
    );

    return {
      data: response.data,
      error: undefined,
    };
  } catch (error) {
    console.error("Error fetching categories:", error);

    // Handle different types of errors
    if (isAxiosError(error)) {
      return {
        data: undefined,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to fetch categories and todos",
      };
    }

    return {
      data: undefined,
      error: "An unexpected error occurred",
    };
  }
};

export default getAllCategories;
