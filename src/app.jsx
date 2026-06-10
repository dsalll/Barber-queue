import { useState, useEffect, useRef } from "react";

function generateId() {
  return Math.random().toString(36).substr(2, 9);
}

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600&display=swap');
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  :root {
    --black: #0a0a0a; --white: #f5f0e8; --gold: #c8a84b; --gold-light: #e8c96a;
    --red: #c23b22; --green: #2d7a4f; --pending: #a07820; --gray: #888;
    --card-bg: #141414; --border: #2a2a2a;
  }
  body { background: var(--black); color: var(--white); font-family: 'DM Sans', sans-serif; min-height: 100vh; }
  .app { min-height: 100vh; display: flex; flex-direction: column; }
  .header { background: var(--black); border-bottom: 1px solid var(--border); padding: 0 24px; display: flex; align-items: center; justify-content: space-between; height: 64px; position: sticky; top: 0; z-index: 100; }
  .logo { display: flex; align-items: center; gap: 10px; }
  .logo-text { font-family: 'Bebas Neue', sans-serif; font-size: 26px; letter-spacing: 2px; color: var(--white); }
  .logo-text span { color: var(--gold); }
  .open-toggle { font-size: 12px; color: var(--gray); cursor: pointer; display: flex; align-items: center; gap: 6px; }
  .dot { width: 8px; height: 8px; border-radius: 50%; background: var(--green); }
  .dot.closed { background: var(--red); }
  .tabs { display: flex; background: #111; border-bottom: 1px solid var(--border); }
  .tab { flex: 1; padding: 14px; text-align: center; font-size: 13px; font-weight: 600; letter-spacing: 1.5px; text-transform: uppercase; cursor: pointer; border: none; background: transparent; color: var(--gray); border-bottom: 2px solid transparent; transition: all 0.2s; }
  .tab.active { color: var(--gold); border-bottom-color: var(--gold); background: #0a0a0a; }
  .main { flex: 1; padding: 24px 20px; max-width: 500px; margin: 0 auto; width: 100%; }
  .stats { display: grid; grid-template-columns: repeat(3, 1fr); gap: 10px; margin-bottom: 24px; }
  .stat { background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px; padding: 14px 10px; text-align: center; }
  .stat-num { font-family: 'Bebas Neue', sans-serif; font-size: 32px; line-height: 1; color: var(--gold); }
  .stat-label { font-size: 11px; color: var(--gray); letter-spacing: 1px; text-transform: uppercase; margin-top: 4px; }
  .section-label { font-size: 11px; letter-spacing: 2px; text-transform: uppercase; color: var(--gray); margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
  .section-label::after { content: ''; flex: 1; height: 1px; background: var(--border); }
  .queue-card { background: var(--card-bg); border: 1px solid var(--border); border-radius: 12px; padding: 16px; margin-bottom: 10px; display: flex; align-items: center; gap: 14px; animation: slideIn 0.3s ease; }
  @keyframes slideIn { from { opacity: 0; transform: translateY(-8px); } to { opacity: 1; transform: translateY(0); } }
  .queue-card.pending { border-left: 3px solid var(--pending); }
  .queue-card.confirmed { border-left: 3px solid var(--green); }
  .queue-card.in-chair { border-left: 3px solid var(--gold); }
  .queue-num { font-family: 'Bebas Neue', sans-serif; font-size: 28px; color: var(--gold); min-width: 36px; text-align: center; }
  .queue-info { flex: 1; }
  .queue-name { font-weight: 600; font-size: 16px; color: var(--white); }
  .queue-meta { display: flex; align-items: center; gap: 12px; margin-top: 4px; flex-wrap: wrap; }
  .queue-time { font-size: 12px; color: var(--gray); }
  .status-badge { font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 20px; }
  .badge-pending { background: #2a1f00; color: #c8a84b; }
  .badge-confirmed { background: #0d2b1a; color: #4caf82; }
  .badge-in-chair { background: #1a1200; color: var(--gold-light); }
  .queue-actions { display: flex; gap: 8px; }
  .btn-icon { width: 36px; height: 36px; border-radius: 8px; border: 1px solid var(--border); background: #1e1e1e; cursor: pointer; display: flex; align-items: center; justify-content: center; font-size: 16px; transition: all 0.15s; }
  .btn-icon:hover { transform: scale(1.08); }
  .btn-icon.confirm { border-color: var(--green); }
  .btn-icon.confirm:hover { background: var(--green); }
  .btn-icon.reject { border-color: var(--red); }
  .btn-icon.reject:hover { background: var(--red); }
  .btn-icon.start { border-color: var(--gold); }
  .btn-icon.done { border-color: #555; }
  .empty-state { text-align: center; padding: 40px 20px; color: var(--gray); }
  .empty-icon { font-size: 40px; margin-bottom: 12px; }
  .join-form { background: var(--card-bg); border: 1px solid var(--border); border-radius: 16px; padding: 24px; margin-bottom: 24px; }
  .form-title { font-family: 'Bebas Neue', sans-serif; font-size: 22px; letter-spacing: 1px; margin-bottom: 16px; color: var(--gold); }
  .input-group { margin-bottom: 14px; }
  .input-label { font-size: 11px; letter-spacing: 1.5px; text-transform: uppercase; color: var(--gray); margin-bottom: 6px; display: block; }
  input[type="text"], input[type="tel"] { width: 100%; background: #1a1a1a; border: 1px solid var(--border); border-radius: 8px; padding: 12px 14px; color: var(--white); font-family: 'DM Sans', sans-serif; font-size: 15px; outline: none; transition: border-color 0.2s; }
  input:focus { border-color: var(--gold); }
  .btn-primary { width: 100%; background: var(--gold); color: var(--black); border: none; border-radius: 8px; padding: 14px; font-family: 'Bebas Neue', sans-serif; font-size: 18px; letter-spacing: 2px; cursor: pointer; transition: all 0.2s; margin-top: 4px; }
  .btn-primary:hover { background: var(--gold-light); }
  .btn-primary:disabled { background: #333; color: #555; cursor: not-allowed; }
  .wait-banner { background: linear-gradient(135deg, #1a1200, #0d0d0d); border: 1px solid var(--gold); border-radius: 12px; padding: 20px; text-align: center; margin-bottom: 20px; }
  .wait-banner-num { font-family: 'Bebas Neue', sans-serif; font-size: 52px; color: var(--gold); line-height: 1; }
  .wait-banner-label { font-size: 13px; color: var(--gray); margin-top: 4px; }
  .status-banner { border-radius: 12px; padding: 14px 16px; text-align: center; margin-bottom: 20px; font-size: 13px; }
  .status-pending { background: #1a1200; border: 1px solid var(--pending); color: #c8a84b; }
  .status-confirmed { background: #0d2b1a; border: 1px solid var(--green); color: #4caf82; }
  .status-cutting { background: #1a1200; border: 1px solid var(--gold); color: var(--gold-light); }
  .customer-item { background: var(--card-bg); border: 1px solid var(--border); border-radius: 10px; padding: 14px 16px; margin-bottom: 8px; display: flex; align-items: center; gap: 12px; }
  .cpos { font-family: 'Bebas Neue', sans-serif; font-size: 24px; color: var(--gray); min-width: 30px; }
  .cpos.mine { color: var(--gold); }
  .cname { flex: 1; font-size: 15px; }
  .cname.mine { color: var(--gold); font-weight: 600; }
  .mine-tag { font-size: 10px; background: #2a1f00; color: var(--gold); padding: 2px 8px; border-radius: 20px; font-weight: 600; text-transform: uppercase; }
  .leave-btn { width: 100%; background: transparent; border: 1px solid #333; color: var(--gray); border-radius: 8px; padding: 12px; font-family: 'DM Sans', sans-serif; font-size: 14px; cursor: pointer; transition: all 0.2s; margin-top: 8px; }
  .leave-btn:hover { border-color: var(--red); color: var(--red); }
  .divider { height: 1px; background: var(--border); margin: 20px 0; }
  .closed-screen { text-align: center; padding: 60px 20px; }
`;

export default function App() {
  const [view, setView] = useState("barber");
  const [queue, setQueue] = useState([]);
  const [isOpen, setIsOpen] = useState(true);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [myId, setMyId] = useState(null);
  const [joined, setJoined] = useState(false);
  const queueRef = useRef(queue);

  useEffect(() => { queueRef.current = queue; }, [queue]);

  const pending = queue.filter(e => e.status === "pending");
  const confirmed = queue.filter(e => e.status === "confirmed");
  const inChair = queue.filter(e => e.status === "in-chair");
  const myEntry = queue.find(e => e.id === myId);
  const activeQueue = queue.filter(e => e.status !== "in-chair");
  const myPosition = myEntry ? activeQueue.findIndex(e => e.id === myId) + 1 : null;

  const confirmEntry = (id) => setQueue(q => q.map(e => e.id === id ? {...e, status: "confirmed"} : e));
  const rejectEntry = (id) => { setQueue(q => q.filter(e => e.id !== id)); if (id === myId) { setMyId(null); setJoined(false); } };
  const startCut = (id) => setQueue(q => q.map(e => e.id === id ? {...e, status: "in-chair"} : e));
  const doneCut = (id) => setQueue(q => q.filter(e => e.id !== id));

  const joinQueue = () => {
    if (!name.trim()) return;
    const entry = { id: generateId(), name: name.trim(), phone: phone.trim(), status: "pending", time: new Date().toLocaleTimeString([], {hour:"2-digit", minute:"2-digit"}) };
    setQueue(q => [...q, entry]);
    setMyId(entry.id);
    setJoined(true);
    setName(""); setPhone("");
  };

  const leaveQueue = () => { setQueue(q => q.filter(e => e.id !== myId)); setMyId(null); setJoined(false); };

  return (
    <div className="app">
      <style>{styles}</style>
      <div className="header">
        <div className="logo">
          <span style={{color:"#c8a84b",fontSize:24}}>✂</span>
          <span className="logo-text">FRESH<span>CUT</span></span>
        </div>
        <div className="open-toggle" onClick={() => setIsOpen(o => !o)}>
          <div className={`dot ${isOpen ? "" : "closed"}`}></div>
          {isOpen ? "Open" : "Closed"}
        </div>
      </div>

      <div className="tabs">
        <button className={`tab ${view === "barber" ? "active" : ""}`} onClick={() => setView("barber")}>✂ Barber</button>
        <button className={`tab ${view === "customer" ? "active" : ""}`} onClick={() => setView("customer")}>👤 Customer</button>
      </div>

      {view === "barber" && (
        <div className="main">
          <div className="stats">
            <div className="stat"><div className="stat-num">{inChair.length}</div><div className="stat-label">In Chair</div></div>
            <div className="stat"><div className="stat-num">{confirmed.length}</div><div className="stat-label">Confirmed</div></div>
            <div className="stat"><div className="stat-num">{pending.length}</div><div className="stat-label">Pending</div></div>
          </div>

          {inChair.length > 0 && (<>
            <div className="section-label">In Chair</div>
            {inChair.map(e => (
              <div key={e.id} className="queue-card in-chair">
                <div className="queue-num">✂</div>
                <div className="queue-info">
                  <div className="queue-name">{e.name}</div>
                  <div className="queue-meta"><span className="queue-time">{e.time}</span><span className="status-badge badge-in-chair">Cutting</span></div>
                </div>
                <div className="queue-actions"><button className="btn-icon done" onClick={() => doneCut(e.id)}>✓</button></div>
              </div>
            ))}
            <div className="divider" />
          </>)}

          {confirmed.length > 0 && (<>
            <div className="section-label">Up Next</div>
            {confirmed.map((e, i) => (
              <div key={e.id} className="queue-card confirmed">
                <div className="queue-num">{i+1}</div>
                <div className="queue-info">
                  <div className="queue-name">{e.name}</div>
                  <div className="queue-meta"><span className="queue-time">{e.time}</span><span className="status-badge badge-confirmed">Confirmed</span></div>
                </div>
                <div className="queue-actions">
                  <button className="btn-icon start" onClick={() => startCut(e.id)}>✂</button>
                  <button className="btn-icon reject" onClick={() => rejectEntry(e.id)}>✕</button>
                </div>
              </div>
            ))}
            <div className="divider" />
          </>)}

          <div className="section-label">Requests</div>
          {pending.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">💈</div><div>No pending requests</div></div>
          ) : pending.map((e, i) => (
            <div key={e.id} className="queue-card pending">
              <div className="queue-num">{i+1}</div>
              <div className="queue-info">
                <div className="queue-name">{e.name}</div>
                <div className="queue-meta">
                  <span className="queue-time">{e.time}</span>
                  {e.phone && <span className="queue-time">{e.phone}</span>}
                  <span className="status-badge badge-pending">Waiting</span>
                </div>
              </div>
              <div className="queue-actions">
                <button className="btn-icon confirm" onClick={() => confirmEntry(e.id)}>✓</button>
                <button className="btn-icon reject" onClick={() => rejectEntry(e.id)}>✕</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {view === "customer" && (
        <div className="main">
          {!isOpen ? (
            <div className="closed-screen">
              <div style={{fontSize:40}}>🚫</div>
              <div style={{fontSize:18,color:"#c23b22",marginTop:12}}>Shop is closed</div>
              <div style={{fontSize:14,color:"#888",marginTop:8}}>Check back later</div>
            </div>
          ) : !joined ? (
            <>
              {queue.filter(e => e.status !== "pending").length > 0 && (<>
                <div className="section-label">Live Queue</div>
                {queue.filter(e => e.status !== "pending").map((e, i) => (
                  <div key={e.id} className="customer-item">
                    <div className="cpos">{e.status === "in-chair" ? "✂" : i+1}</div>
                    <div className="cname">{e.name}</div>
                    <span className={`status-badge ${e.status === "in-chair" ? "badge-in-chair" : "badge-confirmed"}`}>
                      {e.status === "in-chair" ? "Cutting" : "Waiting"}
                    </span>
                  </div>
                ))}
                <div className="divider" />
              </>)}
              <div className="join-form">
                <div className="form-title">Join the Queue</div>
                <div className="input-group">
                  <label className="input-label">Your Name</label>
                  <input type="text" placeholder="Enter your name" value={name} onChange={e => setName(e.target.value)} />
                </div>
                <div className="input-group">
                  <label className="input-label">Phone (optional)</label>
                  <input type="tel" placeholder="Your phone number" value={phone} onChange={e => setPhone(e.target.value)} />
                </div>
                <button className="btn-primary" onClick={joinQueue} disabled={!name.trim()}>JOIN QUEUE</button>
              </div>
            </>
          ) : (
            <>
              {myEntry ? (
                <>
                  {myEntry.status === "pending" && <div className="status-banner status-pending">⏳ Waiting for barber to confirm your spot…</div>}
                  {myEntry.status === "confirmed" && <div className="status-banner status-confirmed">✅ You're confirmed! Head to the shop.</div>}
                  {myEntry.status === "in-chair" && <div className="status-banner status-cutting">✂ You're in the chair! Enjoy your cut.</div>}
                  {myPosition && myEntry.status !== "in-chair" && (
                    <div className="wait-banner">
                      <div className="wait-banner-num">#{myPosition}</div>
                      <div className="wait-banner-label">Your position in queue</div>
                      <div style={{marginTop:8,fontSize:13,color:"#888"}}>~{(myPosition-1)*20} min estimated wait</div>
                    </div>
                  )}
                  <div className="section-label">Full Queue</div>
                  {queue.map((e, i) => (
                    <div key={e.id} className="customer-item">
                      <div className={`cpos ${e.id === myId ? "mine" : ""}`}>{e.status === "in-chair" ? "✂" : i+1}</div>
                      <div className={`cname ${e.id === myId ? "mine" : ""}`}>{e.id === myId ? `${e.name} (You)` : e.name}</div>
                      {e.id === myId && <span className="mine-tag">You</span>}
                    </div>
                  ))}
                  {myEntry.status !== "in-chair" && <button className="leave-btn" onClick={leaveQueue}>Leave Queue</button>}
                </>
              ) : (
                <div className="empty-state">
                  <div className="empty-icon">✅</div>
                  <div>Your cut is done! See you next time.</div>
                  <button className="btn-primary" style={{marginTop:20}} onClick={() => setJoined(false)}>JOIN AGAIN</button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
  }
