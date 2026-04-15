"use client";

import { useState } from "react";
import { signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { Trash2, Users, Image as ImageIcon, Calendar, LogOut, Plus, Shield } from "lucide-react";
import Image from "next/image";

interface Photo {
  id: number;
  photographerName: string;
  carModel: string;
  imageUrl: string;
  kudos: number;
  createdAt: Date;
}

interface User {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: Date;
  discordId: string | null;
}

interface Event {
  id: string;
  title: string;
  date: Date;
  location: string | null;
  isActive: boolean;
  _count: { rsvps: number };
}

interface AdminClientProps {
  photos: Photo[];
  users: User[];
  events: Event[];
  adminName: string;
}

type Tab = "photos" | "users" | "events";

export default function AdminClient({ photos: initialPhotos, users: initialUsers, events: initialEvents, adminName }: AdminClientProps) {
  const [tab, setTab] = useState<Tab>("photos");
  const [photos, setPhotos] = useState(initialPhotos);
  const [users, setUsers] = useState(initialUsers);
  const [events, setEvents] = useState(initialEvents);

  // Event form state
  const [showEventForm, setShowEventForm] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: "", date: "", location: "" });

  const deletePhoto = async (id: number) => {
    if (!confirm("Supprimer cette photo ?")) return;
    await fetch(`/api/photos/${id}`, { method: "DELETE" });
    setPhotos((prev) => prev.filter((p) => p.id !== id));
  };

  const toggleUserRole = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    await fetch(`/api/admin/users/${userId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ role: newRole }),
    });
    setUsers((prev) => prev.map((u) => u.id === userId ? { ...u, role: newRole } : u));
  };

  const deleteUser = async (userId: string, userName: string) => {
    if (!confirm(`Supprimer définitivement le compte de "${userName}" ?`)) return;
    const res = await fetch(`/api/admin/users/${userId}`, { method: "DELETE" });
    if (res.ok) {
      setUsers((prev) => prev.filter((u) => u.id !== userId));
    } else {
      const data = await res.json();
      alert(data.error || "Erreur lors de la suppression");
    }
  };

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/admin/events", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newEvent),
    });
    const data = await res.json();
    if (data.event) {
      setEvents((prev) => [{ ...data.event, _count: { rsvps: 0 } }, ...prev]);
      setNewEvent({ title: "", date: "", location: "" });
      setShowEventForm(false);
    }
  };

  const toggleEventActive = async (eventId: string, isActive: boolean) => {
    await fetch(`/api/admin/events/${eventId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isActive: !isActive }),
    });
    setEvents((prev) => prev.map((ev) => ev.id === eventId ? { ...ev, isActive: !isActive } : ev));
  };

  const tabs: { key: Tab; label: string; icon: React.ReactNode; count: number }[] = [
    { key: "photos", label: "Photos", icon: <ImageIcon size={16} />, count: photos.length },
    { key: "users", label: "Membres", icon: <Users size={16} />, count: users.length },
    { key: "events", label: "Événements", icon: <Calendar size={16} />, count: events.length },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <header className="bg-surface-container border-b border-surface-variant px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield size={20} className="text-primary" />
          <span className="font-[family-name:var(--font-space-grotesk)] font-black uppercase tracking-widest text-sm">
            ADMIN PANEL
          </span>
          <span className="text-on-surface-variant text-xs">— {adminName}</span>
        </div>
        <div className="flex items-center gap-4">
          <a href="/" className="text-xs text-on-surface-variant hover:text-white transition-colors uppercase tracking-widest">
            ← Site
          </a>
          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="flex items-center gap-2 text-xs text-on-surface-variant hover:text-primary transition-colors uppercase tracking-widest"
          >
            <LogOut size={14} />
            Déconnexion
          </button>
        </div>
      </header>

      {/* Stats bar */}
      <div className="bg-surface-variant/30 px-6 py-4 flex gap-8 border-b border-surface-variant">
        {tabs.map((t) => (
          <div key={t.key} className="flex items-center gap-2">
            <span className="text-on-surface-variant">{t.icon}</span>
            <span className="font-[family-name:var(--font-space-grotesk)] font-bold text-white">{t.count}</span>
            <span className="text-on-surface-variant text-xs uppercase tracking-widest">{t.label}</span>
          </div>
        ))}
      </div>

      <div className="max-w-screen-xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-1 mb-8 border-b border-surface-variant">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`flex items-center gap-2 px-6 py-3 font-[family-name:var(--font-space-grotesk)] text-xs uppercase tracking-widest transition-colors ${
                tab === t.key
                  ? "border-b-2 border-primary text-white -mb-[1px]"
                  : "text-on-surface-variant hover:text-white"
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>

        {/* Photos Tab */}
        {tab === "photos" && (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo) => (
              <motion.div
                key={photo.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="relative group bg-surface-container border border-surface-variant overflow-hidden"
              >
                <div className="relative aspect-square">
                  <Image
                    src={photo.imageUrl}
                    alt={photo.carModel}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 50vw, 25vw"
                  />
                </div>
                <div className="p-3">
                  <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-xs uppercase truncate">{photo.photographerName}</p>
                  <p className="text-on-surface-variant text-xs truncate">{photo.carModel}</p>
                  <p className="text-primary text-xs mt-1">{photo.kudos} kudos</p>
                </div>
                <button
                  onClick={() => deletePhoto(photo.id)}
                  className="absolute top-2 right-2 w-8 h-8 bg-black/70 flex items-center justify-center text-red-400 hover:bg-red-500/30 transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={14} />
                </button>
              </motion.div>
            ))}
          </div>
        )}

        {/* Users Tab */}
        {tab === "users" && (
          <div className="space-y-2">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex items-center justify-between bg-surface-container border border-surface-variant px-4 py-3"
              >
                <div className="flex items-center gap-4">
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-xs">
                    {(user.name ?? user.email ?? "?")[0].toUpperCase()}
                  </div>
                  <div>
                    <p className="font-[family-name:var(--font-space-grotesk)] font-bold text-sm">{user.name ?? "Sans nom"}</p>
                    <p className="text-on-surface-variant text-xs">{user.email}</p>
                  </div>
                  {user.discordId && (
                    <span className="text-[10px] bg-[#5865F2]/20 text-[#7289da] px-2 py-0.5 uppercase tracking-widest">Discord</span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-[10px] px-2 py-0.5 uppercase tracking-widest border ${user.role === "admin" ? "border-primary/50 text-primary bg-primary/10" : "border-surface-variant text-on-surface-variant"}`}>
                    {user.role}
                  </span>
                  <button
                    onClick={() => toggleUserRole(user.id, user.role)}
                    className="text-xs text-on-surface-variant hover:text-white transition-colors uppercase tracking-widest"
                  >
                    {user.role === "admin" ? "Rétrograder" : "Promouvoir admin"}
                  </button>
                  {user.role !== "admin" && (
                    <button
                      onClick={() => deleteUser(user.id, user.name ?? "Sans nom")}
                      className="text-red-400 hover:text-red-300 transition-colors"
                      title="Supprimer le compte"
                    >
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Events Tab */}
        {tab === "events" && (
          <div className="space-y-4">
            <div className="flex justify-end">
              <button
                onClick={() => setShowEventForm(!showEventForm)}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-white font-[family-name:var(--font-space-grotesk)] text-xs uppercase tracking-widest hover:bg-primary/90 transition-colors"
              >
                <Plus size={14} />
                Nouvel événement
              </button>
            </div>

            {showEventForm && (
              <form onSubmit={createEvent} className="bg-surface-container border border-primary/30 p-6 space-y-4">
                <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-widest text-sm">Créer un événement</h3>
                <input
                  type="text"
                  placeholder="Titre (ex: GRANDE OUVERTURE)"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  className="w-full bg-surface border border-white/10 text-white px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  required
                />
                <input
                  type="datetime-local"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  className="w-full bg-surface border border-white/10 text-white px-4 py-2 text-sm focus:outline-none focus:border-primary"
                  required
                />
                <input
                  type="text"
                  placeholder="Lieu (ex: Parking du Pink Club Wardog)"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  className="w-full bg-surface border border-white/10 text-white px-4 py-2 text-sm focus:outline-none focus:border-primary"
                />
                <button type="submit" className="px-6 py-2 bg-primary text-white font-[family-name:var(--font-space-grotesk)] text-xs uppercase tracking-widest">
                  CRÉER
                </button>
              </form>
            )}

            {events.map((event) => (
              <div key={event.id} className="flex items-center justify-between bg-surface-container border border-surface-variant px-4 py-4">
                <div>
                  <div className="flex items-center gap-3">
                    <h3 className="font-[family-name:var(--font-space-grotesk)] font-bold uppercase tracking-tighter">{event.title}</h3>
                    <span className={`text-[10px] px-2 py-0.5 uppercase tracking-widest border ${event.isActive ? "border-green-500/50 text-green-400 bg-green-500/10" : "border-surface-variant text-on-surface-variant"}`}>
                      {event.isActive ? "Actif" : "Inactif"}
                    </span>
                  </div>
                  <p className="text-on-surface-variant text-xs mt-1">
                    {new Date(event.date).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                    {event.location && ` — ${event.location}`}
                  </p>
                  <p className="text-primary text-xs mt-1">{event._count.rsvps} présents</p>
                </div>
                <button
                  onClick={() => toggleEventActive(event.id, event.isActive)}
                  className="text-xs text-on-surface-variant hover:text-white transition-colors uppercase tracking-widest"
                >
                  {event.isActive ? "Désactiver" : "Activer"}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
