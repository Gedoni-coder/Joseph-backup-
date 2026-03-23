import sqlite3

conn = sqlite3.connect("db.sqlite3")
cur = conn.cursor()

cur.execute("SELECT name FROM sqlite_master WHERE type='table' AND name LIKE '%businessmetric%'")
print("tables=", cur.fetchall())

cur.execute("SELECT COUNT(1) FROM business_forecast_businessmetric")
print("business_metrics_rows=", cur.fetchone()[0])

cur.execute("SELECT COUNT(1) FROM api_financiallineitem")
print("financial_line_items_rows=", cur.fetchone()[0])

conn.close()
