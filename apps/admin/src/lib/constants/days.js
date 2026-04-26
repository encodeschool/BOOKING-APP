export const DAYS = [
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
];

export const EMPTY_HOURS = DAYS.reduce((acc, day) => {
  acc[day] = {
    dayOfWeek: day,
    startTime: "09:00",
    endTime: "18:00",
    isClosed: false,
  };
  return acc;
}, {});