<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Architecture rules
- Multi-tenant: every app table is scoped by `workspace_id`; access via `public.is_member` / `public.has_ws_role` security-definer helpers in RLS. Why: roles live per workspace, enforced in DB not UI.
- Signed-in app lives under `src/routes/_authenticated/` (client-only, wrapped in `WorkspaceProvider` + `AppShell`). Why: single gate and shared sidebar layout.
- All LLM calls go through `src/lib/llm.server.ts` (`getLlmConfig` + `llmJson`), which reads the workspace AI-model integration and routes to the built-in gateway or the workspace's own provider key. Why: one place honours the user's provider/model choice.
