"use client";

import { useEffect, useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getCurrentUser, clearCurrentUser, User } from "@/lib/auth";
import {
  Habit,
  getUserHabits,
  addHabit,
  editHabit,
  deleteHabit,
  getTodayDateString,
  isHabitCompletedToday,
  toggleHabitCompletion,
  calculateStreak,
} from "@/lib/habits";

// Helper to get an icon color based on habit id
const getIconColor = (id: string) => {
  const colors = [
    "bg-orange-500/20 text-orange-500",
    "bg-emerald-500/20 text-emerald-500",
    "bg-blue-500/20 text-blue-500",
    "bg-purple-500/20 text-purple-500",
    "bg-pink-500/20 text-pink-500",
  ];
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash += id.charCodeAt(i);
  return colors[hash % colors.length];
};

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [habits, setHabits] = useState<Habit[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newHabitTitle, setNewHabitTitle] = useState("");
  const todayStr = getTodayDateString();

  const refreshHabits = (userId: string) => {
    setHabits(getUserHabits(userId));
  };

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser) {
      router.push("/login");
      return;
    }
    setUser(currentUser);
    refreshHabits(currentUser.id);
    setLoading(false);
  }, [router]);

  const handleLogout = () => {
    clearCurrentUser();
    router.push("/");
  };

  const handleAddHabit = (e: FormEvent) => {
    e.preventDefault();
    if (!newHabitTitle.trim() || !user) return;
    addHabit(user.id, newHabitTitle.trim());
    setNewHabitTitle("");
    setShowAddModal(false);
    refreshHabits(user.id);
  };

  const handleDeleteHabit = (habitId: string) => {
    if (!user) return;
    deleteHabit(habitId);
    refreshHabits(user.id);
  };

  const handleToggleHabit = (habitId: string) => {
    if (!user) return;
    toggleHabitCompletion(habitId, todayStr);
    setHabits([...habits]); 
  };

  if (loading || !user) {
    return (
      <div className="flex-grow flex items-center justify-center bg-zinc-950">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-emerald-500"></div>
      </div>
    );
  }

  // Formatting dates for the header
  const todayDate = new Date();
  const greeting = todayDate.getHours() < 12 ? "Morning" : "Afternoon";
  const dateOptions: Intl.DateTimeFormatOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
  const formattedDate = todayDate.toLocaleDateString('en-US', dateOptions);

  // Generate 7 days for the calendar strip
  const calendarDays = [];
  for (let i = -3; i <= 3; i++) {
    const d = new Date(todayDate);
    d.setDate(todayDate.getDate() + i);
    calendarDays.push({
      dayName: d.toLocaleDateString('en-US', { weekday: 'short' }),
      dateNum: d.getDate(),
      isToday: i === 0
    });
  }

  return (
    <main className="flex-grow bg-zinc-950 text-zinc-100 p-4 pt-16 md:p-8 md:pt-16 min-h-screen relative pb-24">
      <div className="max-w-xl mx-auto">
        
        {/* Header Section */}
        <header className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight">{greeting}, {user.name.split(" ")[0]}</h1>
            <p className="text-zinc-400 text-sm mt-1">{formattedDate}</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={handleLogout} className="text-zinc-500 hover:text-red-400 transition-colors" title="Logout">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
            </button>
            <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center border-2 border-zinc-700 overflow-hidden">
              <span className="text-lg font-bold text-emerald-400">{user.name.charAt(0).toUpperCase()}</span>
            </div>
          </div>
        </header>

        {/* Calendar Strip */}
        <div className="flex justify-between items-center mb-8 px-2">
          {calendarDays.map((day, idx) => (
            <div key={idx} className="flex flex-col items-center gap-2">
              <span className="text-xs text-zinc-500 font-medium">{day.dayName}</span>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium ${
                day.isToday ? "bg-emerald-500 text-zinc-950" : "bg-zinc-900 text-zinc-300"
              }`}>
                {day.dateNum}
              </div>
            </div>
          ))}
        </div>

        {/* Bento Reminder Card */}
        <div className="bg-emerald-900/30 border border-emerald-500/20 rounded-[2rem] p-6 mb-10 flex relative overflow-hidden">
          <div className="w-2/3 relative z-10">
            <h2 className="text-xl font-semibold text-emerald-100 mb-2">Set the reminder</h2>
            <p className="text-sm text-emerald-200/70 mb-4 leading-relaxed">
              Never miss your routine! Set a reminder to stay on track
            </p>
            <button className="bg-emerald-950 hover:bg-emerald-900 text-emerald-400 font-medium px-6 py-2 rounded-full text-sm transition-colors border border-emerald-500/30">
              Set Now
            </button>
          </div>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-emerald-500 opacity-80 scale-125">
            <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"></path>
              <path d="M13.73 21a2 2 0 0 1-3.46 0"></path>
            </svg>
          </div>
        </div>

        {/* Daily Routine Section */}
        <div className="mb-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold">Daily routine</h2>
          <span className="text-sm text-zinc-500 cursor-pointer hover:text-emerald-400">See all</span>
        </div>

        <div className="relative">
          {/* Vertical dashed timeline */}
          <div className="absolute left-[1.125rem] top-6 bottom-6 border-l-2 border-dashed border-zinc-800 z-0"></div>

          <div className="space-y-4">
            {habits.length === 0 ? (
              <div className="text-center py-10 bg-zinc-900/50 rounded-3xl border border-zinc-800/50 relative z-10 ml-12">
                <p className="text-zinc-500 text-sm">No habits yet. Click + to add one.</p>
              </div>
            ) : (
              habits.map((habit) => {
                const isCompleted = isHabitCompletedToday(habit.id, todayStr);
                const streak = calculateStreak(habit.id);
                const iconColor = getIconColor(habit.id);

                return (
                  <div key={habit.id} className="flex items-center gap-4 relative z-10 group">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleHabit(habit.id)}
                      className={`w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center transition-all bg-zinc-950 border-2 ${
                        isCompleted
                          ? "bg-emerald-500 border-emerald-500 text-zinc-950"
                          : "border-zinc-700 hover:border-emerald-500 text-transparent"
                      }`}
                    >
                      {isCompleted && (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-zinc-950" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>

                    {/* Habit Card */}
                    <div className="bg-zinc-900 rounded-[1.5rem] p-3 flex-grow flex items-center justify-between border border-zinc-800/80 shadow-sm transition-all hover:border-zinc-700">
                      <div className="flex items-center gap-4 pl-1">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${iconColor}`}>
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
                          </svg>
                        </div>
                        <div>
                          <h3 className={`font-medium ${isCompleted ? 'text-zinc-500 line-through' : 'text-zinc-100'}`}>
                            {habit.title}
                          </h3>
                          <p className="text-xs text-zinc-500 mt-0.5">Streak {streak} days</p>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className="h-10 border-l border-zinc-800 mx-4"></div>
                        <div className="flex flex-col items-center justify-center text-zinc-500 min-w-[3rem]">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mb-1">
                            <circle cx="12" cy="12" r="10"></circle>
                            <polyline points="12 6 12 12 16 14"></polyline>
                          </svg>
                          <span className="text-[10px] uppercase font-medium">5 min</span>
                        </div>
                        
                        {/* Delete Button (visible on hover) */}
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDeleteHabit(habit.id); }}
                          className="ml-2 text-zinc-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <line x1="18" y1="6" x2="6" y2="18"></line>
                            <line x1="6" y1="6" x2="18" y2="18"></line>
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => setShowAddModal(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-emerald-600 hover:bg-emerald-500 text-zinc-950 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgba(16,185,129,0.3)] transition-transform hover:scale-105 z-50"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>

        {/* Add Habit Modal */}
        {showAddModal && (
          <AddHabitModal
            onClose={() => setShowAddModal(false)}
            onSave={(title) => {
              if (!title.trim() || !user) return;
              addHabit(user.id, title.trim());
              setShowAddModal(false);
              refreshHabits(user.id);
            }}
          />
        )}
      </div>
    </main>
  );
}

function AddHabitModal({ onClose, onSave }: { onClose: () => void; onSave: (title: string) => void }) {
  const [title, setTitle] = useState("");
  const [goalChecked, setGoalChecked] = useState(false);
  const [goalDate, setGoalDate] = useState("");
  const [goalAmount, setGoalAmount] = useState("");
  const [repeatChecked, setRepeatChecked] = useState(false);
  const [selectedDays, setSelectedDays] = useState<number[]>([3]); // 3 = Thursday (0-indexed M-S)
  const [taskTime, setTaskTime] = useState("");
  const [remindersEnabled, setRemindersEnabled] = useState(true);

  const days = ["M", "T", "W", "T", "F", "S", "S"];

  const toggleDay = (index: number) => {
    if (selectedDays.includes(index)) {
      setSelectedDays(selectedDays.filter(d => d !== index));
    } else {
      setSelectedDays([...selectedDays, index]);
    }
  };

  const handleSave = () => {
    // In a full implementation, we would pass all this state to onSave.
    // For now, we ensure the UI is fully interactive before saving.
    onSave(title);
  };

  return (
    <div className="fixed inset-0 bg-zinc-950 z-50 overflow-y-auto flex flex-col p-6 animate-in slide-in-from-bottom-full duration-300">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-zinc-100">New habit</h1>
        <button 
          onClick={onClose}
          className="w-10 h-10 bg-zinc-900 border border-zinc-800 rounded-full flex items-center justify-center text-zinc-300 hover:text-zinc-100 transition-colors"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
          </svg>
        </button>
      </div>

      {/* Illustration */}
      <div className="flex justify-center mb-10">
        <div className="w-48 h-48 relative flex items-center justify-center">
          {/* Decorative squiggles */}
          <svg className="absolute top-4 left-4 w-8 h-8 text-orange-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 12v-2a2 2 0 0 1 2-2h0a2 2 0 0 0 2-2V4" />
          </svg>
          <svg className="absolute top-4 right-4 w-8 h-8 text-pink-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 4L12 8M8 12L4 12" />
          </svg>
          {/* Main Calendar Icon */}
          <div className="w-32 h-32 bg-emerald-500 rounded-3xl border-4 border-zinc-950 shadow-[0_0_0_4px_rgba(16,185,129,1)] flex flex-col items-center pt-6 pb-4 px-4">
            <div className="flex gap-2 mb-2 w-full justify-between px-1">
              <div className="w-4 h-6 border-4 border-zinc-950 rounded-full bg-zinc-100 -mt-10"></div>
              <div className="w-4 h-6 border-4 border-zinc-950 rounded-full bg-zinc-100 -mt-10"></div>
            </div>
            <div className="bg-zinc-100 w-full flex-grow rounded-xl border-4 border-zinc-950 grid grid-cols-4 grid-rows-2 gap-1 p-1">
              {[...Array(8)].map((_, i) => (
                <div key={i} className={`border-2 border-zinc-950 rounded-sm ${i === 6 ? 'bg-emerald-400' : 'bg-transparent'}`}></div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Form Fields */}
      <div className="space-y-8 flex-grow max-w-md mx-auto w-full">
        {/* Name */}
        <div>
          <label className="block text-zinc-400 text-sm mb-2">Name your habit</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Morning Meditations"
            className="w-full bg-zinc-900 border border-zinc-800 text-zinc-100 px-5 py-4 rounded-2xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50"
            autoFocus
          />
        </div>

        {/* Goal */}
        <div className={`transition-opacity ${!goalChecked ? 'opacity-50' : 'opacity-100'}`}>
          <div className="flex justify-between items-center mb-2 cursor-pointer" onClick={() => setGoalChecked(!goalChecked)}>
            <label className="text-zinc-400 text-sm cursor-pointer pointer-events-none">Set a goal</label>
            <div 
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${goalChecked ? 'bg-emerald-500 border-emerald-500 text-zinc-950' : 'border-zinc-600'}`}
            >
              {goalChecked && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
            </div>
          </div>
          <div className="flex gap-4">
            <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 flex justify-between items-center relative overflow-hidden focus-within:ring-2 focus-within:ring-emerald-500/50">
              <input 
                type="date" 
                value={goalDate}
                onChange={(e) => setGoalDate(e.target.value)}
                disabled={!goalChecked}
                className="bg-transparent text-zinc-100 focus:outline-none w-full disabled:cursor-not-allowed appearance-none [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:right-0 [&::-webkit-calendar-picker-indicator]:w-full"
              />
              {!goalDate && <span className="absolute left-5 text-zinc-500 pointer-events-none">Add date</span>}
              <svg className="w-5 h-5 text-zinc-500 pointer-events-none absolute right-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect><line x1="16" y1="2" x2="16" y2="6"></line><line x1="8" y1="2" x2="8" y2="6"></line><line x1="3" y1="10" x2="21" y2="10"></line></svg>
            </div>
            <div className="flex-1 bg-zinc-900 border border-zinc-800 rounded-2xl px-5 py-4 flex justify-between items-center focus-within:ring-2 focus-within:ring-emerald-500/50 relative">
              <input 
                type="number" 
                placeholder="Add amount"
                value={goalAmount}
                onChange={(e) => setGoalAmount(e.target.value)}
                disabled={!goalChecked}
                className="bg-transparent text-zinc-100 placeholder-zinc-500 focus:outline-none w-full disabled:cursor-not-allowed"
              />
              <svg className="w-5 h-5 text-zinc-500 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>

        {/* Repeat Days */}
        <div className={`transition-opacity ${!repeatChecked ? 'opacity-50' : 'opacity-100'}`}>
          <div className="flex justify-between items-center mb-4 cursor-pointer" onClick={() => setRepeatChecked(!repeatChecked)}>
            <label className="text-zinc-400 text-sm cursor-pointer pointer-events-none">Repeat days</label>
            <div 
              className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${repeatChecked ? 'bg-emerald-500 border-emerald-500 text-zinc-950' : 'border-zinc-600'}`}
            >
              {repeatChecked && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>}
            </div>
          </div>
          <div className="flex justify-between">
            {days.map((day, i) => {
              const isSelected = selectedDays.includes(i);
              return (
                <button 
                  key={i}
                  disabled={!repeatChecked}
                  onClick={() => toggleDay(i)}
                  className={`w-11 h-11 rounded-full flex items-center justify-center font-medium transition-colors disabled:cursor-not-allowed ${
                    isSelected 
                      ? 'bg-zinc-800 text-zinc-100 border border-zinc-700' 
                      : 'bg-zinc-900 text-zinc-500 border border-transparent hover:border-zinc-800'
                  }`}
                >
                  {day}
                </button>
              );
            })}
          </div>
        </div>

        {/* Time Selection */}
        <div className="flex justify-between items-center">
          <label className="text-zinc-400 text-sm">Set time</label>
          <div className="relative">
            <input 
              type="time" 
              value={taskTime}
              onChange={(e) => setTaskTime(e.target.value)}
              className="bg-zinc-900 border border-zinc-800 text-zinc-100 px-4 py-2 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500/50 appearance-none [&::-webkit-calendar-picker-indicator]:invert-[0.8]"
            />
          </div>
        </div>

        {/* Reminders */}
        <div className="flex justify-between items-center cursor-pointer" onClick={() => setRemindersEnabled(!remindersEnabled)}>
          <label className="text-zinc-400 text-sm pointer-events-none">Get reminders</label>
          <div 
            className={`w-12 h-7 rounded-full p-1 transition-colors flex ${remindersEnabled ? 'bg-orange-500 justify-end' : 'bg-zinc-800 justify-start'}`}
          >
            <div className="w-5 h-5 bg-white rounded-full shadow-sm"></div>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="mt-auto pt-6 max-w-md mx-auto w-full">
        <button
          onClick={handleSave}
          disabled={!title.trim()}
          className="w-full py-4 rounded-full bg-orange-500 text-zinc-50 font-bold text-lg hover:bg-orange-400 disabled:opacity-50 disabled:hover:bg-orange-500 transition-colors shadow-lg shadow-orange-500/20"
        >
          Save Habit
        </button>
      </div>
    </div>
  );
}
