import json, os, re, ast
from google.oauth2 import service_account
from googleapiclient.discovery import build

SPREADSHEET_ID = "あなたのスプシID"
COLUMN_RANGE = "M:M"  # JSON列

def main():
    info = json.loads(os.environ["GCP_KEY"])
    creds = service_account.Credentials.from_service_account_info(
        info,
        scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"]
    )

    service = build("sheets", "v4", credentials=creds)

    meta = service.spreadsheets().get(
        spreadsheetId=SPREADSHEET_ID
    ).execute()

    sheet_name = meta["sheets"][0]["properties"]["title"]

    res = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range=f"{sheet_name}!{COLUMN_RANGE}"
    ).execute()

    values = res.get("values", [])

    data = []

    for row in values:
        if not row:
            continue

        raw = row[0]
        try:
            item = ast.literal_eval(raw)
        except Exception:
            continue

        # 最低限の安全チェック
        if (
            item.get("date")
            and item.get("title")
            and isinstance(item.get("url"), str)
        ):
            data.append(item)

    with open("data.json", "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)

    print(f"OK: {len(data)} items written")

if __name__ == "__main__":
    main()
