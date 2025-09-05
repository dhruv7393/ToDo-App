import updateVaccation from "./updateVaccation";

/**
 * Updates the priority of categories based on their new order
 */
export const updateCategoriesPriority = async (
  categories: any[]
): Promise<void> => {
  try {
    // Create an array of category updates with new priorities
    const categoryUpdates = categories.map((category, index) => ({
      ...category,
      priority: index + 1,
    }));

    // Use updateVaccation to update the priorities
    await updateVaccation(categoryUpdates);
  } catch (error) {
    console.error("Error updating categories priority:", error);
    throw error;
  }
};

/**
 * Updates the priority of tasks within a category based on their new order
 */
export const updateTasksPriority = async (
  categories: any[],
  categoryId: string,
  reorderedTasks: any[]
): Promise<any[]> => {
  try {
    // Update the tasks in the category with new priorities
    const updatedCategories = categories.map((category) => {
      if (category._id === categoryId) {
        const tasksWithPriority = reorderedTasks.map((task, index) => ({
          ...task,
          priority: index + 1,
        }));
        return {
          ...category,
          tasks: tasksWithPriority,
        };
      }
      return category;
    });

    // Use updateVaccation to update the modified category
    const modifiedCategory = updatedCategories.find(
      (cat) => cat._id === categoryId
    );
    if (modifiedCategory) {
      await updateVaccation([modifiedCategory]);
    }

    return updatedCategories;
  } catch (error) {
    console.error("Error updating tasks priority:", error);
    throw error;
  }
};

/**
 * Sorts categories by priority (ascending order)
 */
export const sortCategoriesByPriority = (categories: any[]): any[] => {
  return [...categories].sort((a, b) => (a.priority || 0) - (b.priority || 0));
};

/**
 * Sorts tasks within each category by priority (ascending order)
 */
export const sortTasksByPriority = (categories: any[]): any[] => {
  return categories.map((category) => ({
    ...category,
    tasks: category.tasks
      ? [...category.tasks].sort(
          (a: any, b: any) => (a.priority || 0) - (b.priority || 0)
        )
      : [],
  }));
};
