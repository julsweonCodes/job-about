#!/usr/bin/env node

import { createClient } from "@supabase/supabase-js";
import { readFileSync } from "fs";
import { config } from "dotenv";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// 환경변수 로드
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
config({ path: join(__dirname, ".env") });

// 환경변수 확인
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Error: Supabase environment variables are not set");
  console.error("Please check your .env.local file");
  process.exit(1);
}

// Supabase 클라이언트 초기화
const supabase = createClient(supabaseUrl, supabaseKey);

// 간단한 MCP 스타일 서버
class SimpleMCPServer {
  constructor() {
    this.tools = [
      {
        name: "query_database",
        description: "Execute query on Supabase database",
        inputSchema: {
          type: "object",
          properties: {
            table: { type: "string" },
            query: { type: "string" },
          },
        },
      },
      {
        name: "get_table_schema",
        description: "Get schema for a table",
        inputSchema: {
          type: "object",
          properties: {
            table: { type: "string" },
          },
        },
      },
      {
        name: "list_tables",
        description: "List all tables",
        inputSchema: {
          type: "object",
          properties: {},
        },
      },
    ];
  }

  async handleRequest(request) {
    const { method, params } = request;

    switch (method) {
      case "tools/list":
        return {
          tools: this.tools,
        };

      case "tools/call":
        return await this.handleToolCall(params);

      default:
        throw new Error(`Unknown method: ${method}`);
    }
  }

  async handleToolCall(params) {
    const { name, arguments: args } = params;

    try {
      switch (name) {
        case "query_database":
          const { data, error } = await supabase
            .from(args.table || "users")
            .select("*")
            .limit(10);

          if (error) throw error;

          return {
            content: [
              {
                type: "text",
                text: `Query result: ${JSON.stringify(data, null, 2)}`,
              },
            ],
          };

        case "get_table_schema":
          // 데이터베이스 타입 정의에서 스키마 정보 가져오기
          const schemaPath = "./types/database.types.ts";
          const schemaContent = readFileSync(schemaPath, "utf8");

          return {
            content: [
              {
                type: "text",
                text: `Schema for table ${args.table}: ${schemaContent.substring(0, 500)}...`,
              },
            ],
          };

        case "list_tables":
          const tables = [
            "users",
            "job_posts",
            "applicant_profiles",
            "applications",
            "business_loc",
            "quiz_questions",
            "quiz_choices",
            "user_responses",
            "personality_profiles",
            "work_styles",
            "practical_skills",
          ];

          return {
            content: [
              {
                type: "text",
                text: `Available tables: ${tables.join(", ")}`,
              },
            ],
          };

        default:
          throw new Error(`Unknown tool: ${name}`);
      }
    } catch (error) {
      return {
        content: [
          {
            type: "text",
            text: `Error: ${error.message}`,
          },
        ],
      };
    }
  }
}

// 서버 시작
const server = new SimpleMCPServer();

// stdin/stdout을 통한 통신
process.stdin.setEncoding("utf8");
process.stdout.setEncoding("utf8");

process.stdin.on("data", async (data) => {
  try {
    const request = JSON.parse(data);
    const response = await server.handleRequest(request);
    process.stdout.write(JSON.stringify(response) + "\n");
  } catch (error) {
    process.stdout.write(
      JSON.stringify({
        error: error.message,
      }) + "\n"
    );
  }
});

console.error("MCP Server started");
