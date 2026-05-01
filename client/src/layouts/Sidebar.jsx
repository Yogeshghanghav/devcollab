import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
import {
  HashtagIcon, PlusIcon, ChartBarIcon,
  Cog6ToothIcon, ArrowRightOnRectangleIcon,
  UserGroupIcon, ChevronDownIcon, ChevronRightIcon,
} from "@heroicons/react/24/outline";

import { setActiveChannel, setActiveDmUser } from "../features/chat/chatSlice";
import { logout } from "../features/auth/authSlice";
import Avatar from "../components/ui/Avatar";
import CreateChannelModal from "../components/chat/CreateChannelModal";

export default function Sidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, users } = useSelector((s) => s.auth);
  const { channels, activeChannelId, activeDmUserId } = useSelector((s) => s.chat);
  const { onlineUsers } = useSelector((s) => s.presence);

  const [showCreate, setShowCreate] = useState(false);
  const [dmCollapsed, setDmCollapsed] = useState(false);

  const isOnline = (uid) => onlineUsers.some((u) => u.id === uid?.toString());

  const handleChannel = (ch) => {
    dispatch(setActiveChannel(ch._id));
    navigate("/app");
  };

  const handleDm = (u) => {
    dispatch(setActiveDmUser(u._id));
    navigate("/app");
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  const otherUsers = users.filter((u) => u._id !== user?._id);
  const canCreate = ["admin", "developer"].includes(user?.role);

  return (
    <>
      <div className="w-64 h-screen flex flex-col" style={{
        background: "linear-gradient(180deg, #13131a 0%, #0f0f15 100%)",
        borderRight: "1px solid rgba(255,255,255,0.06)",
      }}>

        {/* HEADER */}
        <div style={{
          padding: "18px 16px",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          display: "flex",
          alignItems: "center",
          gap: 12,
        }}>
          <div style={{
            width: 36, height: 36,
            borderRadius: 10,
            background: "linear-gradient(135deg, #6c63ff, #9333ea)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(108,99,255,0.4)",
            flexShrink: 0,
          }}>
            <span style={{ fontSize: 11, fontWeight: 800, color: "#fff", letterSpacing: 0.5 }}>DC</span>
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 700, color: "#f0f0f5", letterSpacing: 0.3 }}>DevCollab</p>
            <div style={{ display: "flex", alignItems: "center", gap: 5, marginTop: 2 }}>
              <span style={{
                width: 6, height: 6, borderRadius: "50%",
                background: "#22c55e",
                boxShadow: "0 0 8px #22c55e",
                display: "inline-block",
              }} />
              <span style={{ fontSize: 11, color: "#22c55e" }}>{onlineUsers.length} online</span>
            </div>
          </div>
        </div>

        {/* SCROLL AREA */}
        <div style={{ flex: 1, overflowY: "auto", padding: "10px 8px" }}>

          {/* NAV */}
          {(user?.role === "admin" || user?.role === "developer") && (
            <div style={{ marginBottom: 8 }}>
              {(user?.role === "admin" || user?.role === "developer") && (
                <NavItem
                  icon={<ChartBarIcon style={{ width: 15, height: 15 }} />}
                  label="Monitoring"
                  active={location.pathname === "/monitor"}
                  onClick={() => navigate("/monitor")}
                />
              )}
              {user?.role === "admin" && (
                <NavItem
                  icon={<UserGroupIcon style={{ width: 15, height: 15 }} />}
                  label="Team"
                  active={location.pathname === "/admin"}
                  onClick={() => navigate("/admin")}
                />
              )}
              <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "8px 4px" }} />
            </div>
          )}

          {/* CHANNELS */}
          <div style={{ marginBottom: 8 }}>
            <div style={{
              display: "flex", alignItems: "center", justifyContent: "space-between",
              padding: "4px 8px", marginBottom: 4,
            }}>
              <span style={{ fontSize: 10, fontWeight: 600, color: "#55556a", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Channels
              </span>
              {canCreate && (
                <button
                  onClick={() => setShowCreate(true)}
                  style={{
                    width: 20, height: 20, borderRadius: 6,
                    background: "rgba(255,255,255,0.06)",
                    border: "none", cursor: "pointer",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "#9191a8", transition: "all 0.15s",
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background = "rgba(108,99,255,0.2)"; e.currentTarget.style.color = "#6c63ff"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "rgba(255,255,255,0.06)"; e.currentTarget.style.color = "#9191a8"; }}
                >
                  <PlusIcon style={{ width: 12, height: 12 }} />
                </button>
              )}
            </div>
            {channels.map((ch) => (
              <ChannelItem
                key={ch._id}
                name={ch.name}
                active={activeChannelId === ch._id}
                onClick={() => handleChannel(ch)}
              />
            ))}
          </div>

          {/* DM */}
          <div>
            <button
              onClick={() => setDmCollapsed(!dmCollapsed)}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: 6,
                padding: "4px 8px", marginBottom: 4,
                background: "none", border: "none", cursor: "pointer",
              }}
            >
              {dmCollapsed
                ? <ChevronRightIcon style={{ width: 10, height: 10, color: "#55556a" }} />
                : <ChevronDownIcon style={{ width: 10, height: 10, color: "#55556a" }} />
              }
              <span style={{ fontSize: 10, fontWeight: 600, color: "#55556a", textTransform: "uppercase", letterSpacing: "0.1em" }}>
                Direct Messages
              </span>
            </button>

            {!dmCollapsed && (
              <div>
                {otherUsers.map((u) => (
                  <button
                    key={u._id}
                    onClick={() => handleDm(u)}
                    style={{
                      width: "100%", display: "flex", alignItems: "center", gap: 8,
                      padding: "6px 8px", borderRadius: 8,
                      border: "none", cursor: "pointer", textAlign: "left",
                      background: activeDmUserId === u._id ? "rgba(108,99,255,0.15)" : "transparent",
                      transition: "all 0.15s",
                      marginBottom: 1,
                    }}
                    onMouseEnter={e => { if (activeDmUserId !== u._id) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
                    onMouseLeave={e => { if (activeDmUserId !== u._id) e.currentTarget.style.background = "transparent"; }}
                  >
                    <div style={{ position: "relative", flexShrink: 0 }}>
                      <Avatar name={u.name} size="xs" />
                      {isOnline(u._id) && (
                        <span style={{
                          position: "absolute", bottom: -1, right: -1,
                          width: 7, height: 7, borderRadius: "50%",
                          background: "#22c55e", border: "1.5px solid #0f0f15",
                          boxShadow: "0 0 6px #22c55e",
                        }} />
                      )}
                    </div>
                    <span style={{
                      fontSize: 13, flex: 1,
                      color: activeDmUserId === u._id ? "#f0f0f5" : "#9191a8",
                      fontWeight: activeDmUserId === u._id ? 500 : 400,
                      transition: "color 0.15s",
                    }}>{u.name}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* FOOTER */}
        <div style={{
          borderTop: "1px solid rgba(255,255,255,0.06)",
          padding: "10px 12px",
          display: "flex", alignItems: "center", gap: 10,
        }}>
          <Avatar name={user?.name} size="sm" />
          <div style={{ flex: 1, minWidth: 0 }}>
            <p style={{ fontSize: 13, fontWeight: 600, color: "#f0f0f5", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
              {user?.name}
            </p>
            <p style={{ fontSize: 11, color: "#55556a", textTransform: "capitalize" }}>{user?.role}</p>
          </div>
          <IconBtn onClick={() => navigate("/settings")} title="Settings">
            <Cog6ToothIcon style={{ width: 15, height: 15 }} />
          </IconBtn>
          <IconBtn onClick={handleLogout} title="Logout" danger>
            <ArrowRightOnRectangleIcon style={{ width: 15, height: 15 }} />
          </IconBtn>
        </div>
      </div>

      <CreateChannelModal open={showCreate} onClose={() => setShowCreate(false)} />
    </>
  );
}

function NavItem({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 8,
        padding: "7px 10px", borderRadius: 8, marginBottom: 1,
        border: "none", cursor: "pointer", textAlign: "left",
        background: active ? "linear-gradient(135deg, rgba(108,99,255,0.25), rgba(147,51,234,0.15))" : "transparent",
        color: active ? "#a78bfa" : "#9191a8",
        fontWeight: active ? 600 : 400,
        fontSize: 13,
        transition: "all 0.15s",
        boxShadow: active ? "inset 0 0 0 1px rgba(108,99,255,0.2)" : "none",
      }}
      onMouseEnter={e => { if (!active) { e.currentTarget.style.background = "rgba(255,255,255,0.05)"; e.currentTarget.style.color = "#f0f0f5"; }}}
      onMouseLeave={e => { if (!active) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#9191a8"; }}}
    >
      {icon}
      {label}
    </button>
  );
}

function ChannelItem({ name, active, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        width: "100%", display: "flex", alignItems: "center", gap: 7,
        padding: "6px 10px", borderRadius: 8, marginBottom: 1,
        border: "none", cursor: "pointer", textAlign: "left",
        background: active ? "rgba(108,99,255,0.15)" : "transparent",
        transition: "all 0.15s",
      }}
      onMouseEnter={e => { if (!active) e.currentTarget.style.background = "rgba(255,255,255,0.05)"; }}
      onMouseLeave={e => { if (!active) e.currentTarget.style.background = "transparent"; }}
    >
      <HashtagIcon style={{
        width: 14, height: 14, flexShrink: 0,
        color: active ? "#6c63ff" : "#55556a",
      }} />
      <span style={{
        fontSize: 13,
        color: active ? "#f0f0f5" : "#9191a8",
        fontWeight: active ? 500 : 400,
        transition: "color 0.15s",
      }}>{name}</span>
      {active && (
        <span style={{
          marginLeft: "auto", width: 4, height: 4, borderRadius: "50%",
          background: "#6c63ff", boxShadow: "0 0 8px #6c63ff",
        }} />
      )}
    </button>
  );
}

function IconBtn({ onClick, children, title, danger }) {
  return (
    <button
      onClick={onClick}
      title={title}
      style={{
        width: 28, height: 28, borderRadius: 8, flexShrink: 0,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.06)",
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", color: "#55556a", transition: "all 0.15s",
      }}
      onMouseEnter={e => {
        e.currentTarget.style.background = danger ? "rgba(239,68,68,0.15)" : "rgba(255,255,255,0.1)";
        e.currentTarget.style.color = danger ? "#ef4444" : "#f0f0f5";
        e.currentTarget.style.borderColor = danger ? "rgba(239,68,68,0.3)" : "rgba(255,255,255,0.12)";
      }}
      onMouseLeave={e => {
        e.currentTarget.style.background = "rgba(255,255,255,0.04)";
        e.currentTarget.style.color = "#55556a";
        e.currentTarget.style.borderColor = "rgba(255,255,255,0.06)";
      }}
    >
      {children}
    </button>
  );
}