import dayjs from "dayjs";
import localeId from "dayjs/locale/id";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import relativeTime from "dayjs/plugin/relativeTime";

// Tambahkan plugin
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(relativeTime);
// Set locale ke bahasa Indonesia
dayjs.locale(localeId);

// Set default timezone ke "Asia/Jakarta"
dayjs.tz.setDefault("Asia/Jakarta");

export default dayjs;
