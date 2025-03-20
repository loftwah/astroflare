export async function onRequest({
    env,
  }: {
    env: { DB: any };
  }): Promise<Response> {
    const stmt = await env.DB.prepare("SELECT sqlite_version() AS version").run();
    return new Response(JSON.stringify(stmt.results), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }