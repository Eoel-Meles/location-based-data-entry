const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:8000"
    : "https://location_based_data_entry_api.now.sh";

export async function listLogEntries() {
  const response = await fetch(`${API_URL}/api/logs`);
  return response.json();
}

export async function regesterUser(data) {
  const response = await fetch(`${API_URL}/api/auth/`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function loginUser(data) {
  const response = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });
  return response.json();
}

export async function createLogEntry(entry) {
  const apiKey = entry.apiKey;
  delete entry.apiKey;
  const response = await fetch(`${API_URL}/api/logs`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "X-API-KEY": apiKey,
    },
    body: JSON.stringify(entry),
  });
  let json;
  if (response.headers.get("content-type").includes("text/html")) {
    const message = await response.text();
    json = {
      message,
    };
  } else {
    json = await response.json();
  }
  if (response.ok) {
    return json;
  }
  const error = new Error(json.message);
  error.response = json;
  throw error;
}
