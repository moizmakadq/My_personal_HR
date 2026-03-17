import { addMinutes, formatISO, parse, set } from "date-fns";
import { uid } from "@/lib/utils";

const buildSlotBounds = (driveDate, time) => {
  const base = new Date(driveDate);
  const parsed = parse(time || "10:00", "HH:mm", base);
  return set(base, {
    hours: parsed.getHours(),
    minutes: parsed.getMinutes(),
    seconds: 0,
    milliseconds: 0
  });
};

export const generateInterviewSchedule = ({
  drive,
  shortlistedApplications = [],
  standbyApplications = [],
  date = drive.drive_date,
  interviewers = []
}) => {
  const numPanels = Number(drive.num_panels || 1);
  const duration = Number(drive.interview_duration || 20);
  const buffer = Number(drive.buffer_minutes || 5);
  const breakAfter = Number(drive.break_after_count || 4);
  const breakDuration = Number(drive.break_duration || 15);
  const startAt = buildSlotBounds(date, drive.interview_start_time || "10:00");
  const panels = Array.from({ length: numPanels }, (_, index) => ({
    panelNumber: index + 1,
    interviewer: interviewers[index] || null,
    cursor: startAt,
    count: 0
  }));

  const createSlot = (application, panel, slotNumber, isStandby = false, standbyPriority = null) => {
    const start_time = panel.cursor;
    const end_time = addMinutes(start_time, duration);
    panel.cursor = addMinutes(end_time, buffer);
    panel.count += 1;
    if (panel.count % breakAfter === 0) {
      panel.cursor = addMinutes(panel.cursor, breakDuration);
    }

    return {
      id: uid("slot"),
      drive_id: drive.id,
      application_id: application.id,
      student_id: application.student_id,
      panel_number: panel.panelNumber,
      slot_number: slotNumber,
      room: (drive.rooms || [])[panel.panelNumber - 1] || `Room ${panel.panelNumber}`,
      start_time: formatISO(start_time),
      end_time: formatISO(end_time),
      status: "scheduled",
      is_standby: isStandby,
      standby_priority: standbyPriority
    };
  };

  const slots = [];
  shortlistedApplications.forEach((application, index) => {
    const panel = panels[index % panels.length];
    slots.push(createSlot(application, panel, index + 1));
  });

  standbyApplications.slice(0, 3).forEach((application, index) => {
    const panel = panels[index % panels.length];
    slots.push(createSlot(application, panel, shortlistedApplications.length + index + 1, true, index + 1));
  });

  return slots;
};
