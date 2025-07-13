# PR Quality Checklist

## General

### Code Quality:

- Ensure code is formatted according to the project's style guide (e.g., Prettier, ESLint).
- Ensure no console logs or commented-out code is present in the final submission.
- Ensure meaningful commit messages and PR descriptions.
- Ensure there is no more than one React.FC component in a file
- JSX components should only be returned once at the end of a React.FC
- all objects should have proper Typescript interfaces. No 'any' object allowed without good reason. If any is used, each property that is required needs to be checked for prior to use of object
- Typescript interfaces should be defined in a props file that corresponds with the main file it is imported in or in the common lib if used in multiple locations (i.e. A.ts, AProps.ts)
- All data calls (from file paths and mongo queries) must be wrapped with proper error handling (try/catch) and return some alternative view for user when possible
- Any functions waiting on data need to be written in a reactive way i.e. using await and calling any rendering after confirmation that the call was successful and required props have been set
- No use of default exports, simply for continuity
- Use of commonlib should be limited to the commonlib folder and not used in the app folder
-Ensure all API response handling follows a structured pattern to improve maintainability.

## MobX

### State Management:

- Ensure all state modifications are done within MobX actions.
- The only time a useEffect should be used:
  - when a component requires its own personal store for each instance of that component
  - when fetching data
  - cleaning up components on unmount
- Ensure observables are used correctly and are not mutated directly outside of actions.
- Ensure computed properties are used for derived state.
- Ensure reactions and autoruns are disposed of properly to avoid memory leaks.
-   Ensure that store actions are used instead of passing unnecessary props between components.
-   Ensure that the store is not used in the component folder, but in the root folder
-   Optimize performance by batching multiple state updates where applicable.

## MongoDB Realm

### Database Operations:

- Ensure all database operations are properly awaited.
- Ensure error handling is in place for all database operations.
- Ensure sensitive data is not logged or exposed.
- Ensure indexes are used for frequently queried fields.
- the mongo folder scheme is as follows:
  - global folder for functions used in multiple apps
  - gamePlatform for game specific functions
  - dashboard for dashboard specific functions
- Ensure all MongoDB queries are optimized and do not unnecessarily fetch large datasets.
- Use appropriate retry mechanisms for MongoDB operations to handle transient failures.

## React

### Component Design:

- Ensure components are functional and use hooks where appropriate.
- Ensure components are properly memoized to avoid unnecessary re-renders.
- Ensure prop types or TypeScript interfaces are defined for all components.
- Ensure state and effect dependencies are correctly specified in hooks.
- Ensure accessibility standards are met (e.g., ARIA roles, keyboard navigation).
- Use useStore() to directly access necessary state instead of passing down multiple props.
- Avoid unnecessary prop drilling; leverage MobX stores for state management.
- Use theme values instead of hardcoded colors to ensure consistent styling.
- Ensure event handlers are debounced where necessary to improve performance.

## Three.js

### 3D Rendering:

- Ensure all Three.js objects are properly disposed of to avoid memory leaks.
- Ensure animations and updates are optimized for performance.
- Ensure the scene graph is correctly managed and updated.
- Ensure camera and controls are correctly configured and responsive.
- Ensure materials and textures are optimized for efficient rendering.

## NX

### Monorepo Management:

- Ensure all affected projects are built and tested.
- Ensure dependencies are correctly specified in `workspace.json` or `nx.json`.
- Ensure no circular dependencies are introduced.
- Ensure code sharing between projects is done through libraries.
- Ensure all shared libraries are updated and utilized properly.

- Verify that affected applications are not negatively impacted by the changes before merging.

## Bitbucket

### Version Control:

- Ensure the PR is up-to-date with the target branch.
- Ensure no large binary files are included in the PR.
- Ensure the PR follows the branching strategy (e.g., feature branches, hotfix branches).
- Ensure the PR includes a link to the relevant Jira ticket.

## Jira

### Issue Tracking:

- Ensure the PR description includes a link to the Jira ticket.
- Ensure the Jira ticket is moved to the appropriate status (e.g., In Review).
- Ensure the PR addresses all acceptance criteria specified in the Jira ticket.
- Ensure the PR includes any necessary documentation updates.
