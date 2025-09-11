"use client";

import { useEffect, useMemo, useState, useCallback } from "react";

/**
 * Clients
 * -------
 * Aggregates sessions into a distinct client list with quick filtering and
 * optional profile enrichment (attendeesIndex). Behaviour preserved; adds
 * modest accessibility improvements and clearer naming.
 */
export const Clients = ({ email }) => {
  // Raw and derived state
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [attendeesIndex, setAttendeesIndex] = useState({});
  const [profileOpen, setProfileOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState(null);

  const getToken = useCallback(
    () =>
      typeof window !== "undefined"
        ? localStorage.getItem("token") || localStorage.getItem("accessToken")
        : null,
    []
  );

  // Fetch sessions for this MHP
  useEffect(() => {
    let cancelled = false;
    const fetchData = async () => {
      setLoading(true);
      setError("");
      try {
        const token = getToken();
        if (!token) throw new Error("Sign in required.");
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/sessions?professional_email=${email}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch sessions");
        if (cancelled) return;
        const sorted = data.sort(
          (a, b) => new Date(b.session_date) - new Date(a.session_date)
        );
        setSessions(sorted);
      } catch (e) {
        if (!cancelled) setError(e.message || "Failed to load clients");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };
    if (email) fetchData();
    return () => {
      cancelled = true;
    };
  }, [email, getToken]);

  // Basic attendee enrichment (non blocking)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const token = getToken();
        const headers = token ? { Authorization: `Bearer ${token}` } : {};
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/attendees/all`,
          { headers }
        );
        if (!res.ok) return;
        const list = await res.json();
        if (cancelled) return;
        const index = {};
        for (const a of list) if (a?.email) index[a.email] = a;
        setAttendeesIndex(index);
      } catch {
        // silent – enrichment only
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [getToken]);

  // Derive unique client summaries
  const clients = useMemo(() => {
    const map = new Map();
    for (const s of sessions) {
      const key = s.attendee_email;
      if (!key) continue;
      const existing = map.get(key) || {
        attendee_email: key,
        totalSessions: 0,
        lastDate: null,
        lastStatus: null,
      };
      existing.totalSessions += 1;
      const d = s.session_date ? new Date(s.session_date) : null;
      if (!existing.lastDate || (d && d > existing.lastDate)) {
        existing.lastDate = d;
        existing.lastStatus = s.session_status;
      }
      map.set(key, existing);
    }
    let arr = Array.from(map.values()).map((c) => ({
      ...c,
      username: attendeesIndex[c.attendee_email]?.username || null,
      phoneNumber: attendeesIndex[c.attendee_email]?.phoneNumber || null,
    }));
    const q = query.trim().toLowerCase();
    if (q) {
      arr = arr.filter((c) =>
        [c.attendee_email, c.username]
          .filter(Boolean)
          .some((v) => String(v).toLowerCase().includes(q))
      );
    }
    arr.sort(
      (a, b) => (b.lastDate?.getTime() || 0) - (a.lastDate?.getTime() || 0)
    );
    return arr;
  }, [sessions, attendeesIndex, query]);

  // Navigation helpers (hash based anchor behaviour retained)
  const goToSessions = useCallback(() => {
    if (typeof window !== "undefined") window.location.hash = "sessions";
  }, []);
  const goToSessionsForClient = useCallback((attendeeEmail) => {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(
        "mhpSessionsFilterAttendeeEmail",
        String(attendeeEmail)
      );
    } catch {}
    window.location.hash = "sessions";
  }, []);

  // Modal handlers
  const openProfile = (client) => {
    setSelectedClient(client);
    setProfileOpen(true);
  };
  const closeProfile = () => {
    setProfileOpen(false);
    setSelectedClient(null);
  };

  return (
    <section
      id="clients"
      className="mb-12 min-h-[60vh]"
      aria-labelledby="clients-heading"
    >
      <div className="flex items-end justify-between flex-wrap gap-4 mb-6">
        <div>
          <h2
            id="clients-heading"
            className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-teal-500 bg-clip-text text-transparent"
          >
            Clients
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-1">
            A list of attendees you’ve had sessions with
          </p>
        </div>
        <div className="relative">
          <label htmlFor="client-search" className="sr-only">
            Search clients
          </label>
          <input
            id="client-search"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by email or username..."
            className="w-64 md:w-80 px-4 py-2 rounded-lg border border-slate-200/60 dark:border-slate-700/60 bg-white/80 dark:bg-slate-800/80 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
          />
        </div>
      </div>

      {loading && (
        <div
          className="p-6 text-center text-slate-600 dark:text-slate-400"
          role="status"
          aria-live="polite"
        >
          Loading clients...
        </div>
      )}

      {!loading && error && (
        <div
          className="p-4 mb-4 rounded-lg border border-red-400/50 bg-red-500/10 dark:bg-red-950/30 dark:border-red-900/40 text-red-700 dark:text-red-300"
          role="alert"
        >
          {error}
        </div>
      )}

      {!loading && !error && clients.length === 0 && (
        <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 text-center">
          No clients yet. When attendees request sessions and you engage with
          them, they’ll appear here.
          <div className="mt-4">
            <button
              className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
              onClick={goToSessions}
            >
              View Sessions
            </button>
          </div>
        </div>
      )}

      {!loading && !error && clients.length > 0 && (
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4"
          role="list"
          aria-label="Client list"
        >
          {clients.map((c) => (
            <div
              key={c.attendee_email}
              className="p-5 rounded-xl bg-white/90 dark:bg-slate-900/80 border border-slate-200/60 dark:border-slate-700/60 hover:shadow-lg transition-all"
              role="listitem"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="text-sm text-slate-500 dark:text-slate-400">
                    Attendee
                  </div>
                  <div className="font-semibold text-slate-900 dark:text-white">
                    {c.username || c.attendee_email}
                  </div>
                  {c.username && (
                    <div className="text-xs text-slate-500 dark:text-slate-400">
                      {c.attendee_email}
                    </div>
                  )}
                  {c.phoneNumber && (
                    <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      {c.phoneNumber}
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Total Sessions
                  </div>
                  <div className="text-lg font-semibold">{c.totalSessions}</div>
                </div>
              </div>
              <div className="mt-4 flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                <div>
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Last Status
                  </div>
                  <div className="capitalize">{c.lastStatus || "-"}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-slate-500 dark:text-slate-400">
                    Last Session
                  </div>
                  <div>
                    {c.lastDate ? new Date(c.lastDate).toLocaleString() : "-"}
                  </div>
                </div>
              </div>
              <div className="mt-5 flex gap-2 flex-wrap">
                <button
                  className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
                  onClick={() => goToSessionsForClient(c.attendee_email)}
                >
                  View Sessions
                </button>
                <button
                  className="px-3 py-2 rounded-lg bg-white/70 dark:bg-slate-800/70 border border-slate-200/60 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200"
                  onClick={() => openProfile(c)}
                >
                  View Profile
                </button>
                <a
                  className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                  href={`mailto:${c.attendee_email}`}
                >
                  Email
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

      {profileOpen && selectedClient && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          role="dialog"
          aria-modal="true"
          aria-labelledby="client-profile-title"
        >
          <div className="w-full max-w-md rounded-xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-700/60 shadow-2xl p-6">
            <div className="flex items-center justify-between mb-2">
              <h3
                id="client-profile-title"
                className="text-lg font-semibold text-slate-900 dark:text-white"
              >
                Client Profile
              </h3>
              <button
                className="px-2 py-1 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
                aria-label="Close"
                onClick={closeProfile}
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 text-sm">
              <div>
                <span className="text-slate-500 dark:text-slate-400">
                  Name:{" "}
                </span>
                <span className="font-medium text-slate-900 dark:text-white">
                  {selectedClient.username || "-"}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">
                  Email:{" "}
                </span>
                <span className="font-medium break-all">
                  {selectedClient.attendee_email}
                </span>
              </div>
              {attendeesIndex[selectedClient.attendee_email]?.phoneNumber && (
                <div>
                  <span className="text-slate-500 dark:text-slate-400">
                    Phone:{" "}
                  </span>
                  <span className="font-medium">
                    {attendeesIndex[selectedClient.attendee_email]?.phoneNumber}
                  </span>
                </div>
              )}
              {attendeesIndex[selectedClient.attendee_email]?.age != null && (
                <div>
                  <span className="text-slate-500 dark:text-slate-400">
                    Age:{" "}
                  </span>
                  <span className="font-medium">
                    {attendeesIndex[selectedClient.attendee_email]?.age}
                  </span>
                </div>
              )}
              {attendeesIndex[selectedClient.attendee_email]?.sex && (
                <div>
                  <span className="text-slate-500 dark:text-slate-400">
                    Sex:{" "}
                  </span>
                  <span className="font-medium capitalize">
                    {attendeesIndex[selectedClient.attendee_email]?.sex}
                  </span>
                </div>
              )}
              {attendeesIndex[selectedClient.attendee_email]?.address && (
                <div>
                  <span className="text-slate-500 dark:text-slate-400">
                    Address:{" "}
                  </span>
                  <span className="font-medium">
                    {attendeesIndex[selectedClient.attendee_email]?.address}
                  </span>
                </div>
              )}
            </div>
            <div className="mt-5 flex justify-end gap-2">
              <button
                className="px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200"
                onClick={closeProfile}
              >
                Close
              </button>
              <button
                className="px-3 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                onClick={() => {
                  goToSessionsForClient(selectedClient.attendee_email);
                  closeProfile();
                }}
              >
                View Sessions
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
