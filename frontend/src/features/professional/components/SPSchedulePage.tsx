import { useState, useEffect } from 'react';
import { Calendar as CalendarIcon, Clock, Plus, Trash2, Save, AlertCircle, CheckCircle2, ChevronLeft } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@shared/ui/card';
import { Input } from '@shared/ui/input';
import { Badge } from '@shared/ui/badge';
import { Alert, AlertDescription } from '@shared/ui/alert';
import {
  getAvailability,
  updateAvailability,
  blockDates,
  type SPAvailability
} from '@professional/services/spJobService';

interface SPSchedulePageProps {
  onBack: () => void;
}

const DAYS_OF_WEEK = [
  'Sunday',
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday'
];

export const SPSchedulePage = ({ onBack }: SPSchedulePageProps) => {
  const [availability, setAvailability] = useState<SPAvailability[]>([]);
  const [blockedDays, setBlockedDays] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newBlockedDate, setNewBlockedDate] = useState('');

  // Mock SP ID
  const spId = 'SP001';

  useEffect(() => {
    const loadData = async () => {
      setLoading(false);
      try {
        const schedule = await getAvailability(spId);
        // Ensure all 7 days are represented in state
        const fullSchedule = Array.from({ length: 7 }, (_, dayIndex) => {
          const existing = schedule.find(s => s.dayOfWeek === dayIndex);
          if (existing) return existing;
          return {
            id: `day-${dayIndex}`,
            spId,
            dayOfWeek: dayIndex,
            startTime: '09:00',
            endTime: '18:00',
            isBlocked: dayIndex === 0 || dayIndex === 6 // Block weekends by default if not set
          };
        });
        setAvailability(fullSchedule);

        // Load mock blocked dates from localStorage or default
        const savedBlocked = localStorage.getItem(`sp_blocked_dates_${spId}`);
        if (savedBlocked) {
          setBlockedDays(JSON.parse(savedBlocked));
        } else {
          // Default mock blocked date: next Tuesday
          const nextTuesday = new Date();
          nextTuesday.setDate(nextTuesday.getDate() + ((2 + 7 - nextTuesday.getDay()) % 7 || 7));
          const dateStr = nextTuesday.toISOString().split('T')[0];
          setBlockedDays([dateStr]);
        }
      } catch (err) {
        console.error('Failed to load schedule:', err);
        setError('Failed to load availability settings.');
      }
    };
    loadData();
  }, []);

  const handleToggleDay = (dayIndex: number) => {
    setAvailability(prev =>
      prev.map(item =>
        item.dayOfWeek === dayIndex
          ? { ...item, isBlocked: !item.isBlocked }
          : item
      )
    );
  };

  const handleTimeChange = (dayIndex: number, field: 'startTime' | 'endTime', value: string) => {
    setAvailability(prev =>
      prev.map(item =>
        item.dayOfWeek === dayIndex
          ? { ...item, [field]: value }
          : item
      )
    );
  };

  const handleAddBlockedDate = () => {
    if (!newBlockedDate) return;
    if (blockedDays.includes(newBlockedDate)) {
      setError('Date is already blocked.');
      return;
    }

    const updated = [...blockedDays, newBlockedDate].sort();
    setBlockedDays(updated);
    localStorage.setItem(`sp_blocked_dates_${spId}`, JSON.stringify(updated));
    setNewBlockedDate('');
    setError('');
    setSuccess('Blocked date added successfully!');
    setTimeout(() => setSuccess(''), 3000);
  };

  const handleRemoveBlockedDate = (dateToRemove: string) => {
    const updated = blockedDays.filter(d => d !== dateToRemove);
    setBlockedDays(updated);
    localStorage.setItem(`sp_blocked_dates_${spId}`, JSON.stringify(updated));
    setSuccess('Blocked date removed.');
    setTimeout(() => setSuccess(''), 2000);
  };

  const handleSaveSchedule = async () => {
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const scheduleResult = await updateAvailability(spId, availability);
      const blockedResult = await blockDates(spId, blockedDays);

      if (scheduleResult.success && blockedResult.success) {
        setSuccess('Availability settings saved successfully!');
        // Mock save weekly availability to localStorage for persistence in session
        localStorage.setItem(`sp_availability_${spId}`, JSON.stringify(availability));
      } else {
        setError('Failed to save settings.');
      }
    } catch (err) {
      setError('An error occurred while saving.');
    } finally {
      setLoading(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (loading && availability.length === 0) {
    return (
      <div className="min-h-screen bg-[color:var(--color-background)] p-4 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#2563EB] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[color:var(--color-text-secondary)] text-sm font-semibold">Loading schedule...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[color:var(--color-background)] pb-24">
      {/* Header */}
      <div className="bg-[color:var(--color-surface)] border-b border-[color:var(--color-border)] sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center gap-3">
          <Button onClick={onBack} variant="ghost" size="icon" className="rounded-full">
            <ChevronLeft className="w-6 h-6" />
          </Button>
          <div>
            <h1 className="text-xl font-black text-gray-900 flex items-center gap-2">
              <CalendarIcon className="w-5 h-5 text-[#2563EB]" />
              Availability Manager
            </h1>
            <p className="text-xs text-[color:var(--color-text-secondary)] font-medium">
              Configure your service hours and block vacation days
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-6 space-y-6">
        {error && (
          <Alert variant="destructive" className="rounded-2xl border-red-200">
            <AlertCircle className="w-4 h-4" />
            <AlertDescription className="font-semibold">{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert className="rounded-2xl border-green-200 bg-green-50 text-green-800">
            <CheckCircle2 className="w-4 h-4 text-green-600" />
            <AlertDescription className="font-semibold">{success}</AlertDescription>
          </Alert>
        )}

        {/* Weekly Hours Card */}
        <Card className="rounded-3xl shadow-md border-gray-100/80 overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-gray-100">
            <CardTitle className="text-base font-black flex items-center gap-2 text-gray-900">
              <Clock className="w-4 h-4 text-[#2563EB]" />
              Weekly Service Hours
            </CardTitle>
            <CardDescription className="text-xs font-semibold">
              Set the time slots you are active on the platform each day.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-4 sm:p-6 divide-y divide-gray-100">
            {availability.map((day) => {
              const dayName = DAYS_OF_WEEK[day.dayOfWeek];
              return (
                <div key={day.id} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    {/* iOS style toggle checkbox */}
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={!day.isBlocked}
                        onChange={() => handleToggleDay(day.dayOfWeek)}
                        className="sr-only peer"
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
                      <span className="ml-3 text-sm font-bold text-gray-900 w-24">
                        {dayName}
                      </span>
                    </label>
                    <Badge variant={day.isBlocked ? 'secondary' : 'default'} className="rounded-lg text-[10px] uppercase font-black tracking-wider">
                      {day.isBlocked ? 'Inactive' : 'Active'}
                    </Badge>
                  </div>

                  {!day.isBlocked ? (
                    <div className="flex items-center gap-2 pl-14 sm:pl-0">
                      <input
                        type="time"
                        value={day.startTime}
                        onChange={(e) => handleTimeChange(day.dayOfWeek, 'startTime', e.target.value)}
                        className="border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                      <span className="text-xs text-gray-400 font-semibold">to</span>
                      <input
                        type="time"
                        value={day.endTime}
                        onChange={(e) => handleTimeChange(day.dayOfWeek, 'endTime', e.target.value)}
                        className="border border-gray-200 rounded-xl px-2.5 py-1.5 text-xs font-bold bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                      />
                    </div>
                  ) : (
                    <span className="text-xs text-gray-400 font-semibold italic pl-14 sm:pl-0">
                      Not accepting bookings on this day.
                    </span>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>

        {/* Block Specific Dates Card */}
        <Card className="rounded-3xl shadow-md border-gray-100/80 overflow-hidden">
          <CardHeader className="bg-slate-50/50 border-b border-gray-100">
            <CardTitle className="text-base font-black flex items-center gap-2 text-gray-900">
              <CalendarIcon className="w-4 h-4 text-red-500" />
              Block Specific Dates
            </CardTitle>
            <CardDescription className="text-xs font-semibold">
              Block individual dates for leaves or emergencies. Clients won't be able to book your slots on these days.
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6 space-y-4">
            <div className="flex gap-2">
              <Input
                type="date"
                value={newBlockedDate}
                onChange={(e) => setNewBlockedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="rounded-xl font-semibold border-gray-200 text-gray-900 focus:ring-blue-500/20 focus:border-blue-500"
              />
              <Button onClick={handleAddBlockedDate} className="bg-slate-900 hover:bg-slate-800 text-white rounded-xl px-4 font-bold flex items-center gap-1">
                <Plus className="w-4 h-4" /> Block
              </Button>
            </div>

            {/* List of blocked dates */}
            <div className="space-y-2 pt-2">
              <p className="text-xs font-black text-gray-400 uppercase tracking-wider">Blocked Vacation Days</p>
              {blockedDays.length === 0 ? (
                <p className="text-xs text-gray-400 italic">No dates blocked currently.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {blockedDays.map((dateStr) => {
                    const formatted = new Intl.DateTimeFormat('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                      weekday: 'short'
                    }).format(new Date(dateStr));
                    return (
                      <Badge key={dateStr} variant="destructive" className="bg-red-50 hover:bg-red-100 text-red-700 border border-red-100/80 py-1.5 px-3 rounded-2xl flex items-center gap-1.5 font-bold transition-all text-xs">
                        <span>{formatted}</span>
                        <button
                          onClick={() => handleRemoveBlockedDate(dateStr)}
                          className="hover:bg-red-200 text-red-500 hover:text-red-700 rounded-full p-0.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </Badge>
                    );
                  })}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Action Button */}
        <Button
          onClick={handleSaveSchedule}
          className="w-full bg-[#2563EB] hover:bg-blue-700 text-white py-4 rounded-2xl font-black flex items-center justify-center gap-2 shadow-lg shadow-blue-500/10 active:scale-98 transition-all"
        >
          <Save className="w-5 h-5" />
          Save Schedule Configuration
        </Button>
      </div>
    </div>
  );
};
