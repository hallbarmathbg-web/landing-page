# Workflow: Resume Session

This workflow ensures the AI assistant has full context before starting work.

## Steps

1. **Read Project Hub**: Read `PROJECT_HUB.md` to understand the core mission and tech stack.
2. **Read Current State**: Read `_project_specs/session/current-state.md` to identify the last active task and environment status.
3. **Read Active Todos**: Read `_project_specs/todos/active.md` to see what is next on the list.
4. **Read Code Landmarks**: View `_project_specs/session/code-landmarks.md` to orient within the codebase.
5. **Update Current State**: Log that you have resumed the session.
6. **Notify User**: Brief the user on your current focus.

// turbo
7. **Check Environment**: Run any diagnostic commands (e.g., `npm status`, `git status`) to verify the environment is ready.

