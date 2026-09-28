import datetime

start_date = datetime.date(2026, 8, 29)
end_date = datetime.date(2026, 11, 29)
today = datetime.date(2026, 9, 28)

cur = start_date
day_counts = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0} # 0=Mon, ..., 6=Sun
past_counts = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}
rem_counts = {0: 0, 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0}

while cur <= end_date:
    wd = cur.weekday()
    day_counts[wd] += 1
    if cur < today:
        past_counts[wd] += 1
    else:
        rem_counts[wd] += 1
    cur += datetime.timedelta(days=1)

days_name = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
print("Total Semester Days:")
for i in range(7):
    print(f"  {days_name[i]}: Total={day_counts[i]}, Past(before Sept 28)={past_counts[i]}, Rem(from Sept 28)={rem_counts[i]}")
