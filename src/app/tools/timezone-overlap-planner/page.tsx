"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type TimezoneOption = {
  value: string;
  label: string;
};

const timezoneOptions: TimezoneOption[] = [
  { value: "UTC", label: "UTC" },
  { value: "Asia/Dhaka", label: "Dhaka (GMT+6)" },
  { value: "Asia/Dubai", label: "Dubai (GMT+4)" },
  { value: "Europe/London", label: "London" },
  { value: "Europe/Berlin", label: "Berlin" },
  { value: "America/New_York", label: "New York" },
  { value: "America/Chicago", label: "Chicago" },
  { value: "America/Los_Angeles", label: "Los Angeles" },
  { value: "Asia/Kolkata", label: "Kolkata" },
  { value: "Asia/Singapore", label: "Singapore" },
  { value: "Asia/Tokyo", label: "Tokyo" },
  { value: "Australia/Sydney", label: "Sydney" },
];

function getHourInTimezone(timezone: string, utcDate: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    hour12: false,
  }).formatToParts(utcDate);

  const hourPart = parts.find((part) => part.type === "hour")?.value ?? "0";
  return Number(hourPart);
}

function formatHour(hour: number) {
  const suffix = hour >= 12 ? "PM" : "AM";
  const normalized = hour % 12 === 0 ? 12 : hour % 12;
  return `${normalized}:00 ${suffix}`;
}

export default function TimezoneOverlapPlannerPage() {
  const [timezoneA, setTimezoneA] = useState("Asia/Dhaka");
  const [timezoneB, setTimezoneB] = useState("America/New_York");
  const [startHourA, setStartHourA] = useState(9);
  const [endHourA, setEndHourA] = useState(18);
  const [startHourB, setStartHourB] = useState(9);
  const [endHourB, setEndHourB] = useState(18);

  const overlap = useMemo(() => {
    const slots: {
      utcHour: number;
      hourA: number;
      hourB: number;
      quality: "Great" | "Okay";
    }[] = [];

    for (let utcHour = 0; utcHour < 24; utcHour += 1) {
      const base = new Date(Date.UTC(2026, 0, 1, utcHour, 0, 0));
      const hourA = getHourInTimezone(timezoneA, base);
      const hourB = getHourInTimezone(timezoneB, base);

      const inA = hourA >= startHourA && hourA < endHourA;
      const inB = hourB >= startHourB && hourB < endHourB;

      if (inA && inB) {
        const quality =
          hourA >= startHourA + 1 && hourA <= endHourA - 2 && hourB >= startHourB + 1 && hourB <= endHourB - 2
            ? "Great"
            : "Okay";

        slots.push({ utcHour, hourA, hourB, quality });
      }
    }

    return slots;
  }, [timezoneA, timezoneB, startHourA, endHourA, startHourB, endHourB]);

  return (
    <main className="min-h-screen bg-[#f8fafc] px-5 py-10 text-[#0f172a] md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-[#64748b]">Tools Challenge • Day 2</p>
            <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-4xl">Timezone Overlap Planner</h1>
            <p className="mt-3 max-w-2xl text-sm text-[#475569] md:text-base">
              Remote teams are global. This gives you instant overlap windows between two work schedules so you can
              book meetings without back-and-forth.
            </p>
          </div>
          <Link
            href="/tools"
            className="rounded-full border border-[#cbd5e1] bg-white px-4 py-2 text-sm font-medium hover:bg-[#f1f5f9]"
          >
            Back to Tools Hub
          </Link>
        </div>

        <section className="grid gap-5 md:grid-cols-2">
          <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 md:p-6">
            <h2 className="text-lg font-semibold">Team setup</h2>
            <p className="mt-1 text-sm text-[#64748b]">Pick timezones and preferred work windows.</p>

            <div className="mt-4 space-y-4">
              <div>
                <label className="text-sm font-medium">Person A timezone</label>
                <select
                  value={timezoneA}
                  onChange={(e) => setTimezoneA(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-sm"
                >
                  {timezoneOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Start hour</label>
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={startHourA}
                    onChange={(e) => setStartHourA(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End hour</label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={endHourA}
                    onChange={(e) => setEndHourA(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Person B timezone</label>
                <select
                  value={timezoneB}
                  onChange={(e) => setTimezoneB(e.target.value)}
                  className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-sm"
                >
                  {timezoneOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-sm font-medium">Start hour</label>
                  <input
                    type="number"
                    min={0}
                    max={23}
                    value={startHourB}
                    onChange={(e) => setStartHourB(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-sm"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">End hour</label>
                  <input
                    type="number"
                    min={1}
                    max={24}
                    value={endHourB}
                    onChange={(e) => setEndHourB(Number(e.target.value))}
                    className="mt-1 w-full rounded-xl border border-[#cbd5e1] bg-white px-3 py-2 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 md:p-6">
              <p className="text-sm text-[#64748b]">Available overlap slots</p>
              <p className="mt-1 text-4xl font-semibold tracking-tight">{overlap.length}</p>
              <p className="text-sm text-[#64748b]">hour(s) per day</p>
            </div>

            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 md:p-6">
              <h3 className="text-sm font-semibold uppercase tracking-[0.16em] text-[#475569]">Best meeting windows</h3>
              {overlap.length === 0 ? (
                <p className="mt-3 text-sm text-[#64748b]">No overlap found. Expand one person’s work window.</p>
              ) : (
                <ul className="mt-3 space-y-2 text-sm">
                  {overlap.map((slot) => (
                    <li
                      key={slot.utcHour}
                      className="flex items-center justify-between rounded-xl border border-[#e2e8f0] bg-[#fcfdff] px-3 py-2"
                    >
                      <span>
                        A: {formatHour(slot.hourA)} • B: {formatHour(slot.hourB)}
                      </span>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${
                          slot.quality === "Great" ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"
                        }`}
                      >
                        {slot.quality}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 md:p-6">
              <ul className="list-disc space-y-1 pl-5 text-sm text-[#475569]">
                <li>Use “Great” slots for high-stakes calls.</li>
                <li>Use “Okay” slots for short standups.</li>
                <li>Save this as your team’s default meeting window.</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
