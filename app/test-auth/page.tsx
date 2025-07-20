"use client";
import { useEffect, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/client/supabase";

export default function TestAuthPage() {
  const [session, setSession] = useState<any>(null);
  const [userCheck, setUserCheck] = useState<any>(null);

  useEffect(() => {
    const checkAuth = async () => {
      const supabase = createSupabaseBrowserClient();
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setSession(session);

      if (session?.user) {
        try {
          const response = await fetch("/api/user/me");
          const result = await response.json();
          setUserCheck({ status: response.status, data: result });
        } catch (error) {
          setUserCheck({ error: error.message });
        }
      }
    };

    checkAuth();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Auth Test Page</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Session Info:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(session, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">User Check Result:</h2>
        <pre className="bg-gray-100 p-4 rounded overflow-auto">
          {JSON.stringify(userCheck, null, 2)}
        </pre>
      </div>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Test User Creation:</h2>
        <button
          onClick={async () => {
            try {
              const response = await fetch("/api/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                  uid: "test-uid-123",
                  email: "test@example.com",
                  displayName: "Test User",
                }),
              });
              const result = await response.json();
              alert(`Status: ${response.status}\nResult: ${JSON.stringify(result)}`);
            } catch (error) {
              alert(`Error: ${error.message}`);
            }
          }}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Test Create User
        </button>
      </div>
    </div>
  );
}
