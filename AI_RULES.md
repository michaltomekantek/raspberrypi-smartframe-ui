# AI Development Rules - Raspberry Pi Smart Frame UI

## Tech Stack
- **React & TypeScript**: Core framework for building a type-safe, component-based user interface.
- **Tailwind CSS**: Primary tool for styling, ensuring a responsive and consistent design system.
- **shadcn/ui**: Collection of re-usable components built on top of Radix UI for high-quality interface elements.
- **Lucide React**: Standard library for all iconography throughout the application.
- **React Router**: Handles client-side navigation, with all route definitions centralized in `src/App.tsx`.
- **Radix UI**: Low-level UI primitives used for accessible and complex interactive components.

## Library Usage Rules
- **UI Components**: Always prioritize using `shadcn/ui` components. Do not reinvent standard elements like buttons, inputs, or modals.
- **Styling**: Use Tailwind CSS utility classes for all layout, spacing, and custom styling. Avoid writing raw CSS files.
- **Icons**: Use `lucide-react` for all icons to maintain visual consistency.
- **State Management**: Use React hooks (`useState`, `useContext`, `useReducer`) for local and global state.
- **Navigation**: Use `react-router-dom` for all routing needs.
- **File Structure**: 
  - Place page-level components in `src/pages/`.
  - Place reusable UI elements in `src/components/`.
  - Keep components small (ideally under 100 lines) and focused on a single responsibility.
- **Type Safety**: Define explicit TypeScript interfaces or types for all component props and data models.