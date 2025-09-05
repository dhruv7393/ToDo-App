# ToDo App with Drag-and-Drop 👋

This is a feature-rich ToDo application built with [Expo](https://expo.dev) and React Native, featuring drag-and-drop functionality for organizing categories and tasks.

## Features

- ✅ **Create and manage categories** - Organize your tasks into custom categories
- ✅ **Add and manage tasks** - Create tasks with notes, due dates, and repeat options
- ✅ **Drag-and-drop reordering** - Reorder categories and tasks by dragging
- ✅ **Priority management** - Automatic priority assignment based on order
- ✅ **Task completion** - Mark tasks as done/undone
- ✅ **Repeating tasks** - Set tasks to repeat on specific days or monthly
- ✅ **Notes and due dates** - Add detailed information to tasks
- ✅ **Visual feedback** - Beautiful UI with scaling animations during drag operations

## New Drag-and-Drop Functionality

### How to Use:

1. **Reorder Categories:** Long press the drag handle (⋮⋮) next to any category name and drag to reorder
2. **Reorder Tasks:** Long press the drag handle (⋮⋮) next to any task and drag to reorder within its category
3. **Priority Updates:** Items are automatically assigned priority based on their order (1 for top, N for bottom)

### Technical Details:

- Uses `react-native-draggable-flatlist` for smooth drag interactions
- Automatic priority management with API persistence via `updateVaccation`
- Optimistic updates with error handling and state rollback
- Visual feedback with scaling and shadow effects during drag

For detailed documentation on the drag-and-drop implementation, see [DRAG_AND_DROP.md](./docs/DRAG_AND_DROP.md).

## Get started

1. Install dependencies

   ```bash
   npm install
   ```

2. Start the app

   ```bash
   npx expo start
   ```

In the output, you'll find options to open the app in a

- [development build](https://docs.expo.dev/develop/development-builds/introduction/)
- [Android emulator](https://docs.expo.dev/workflow/android-studio-emulator/)
- [iOS simulator](https://docs.expo.dev/workflow/ios-simulator/)
- [Expo Go](https://expo.dev/go), a limited sandbox for trying out app development with Expo

You can start developing by editing the files inside the **app** directory. This project uses [file-based routing](https://docs.expo.dev/router/introduction).

## Project Structure

```
components/
├── DraggableList.tsx           # Generic draggable list component
├── DraggableCategoryList.tsx   # Category-specific draggable list
├── DraggableTaskList.tsx       # Task-specific draggable list
├── AddCategoryModal.tsx        # Modal for adding new categories
├── AddTaskModal.tsx            # Modal for adding new tasks
├── CategoryDetailsModal.tsx    # Modal for editing categories
└── TaskDetails.tsx             # Task details and editing

helpers/
├── priorityHelpers.ts          # Priority management utilities
├── updateVaccation.ts          # API helper for updates
└── getAllCategories.ts         # API helper for fetching data

docs/
└── DRAG_AND_DROP.md           # Detailed drag-and-drop documentation
```

## Get a fresh project

When you're ready, run:

```bash
npm run reset-project
```

This command will move the starter code to the **app-example** directory and create a blank **app** directory where you can start developing.

## Learn more

To learn more about developing your project with Expo, look at the following resources:

- [Expo documentation](https://docs.expo.dev/): Learn fundamentals, or go into advanced topics with our [guides](https://docs.expo.dev/guides).
- [Learn Expo tutorial](https://docs.expo.dev/tutorial/introduction/): Follow a step-by-step tutorial where you'll create a project that runs on Android, iOS, and the web.

## Join the community

Join our community of developers creating universal apps.

- [Expo on GitHub](https://github.com/expo/expo): View our open source platform and contribute.
- [Discord community](https://chat.expo.dev): Chat with Expo users and ask questions.
