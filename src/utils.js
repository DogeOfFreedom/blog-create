import { DateTime } from "luxon";

const convertDate = (date) =>
  DateTime.fromJSDate(new Date(date)).toLocaleString(DateTime.DATE_MED);

const truncate = (string) => {
  const truncatedString = string.slice(0, 300).trim() + "...";
  return truncatedString;
};

export { truncate, convertDate };
