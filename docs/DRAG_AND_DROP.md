# Drag-and-Drop Implementation for ToDo App

## Overview

This implementation adds drag-and-drop functionality to both categories and tasks in the ToDo app, allowing users to reorder items and automatically update their priority.

## Features Added

### 1. Draggable Categories

- Categories can be reordered by long-pressing and dragging
- Priority is automatically updated based on the new order (1 to N)
- Visual feedback with scaling and shadow effects during drag

### 2. Draggable Tasks

- Tasks within each category can be reordered by long-pressing and dragging
- Priority is automatically updated based on the new order (1 to N)
- Visual feedback with highlighting during drag

### 3. Priority Management

- Automatic priority assignment based on position (index + 1)
- Uses `updateVaccation` helper to persist priority changes
- Graceful error handling with fallback to original order

## Components Created

### 1. `DraggableList.tsx`

Generic wrapper component for react-native-draggable-flatlist with:

- Reusable interface for any draggable list
- Built-in visual feedback (scaling animation)
- TypeScript support

### 2. `DraggableCategoryList.tsx`

Specialized component for category management:

- Renders categories with drag handles
- Includes nested draggable task lists
- Handles category reordering and task reordering
- Add task button integration

### 3. `DraggableTaskList.tsx`

Specialized component for task management:

- Renders tasks with drag handles
- Preserves task display logic (notes, dates)
- Handles task click events

### 4. Priority Helpers (`priorityHelpers.ts`)

Utility functions for priority management:

- `updateCategoriesPriority()` - Updates category priorities via API
- `updateTasksPriority()` - Updates task priorities via API
- `sortCategoriesByPriority()` - Sorts categories by priority
- `sortTasksByPriority()` - Sorts tasks within categories by priority

## How to Use

### For Users:

1. **Reorder Categories:**

   - Long press on the drag handle (⋮⋮) next to the category name
   - Drag to desired position
   - Release to confirm new order

2. **Reorder Tasks:**
   - Long press on the drag handle (⋮⋮) next to any task
   - Drag to desired position within the category
   - Release to confirm new order

### Visual Indicators:

- Drag handles (⋮⋮) appear on the right side of categories and tasks
- Items scale up and show shadow when being dragged
- Active drag state provides visual feedback

## Technical Implementation

### Library Used:

- `react-native-draggable-flatlist` - Provides the core drag-and-drop functionality

### Priority System:

- Categories: Priority 1 (top) to N (bottom)
- Tasks: Priority 1 (top) to N (bottom) within each category
- Automatic assignment: `priority = index + 1`

### API Integration:

- Uses existing `updateVaccation` helper for persistence
- Batch updates for performance
- Error handling with state rollback on failure

### Data Flow:

1. User drags item to new position
2. Component updates local state immediately (optimistic update)
3. Priority is recalculated for all affected items
4. API call made to persist changes
5. On error, state reverts to original order

## Error Handling

- Network errors: Revert to original order and show error message
- Validation errors: Log error and maintain current state
- Graceful degradation: App remains functional even if drag fails

## Performance Considerations

- Optimistic updates for immediate user feedback
- Batch API calls to reduce network overhead
- Efficient re-rendering with proper key extraction
- Memory-conscious with proper component cleanup

## Future Enhancements

- Cross-category task movement
- Visual indicators for valid drop zones
- Undo/redo functionality
- Bulk operations (select multiple items)
- Keyboard accessibility support
