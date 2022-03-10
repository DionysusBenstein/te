export function betweenDateQuery(
  column: string,
  start_time: string,
  end_time: string,
  includeAnd = false
) {
  const both = start_time && end_time;

  const and = includeAnd ? "AND " : "";

  return (
    and +
    (both
      ? `"${column}" BETWEEN '${start_time}' AND '${end_time}'`
      : start_time
      ? `time >= '${start_time}'`
      : end_time
      ? `time <= '${end_time}'`
      : "")
  );
}
