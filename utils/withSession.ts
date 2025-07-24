import { getIronSession } from "iron-session";
import { sessionOptions, SessionData } from "@/utils/sessionOptions";
import { cookies } from "next/headers";

export async function getSession() {
  const session = await getIronSession<SessionData>(cookies(), sessionOptions);
  return session;
}
