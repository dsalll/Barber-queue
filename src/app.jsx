import { useState, useEffect } from "react";

const STORAGE_KEY = "barber_queue_v1";

const initialQueue = [];

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

function getQueue() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

function saveQueue(queue) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(queue));
  } catch {}
}

// ─── ICONS ───────────────────────────────────────────────────────────────────
const ScissorsIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="6" cy="6" r="3"/><circle cx="6" cy="18" r="3"/>
    <line x1="20" y1="4" x2="8.12" y2="15.88"/>
    <line x1="14.47" y1="14.48" x2="20" y2="20"/>
    <line x1="8.12" y1="8.12" x2="12" y2="12"/>
  </svg>
);

const CheckIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
  </svg>
);

const ClockIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
);

const UserIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>
  </svg>
);

// ─── STYLES ──────────────────────────────────────────────────────────────────
const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --black: #0a0a0a;
    --white: #f5f0e8;
    --cream: #ede8dc;
    --gold: #c8a84b;
    --gold-light: #e8c96a;
    --red: #c23b22;
    --green: #2d7a4f;
    --pending: #a07820;
    --gray: #888;
    --card-bg: #141414;
    --border: #2a2a2a;
  }

  body {
    background: var(--black);
    color: var(--white);
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
  }

  .app { min-height: 100vh; display: flex; flex-direction: column; }

  /* HEADER */
  .header {
    background: var(--black);
    border-bottom: 1px solid var(--border);
    padding: 0 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
    position: sticky;
    top: 0;
    z-index: 100;
  }
  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    color: var(--gold);
  }
  .logo-text {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 26px;
    letter-spacing: 2px;
    color: var(--white);
  }
  .logo-text span { color: var(--gold); }

  /* TABS */
  .tabs {
    display: flex;
    background: #111;
    border-bottom: 1px solid var(--border);
  }
  .tab {
    flex: 1;
    padding: 14px;
    text-align: center;
    font-size: 13px;
    font-weight: 600;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    cursor: pointer;
    border: none;
    background: transparent;
    color: var(--gray);
    border-bottom: 2px solid transparent;
    transition: all 0.2s;
  }
  .tab.active {
    color: var(--gold);
    border-bottom-color: var(--gold);
    background: #0a0a0a;
  }

  /* MAIN */
  .main { flex: 1; padding: 24px 20px; max-width: 500px; margin: 0 auto; width: 100%; }

  /* STATS BAR */
  .stats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 10px;
    margin-bottom: 24px;
  }
  .stat {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 10px;
    text-align: center;
  }
  .stat-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 32px;
    line-height: 1;
    color: var(--gold);
  }
  .stat-label {
    font-size: 11px;
    color: var(--gray);
    letter-spacing: 1px;
    text-transform: uppercase;
    margin-top: 4px;
  }

  /* SECTION LABEL */
  .section-label {
    font-size: 11px;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: var(--gray);
    margin-bottom: 12px;
    display: flex;
    align-items: center;
    gap: 8px;
  }
  .section-label::after {
    content: '';
    flex: 1;
    height: 1px;
    background: var(--border);
  }

  /* QUEUE CARD */
  .queue-card {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 16px;
    margin-bottom: 10px;
    display: flex;
    align-items: center;
    gap: 14px;
    transition: border-color 0.2s;
    animation: slideIn 0.3s ease;
  }
  @keyframes slideIn {
    from { opacity: 0; transform: translateY(-8px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .queue-card.pending { border-left: 3px solid var(--pending); }
  .queue-card.confirmed { border-left: 3px solid var(--green); }
  .queue-card.in-chair { border-left: 3px solid var(--gold); }

  .queue-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 28px;
    color: var(--gold);
    min-width: 36px;
    text-align: center;
  }
  .queue-info { flex: 1; }
  .queue-name {
    font-weight: 600;
    font-size: 16px;
    color: var(--white);
  }
  .queue-meta {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 4px;
  }
  .queue-time {
    display: flex;
    align-items: center;
    gap: 4px;
    font-size: 12px;
    color: var(--gray);
  }
  .status-badge {
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.5px;
    padding: 2px 8px;
    border-radius: 20px;
  }
  .badge-pending { background: #2a1f00; color: #c8a84b; }
  .badge-confirmed { background: #0d2b1a; color: #4caf82; }
  .badge-in-chair { background: #1a1200; color: var(--gold-light); }

  .queue-actions { display: flex; gap: 8px; }
  .btn-icon {
    width: 36px;
    height: 36px;
    border-radius: 8px;
    border: 1px solid var(--border);
    background: #1e1e1e;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.15s;
  }
  .btn-icon:hover { transform: scale(1.08); }
  .btn-icon.confirm { border-color: var(--green); color: var(--green); }
  .btn-icon.confirm:hover { background: var(--green); color: white; }
  .btn-icon.reject { border-color: var(--red); color: var(--red); }
  .btn-icon.reject:hover { background: var(--red); color: white; }
  .btn-icon.start { border-color: var(--gold); color: var(--gold); }
  .btn-icon.start:hover { background: var(--gold); color: black; }
  .btn-icon.done { border-color: #555; color: #aaa; }
  .btn-icon.done:hover { background: #333; color: white; }

  .empty-state {
    text-align: center;
    padding: 40px 20px;
    color: var(--gray);
  }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .empty-text { font-size: 14px; }

  /* CUSTOMER VIEW */
  .join-form {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 16px;
    padding: 24px;
    margin-bottom: 24px;
  }
  .form-title {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 22px;
    letter-spacing: 1px;
    margin-bottom: 16px;
    color: var(--gold);
  }
  .input-group { margin-bottom: 14px; }
  .input-label {
    font-size: 11px;
    letter-spacing: 1.5px;
    text-transform: uppercase;
    color: var(--gray);
    margin-bottom: 6px;
    display: block;
  }
  input[type="text"], input[type="tel"] {
    width: 100%;
    background: #1a1a1a;
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 12px 14px;
    color: var(--white);
    font-family: 'DM Sans', sans-serif;
    font-size: 15px;
    outline: none;
    transition: border-color 0.2s;
  }
  input:focus { border-color: var(--gold); }

  .btn-primary {
    width: 100%;
    background: var(--gold);
    color: var(--black);
    border: none;
    border-radius: 8px;
    padding: 14px;
    font-family: 'Bebas Neue', sans-serif;
    font-size: 18px;
    letter-spacing: 2px;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 4px;
  }
  .btn-primary:hover { background: var(--gold-light); transform: translateY(-1px); }
  .btn-primary:disabled { background: #333; color: #555; cursor: not-allowed; transform: none; }

  /* CUSTOMER QUEUE VIEW */
  .customer-queue-item {
    background: var(--card-bg);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 14px 16px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .cqi-pos {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 24px;
    color: var(--gray);
    min-width: 30px;
  }
  .cqi-pos.mine { color: var(--gold); }
  .cqi-name { flex: 1; font-size: 15px; }
  .cqi-name.mine { color: var(--gold); font-weight: 600; }
  .mine-tag {
    font-size: 10px;
    background: #2a1f00;
    color: var(--gold);
    padding: 2px 8px;
    border-radius: 20px;
    font-weight: 600;
    letter-spacing: 0.5px;
    text-transform: uppercase;
  }

  .wait-banner {
    background: linear-gradient(135deg, #1a1200, #0d0d0d);
    border: 1px solid var(--gold);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    margin-bottom: 20px;
    animation: slideIn 0.4s ease;
  }
  .wait-banner-num {
    font-family: 'Bebas Neue', sans-serif;
    font-size: 52px;
    color: var(--gold);
    line-height: 1;
  }
  .wait-banner-label { font-size: 13px; color: var(--gray); margin-top: 4px; }

  .success-banner {
    background: #0d2b1a;
    border: 1px solid var(--green);
    border-radius: 12px;
    padding: 20px;
    text-align: center;
    margin-bottom: 20px;
    animation: slideIn 0.4s ease;
  }
  .success-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; color: #4caf82; letter-spacing: 1px; }
  .success-sub { font-size: 13px; color: #4caf82; opacity: 0.7; margin-top: 4px; }

  .waiting-banner {
    background: #1a1200;
    border: 1px solid var(--pending);
    border-radius: 12px;
    padding: 14px 16px;
    text-align: center;
    margin-bottom: 20px;
    font-size: 13px;
    color: #c8a84b;
    animation: pulse 2s infinite;
  }
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.7; }
  }

  .leave-btn {
    width: 100%;
    background: transparent;
    border: 1px solid #333;
    color: var(--gray);
    border-radius: 8px;
    padding: 12px;
    font-family: 'DM Sans', sans-serif;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.2s;
    margin-top: 8px;
  }
  .leave-btn:hover { border-color: var(--red); color: var(--red); }

  .confirmed-banner {
    background: #0d2b1a;
    border: 1px solid var(--green);
    border-radius: 12px;
    padding: 14px 16px;
    text-align: center;
    margin-bottom: 20px;
    font-size: 13px;
    color: #4caf82;
  }

  .divider { height: 1px; background: var(--border); margin: 20px 0; }

  .barber-open {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: var(--gray);
  }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); }
  .dot.closed { background: var(--red); }
`;
                              // ─── APP ─────────────────────────────────────────────────────────────────────
export default function App() {
  const [view, setView] = useState("barber");
  const [queue, setQueue] = useState([]);
  const [isOpen, setIsOpen] = useState(true);

  // customer form
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [myId, setMyId] = useState(null);
  const [joined, setJoined] = useState(false);

  // sync queue (simulate real-time with localStorage polling)
  useEffect(() => {
    const load = () => setQueue(getQueue());
    load();
    const interval = setInterval(load, 2000);
    return () => clearInterval(interval);
  }, []);

  const updateQueue = (newQueue) => {
    saveQueue(newQueue);
    setQueue(newQueue);
  };

  // ── BARBER ACTIONS ──
  const confirmEntry = (id) => {
    updateQueue(queue.map(e => e.id === id ? { ...e, status: "confirmed" } : e));
  };
  const rejectEntry = (id) => {
    updateQueue(queue.filter(e => e.id !== id));
    if (id === myId) { setMyId(null); setJoined(false); }
  };
  const startCut = (id) => {
    updateQueue(queue.map(e => e.id === id ? { ...e, status: "in-chair" } : e));
  };
  const doneCut = (id) => {
    updateQueue(queue.filter(e => e.id !== id));
  };

  // ── CUSTOMER ACTIONS ──
  const joinQueue = () => {
    if (!name.trim()) return;
    const entry = {
      id: generateId(),
      name: name.trim(),
      phone: phone.trim(),
      status: "pending",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };
    const newQueue = [...getQueue(), entry];
    updateQueue(newQueue);
    setMyId(entry.id);
    setJoined(true);
    setName("");
    setPhone("");
  };

  const leaveQueue = () => {
    updateQueue(queue.filter(e => e.id !== myId));
    setMyId(null);
    setJoined(false);
  };

  // ── COMPUTED ──
  const pending = queue.filter(e => e.status === "pending");
  const confirmed = queue.filter(e => e.status === "confirmed");
  const inChair = queue.filter(e => e.status === "in-chair");
  const myEntry = queue.find(e => e.id === myId);
  const myPosition = myEntry ? queue.filter(e => e.status !== "in-chair").findIndex(e => e.id === myId) + 1 : null;
  const waitMins = myPosition ? (myPosition - 1) * 20 + (inChair.length > 0 ? 10 : 0) : 0;

  return (
    <div className="app">
      <style>{styles}</style>

      {/* HEADER */}
      <div className="header">
        <div className="logo">
          <ScissorsIcon />
          <span className="logo-text">FRESH<span>CUT</span></span>
        </div>
        <div className="barber-open">
          <div className={`dot ${isOpen ? "" : "closed"}`}></div>
          <span
            style={{ cursor: "pointer", userSelect: "none" }}
            onClick={() => setIsOpen(o => !o)}
          >
            {isOpen ? "Open — tap to close" : "Closed — tap to open"}
          </span>
        </div>
      </div>

      {/* TABS */}
      <div className="tabs">
        <button className={`tab ${view === "barber" ? "active" : ""}`} onClick={() => setView("barber")}>
          ✂️ Barber View
        </button>
        <button className={`tab ${view === "customer" ? "active" : ""}`} onClick={() => setView("customer")}>
          👤 Customer View
        </button>
      </div>

      {/* ── BARBER VIEW ── */}
      {view === "barber" && (
        <div className="main">
          {/* Stats */}
          <div className="stats">
            <div className="stat">
              <div className="stat-num">{inChair.length}</div>
              <div className="stat-label">In Chair</div>
            </div>
            <div className="stat">
              <div className="stat-num">{confirmed.length}</div>
              <div className="stat-label">Confirmed</div>
            </div>
            <div className="stat">
              <div className="stat-num">{pending.length}</div>
              <div className="stat-label">Pending</div>
            </div>
          </div>

          {/* In Chair */}
          {inChair.length > 0 && (
            <>
              <div className="section-label">In Chair</div>
              {inChair.map((e, i) => (
                <div key={e.id} className="queue-card in-chair">
                  <div className="queue-num">✂</div>
                  <div className="queue-info">
                    <div className="queue-name">{e.name}</div>
                    <div className="queue-meta">
                      <div className="queue-time"><ClockIcon />{e.time}</div>
                      <span className="status-badge badge-in-chair">Cutting</span>
                    </div>
                  </div>
                  <div className="queue-actions">
                    <button className="btn-icon done" onClick={() => doneCut(e.id)} title="Done">
                      <CheckIcon />
                    </button>
                  </div>
                </div>
              ))}
              <div className="divider" />
            </>
          )}

          {/* Confirmed */}
          {confirmed.length > 0 && (
            <>
              <div className="section-label">Up Next</div>
              {confirmed.map((e, i) => (
                <div key={e.id} className="queue-card confirmed">
                  <div className="queue-num">{i + 1}</div>
                  <div className="queue-info">
                    <div className="queue-name">{e.name}</div>
                    <div className="queue-meta">
                      <div className="queue-time"><ClockIcon />{e.time}</div>
                      <span className="status-badge badge-confirmed">Confirmed</span>
                    </div>
                  </div>
                  <div className="queue-actions">
                    <button className="btn-icon start" onClick={() => startCut(e.id)} title="Start cut">
                      <ScissorsIcon />
                    </button>
                    <button className="btn-icon reject" onClick={() => rejectEntry(e.id)} title="Remove">
                      <XIcon />
                    </button>
                  </div>
                </div>
              ))}
              <div className="divider" />
            </>
          )}

          {/* Pending */}
          <div className="section-label">Requests</div>
          {pending.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">💈</div>
              <div className="empty-text">No pending requests</div>
            </div>
          ) : (
            pending.map((e, i) => (
              <div key={e.id} className="queue-card pending">
                <div className="queue-num">{i + 1}</div>
                <div className="queue-info">
                  <div className="queue-name">{e.name}</div>
                  <div className="queue-meta">
                    <div className="queue-time"><ClockIcon />{e.time}</div>
                    {e.phone && <div className="queue-time"><UserIcon />{e.phone}</div>}
                    <span className="status-badge badge-pending">Waiting</span>
                  </div>
                </div>
                <div className="queue-actions">
                  <button className="btn-icon confirm" onClick={() => confirmEntry(e.id)} title="Confirm">
                    <CheckIcon />
                  </button>
                  <button className="btn-icon reject" onClick={() => rejectEntry(e.id)} title="Reject">
                    <XIcon />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* ── CUSTOMER VIEW ── */}
      {view === "customer" && (
        <div className="main">
          {!isOpen ? (
            <div className="empty-state" style={{ paddingTop: 60 }}>
              <div className="empty-icon">🚫</div>
              <div className="empty-text" style={{ fontSize: 16, color: "#c23b22" }}>Shop is currently closed</div>
              <div className="empty-text" style={{ marginTop: 8 }}>Check back later</div>
            </div>
          ) : !joined ? (
            <>
              {/* Live queue preview */}
              {queue.filter(e => e.status !== "pending").length > 0 && (
                <>
                  <div className="section-label">Live Queue</div>
                  {queue.filter(e => e.status !== "pending").map((e, i) => (
                    <div key={e.id} className="customer-queue-item">
                      <div className="cqi-pos">{e.status === "in-chair" ? "✂" : i + 1}</div>
                      <div className="cqi-name">{e.name}</div>
                      <span className={`status-badge ${e.status === "in-chair" ? "badge-in-chair" : "badge-confirmed"}`}>
                        {e.status === "in-chair" ? "Cutting" : "Waiting"}
                      </span>
                    </div>
                  ))}
                  <div className="divider" />
                </>
              )}

              <div className="join-form">
                <div className="form-title">Join the Queue</div>
                <div className="input-group">
                  <label className="input-label">Your Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Chukwuemeka"
                    value={name}
                    onChange={e => setName(e.target.value)}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Phone (optional)</label>
                  <input
                    type="tel"
                    placeholder="e.g. 080 xxx xxxx"
                    value={phone}
                    onChange={e => setPhone(e.target.value)}
                  />
                </div>
                <button className="btn-primary" onClick={joinQueue} disabled={!name.trim()}>
                  JOIN QUEUE
                </button>
              </div>
            </>
          ) : (
            <>
              {/* My status */}
              {myEntry ? (
                <>
                  {myEntry.status === "pending" && (
                    <div className="waiting-banner">
                      ⏳ Waiting for barber to confirm your spot…
                    </div>
                  )}
                  {myEntry.status === "confirmed" && (
                    <div className="confirmed-banner">
                      ✅ You're confirmed! Head to the shop.
                    </div>
                  )}
                  {myEntry.status === "in-chair" && (
                    <div className="success-banner">
                      <div className="success-title">You're in the chair!</div>
                      <div className="success-sub">Enjoy your cut 💈</div>
                    </div>
                  )}

                  {myPosition && myEntry.status !== "in-chair" && (
                    <div className="wait-banner">
                      <div className="wait-banner-num">#{myPosition}</div>
                      <div className="wait-banner-label">Your position in queue</div>
                      {waitMins > 0 && (
                        <div style={{ marginTop: 8, fontSize: 13, color: "#888" }}>
                          ~{waitMins} min estimated wait
                        </div>
                      )}
                    </div>
                  )}

                  {/* Full queue */}
                  <div className="section-label">Full Queue</div>
                  {queue.map((e, i) => (
                    <div key={e.id} className="customer-queue-item">
                      <div className={`cqi-pos ${e.id === myId ? "mine" : ""}`}>
                        {e.status === "in-chair" ? "✂" : i + 1}
                      </div>
                      <div className={`cqi-name ${e.id === myId ? "mine" : ""}`}>
                        {e.id === myId ? `${e.name} (You)` : e.name}
                      </div>
                      {e.id === myId && <span className="mine-tag">You</span>}
                    </div>
                  ))}

                  {myEntry.status !== "in-chair" && (
                    <button className="leave-btn" onClick={leaveQueue}>
                      Leave Queue
                    </button>
                  )}
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">✅</div>
                  <div className="empty-text">Your cut is done! See you next time.</div>
                  <button className="btn-primary" style={{ marginTop: 20 }} onClick={() => setJoined(false)}>
                    JOIN AGAIN
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}
