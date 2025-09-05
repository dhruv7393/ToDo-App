# Drag and Drop Functionality

## Overview

The ToDo app now supports drag-and-drop functionality for both categories and tasks on Android mobile devices.

## Features Added

### 1. Draggable Categories

- Categories can be reordered by long-pressing and dragging
- Priority is automatically updated based on the new position
- Visual feedback with elevation and shadow effects during drag

### 2. Draggable Tasks

- Tasks within each category can be reordered by long-pressing and dragging
- Task priority is updated within the category
- Independent task ordering for each category

### 3. Visual Indicators

- Drag handle icons (chevron.right) are visible on both categories and tasks
- Active drag state shows elevated appearance with shadows
- Smooth animations during drag operations

## How to Use

### Reordering Categories:

1. Long-press on the drag handle (small arrow) next to a category name
2. Drag the category to the desired position
3. Release to drop in the new position
4. Priority will be automatically updated and saved to the backend

### Reordering Tasks:

1. Long-press on the drag handle next to a task
2. Drag the task to the desired position within the same category
3. Release to drop in the new position
4. Task priority will be automatically updated and saved

## Technical Implementation

### Libraries Used

- `react-native-draggable-flatlist`: Provides smooth drag-and-drop functionality

### Priority System

- Categories: Priority ranges from 1 to number of categories
- Tasks: Priority ranges from 1 to number of tasks within each category
- Priority is automatically calculated based on the item's position in the list

### API Integration

- Uses `updateVaccation` helper function to persist priority changes
- Automatic error handling with fallback to original order if update fails
- Real-time UI updates during drag operations

### Performance Optimizations

- Uses `ScaleDecorator` for smooth scaling animations
- Limited task list height to prevent scroll conflicts
- Efficient re-rendering with proper key extraction

## Error Handling

- If backend update fails, the UI automatically reverts to the previous order
- Error messages are displayed to inform users of any issues
- Graceful fallback ensures app remains functional even if drag operations fail

## Browser Compatibility

- Optimized for Android mobile devices
- Works on web browsers but best experience on mobile
- Touch-friendly drag handles and gestures
