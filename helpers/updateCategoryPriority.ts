import axios, { isAxiosError } from "axios";
import { getModifiedCategories, updateCategoryPriority } from "dhruvtodo";
import { CategoryData } from "./getAllCategories";

interface ApiResponse {
  data?: any;
  error?: string;
}

const updateCategoryPriorityAPI = async (
  data: CategoryData,
  _id: string, // Assuming _id is used to identify the category
  newPriority: number
): Promise<ApiResponse> => {
  try {
    const dataCopy = JSON.parse(JSON.stringify(data)); // Create a deep copy of the data
    // Use updateCategoryPriority from dhruvtodo
    const updatedData = updateCategoryPriority(dataCopy, _id, newPriority);

    // Get modified categories data
    const modifiedCategories = getModifiedCategories(data, updatedData);

    // Send the modified data to the API using PATCH
    await axios.patch(
      "https://main.dgsooy6yeh5ar.amplifyapp.com/api/vaccation/",
      modifiedCategories
    );

    // Return the data from updateCategoryPriority on success
    return {
      data: updatedData,
      error: undefined,
    };
  } catch (error) {
    console.error("Error updating category priority:", error);

    // Handle different types of errors
    if (isAxiosError(error)) {
      return {
        data: undefined,
        error:
          error.response?.data?.message ||
          error.message ||
          "Failed to update category priority",
      };
    }

    return {
      data: undefined,
      error: "An unexpected error occurred while updating category priority",
    };
  }
};

export default updateCategoryPriorityAPI;
