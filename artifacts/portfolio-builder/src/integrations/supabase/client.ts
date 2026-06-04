// Supabase replaced with Replit API server
// This file provides a compatibility shim so existing code still works

const API_BASE = "/api";

async function apiFetch(path: string, options: RequestInit = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    credentials: "include",
  });
  const data = res.ok ? await res.json().catch(() => null) : null;
  const error = res.ok ? null : { message: `Request failed: ${res.status}` };
  return { data, error };
}

class TableQuery {
  private table: string;
  private _filters: Record<string, any> = {};
  private _limit: number | null = null;
  private _single = false;
  private _eqIsPublished: boolean | null = null;

  constructor(table: string) {
    this.table = table;
  }

  select(_cols?: string) { return this; }

  eq(col: string, val: any) {
    if (col === "is_published") { this._eqIsPublished = val; return this; }
    this._filters[col] = val;
    return this;
  }

  limit(n: number) { this._limit = n; return this; }
  single() { this._single = true; return this; }
  order(_col: string, _opts?: { ascending?: boolean }) { return this; }

  then(resolve: (v: any) => void, reject?: (e: any) => void) {
    return this._execute().then(resolve, reject);
  }

  async _execute(): Promise<{ data: any; error: any }> {
    const userId = this._filters["user_id"];
    const id = this._filters["id"];

    if (id && this._single) {
      return apiFetch(`/${this.table}/${id}`);
    }

    if (userId) {
      let qs = "";
      if (this.table === "blog_posts" && this._eqIsPublished === null) {
        qs = "?all=true";
      }
      const result = await apiFetch(`/${this.table}/${userId}${qs}`);
      if (this._single) {
        return { data: Array.isArray(result.data) ? (result.data[0] || null) : result.data, error: result.error };
      }
      return result;
    }

    if (this.table === "profiles" && this._filters["username"]) {
      return apiFetch(`/profiles/username/${encodeURIComponent(this._filters["username"])}`);
    }

    if (this.table === "profiles") {
      return apiFetch("/profiles/all");
    }

    return { data: this._single ? null : [], error: null };
  }

  insert(payload: any) {
    return new MutationQuery("POST", this.table, null, payload);
  }

  update(payload: any) {
    return new UpdateMatcher(this.table, payload);
  }

  delete() {
    return new DeleteMatcher(this.table);
  }
}

class UpdateMatcher {
  private _id: string | null = null;
  constructor(private table: string, private payload: any) {}

  eq(col: string, val: string) {
    if (col === "id") this._id = val;
    return this;
  }

  then(resolve: (v: any) => void, reject?: (e: any) => void) {
    return this._execute().then(resolve, reject);
  }

  async _execute(): Promise<{ data: any; error: any }> {
    if (!this._id) return { data: null, error: { message: "No id for update" } };
    return apiFetch(`/${this.table}/${this._id}`, {
      method: "PATCH",
      body: JSON.stringify(this.payload),
    });
  }
}

class DeleteMatcher {
  private _id: string | null = null;
  constructor(private table: string) {}

  eq(col: string, val: string) {
    if (col === "id") this._id = val;
    return this;
  }

  then(resolve: (v: any) => void, reject?: (e: any) => void) {
    return this._execute().then(resolve, reject);
  }

  async _execute(): Promise<{ data: any; error: any }> {
    if (!this._id) return { data: null, error: { message: "No id for delete" } };
    return apiFetch(`/${this.table}/${this._id}`, { method: "DELETE" });
  }
}

class MutationQuery {
  constructor(
    private method: string,
    private table: string,
    private _id: string | null,
    private payload: any,
  ) {}

  then(resolve: (v: any) => void, reject?: (e: any) => void) {
    return this._execute().then(resolve, reject);
  }

  async _execute(): Promise<{ data: any; error: any }> {
    const url = this._id ? `/${this.table}/${this._id}` : `/${this.table}`;
    return apiFetch(url, {
      method: this.method,
      body: JSON.stringify(this.payload),
    });
  }
}

export const supabase = {
  from: (table: string) => new TableQuery(table),
  auth: {
    onAuthStateChange: (_event: any, _cb: any) => {
      return { data: { subscription: { unsubscribe: () => {} } } };
    },
    getSession: async () => ({ data: { session: null }, error: null }),
    signInWithPassword: async (_opts: any) => ({ data: null, error: { message: "Use Clerk auth" } }),
    signUp: async (_opts: any) => ({ data: null, error: null }),
    signOut: async () => ({ error: null }),
  },
  storage: {
    from: (_bucket: string) => ({
      upload: async (_path: string, _file: File) => ({ error: { message: "Storage not configured" } }),
      getPublicUrl: (_path: string) => ({ data: { publicUrl: "" } }),
    }),
  },
  functions: {
    invoke: async (_name: string, _opts: any) => ({ data: null, error: { message: "Functions not available" } }),
  },
};
