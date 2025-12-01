export default function timeFormatter(date: string | Date): string {
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  const now = new Date();
  const postDate = new Date(date);
  const diffInSeconds = (postDate.getTime() - now.getTime()) / 1000; // difference in seconds

  type Division = { amount: number; name: Intl.RelativeTimeFormatUnit };

  const divisions: Division[] = [
    { amount: 60, name: "second" },
    { amount: 60, name: "minute" },
    { amount: 24, name: "hour" },
    { amount: 7, name: "day" },
    { amount: 4.34524, name: "week" }, // approx weeks in a month
    { amount: 12, name: "month" },
    { amount: Number.POSITIVE_INFINITY, name: "year" },
  ];

  let duration = diffInSeconds;
  for (let i = 0; i < divisions.length; i++) {
    if (Math.abs(duration) < divisions[i].amount) {
      return rtf.format(Math.round(duration), divisions[i].name);
    }
    duration /= divisions[i].amount;
  }
  return "";
}
