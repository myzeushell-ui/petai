// Production API base URL — points to deployed Vercel app
// In dev: change to your local Next.js dev server (http://192.168.x.x:3000)
export const API_BASE = "https://petai-ochre.vercel.app";

export const API_ENDPOINTS = {
  chat: `${API_BASE}/api/chat`,
  triage: `${API_BASE}/api/triage`,
  vision: `${API_BASE}/api/vision`,
  insight: `${API_BASE}/api/insight`,
};
