# fetch_data.py
import json
import os
from google.oauth2 import service_account
from googleapiclient.discovery import build

# ===== 環境変数 =====
SPREADSHEET_ID = os.environ["SPREADSHEET_ID"]
SHEET_NAME = os.environ.get("SHEET_NAME", "シート1")

# ===== 列番号（0始まり）=====
IDX_DATE   = 0   # A列：日付
IDX_TITLE  = 2   # C列：タイトル
IDX_NAME   = 4   # E列：名前
IDX_STATUS = 10  # K列：ステータス（公開 / 下書きなど）
IDX_URL    = 10  # K列：記事URL（空でもOK）

PUBLISHED_STATUS = "公開"

def main():
    creds_info = json.loads(os.environ["GCP_SERVICE_ACCOUNT_KEY"])
    creds = service_account.Credentials.from_service_account_info(
        creds_info,
        scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"]
    )

    service = build("sheets", "v4", credentials=creds)

    result = service.spreadsheets().values().get(
        spreadsheetId=SPREADSHEET_ID,
        range=f"{SHEET_NAME}!A:Z"
    ).execute()

    rows = result.get("values", [])
    posts = []

    # 1行目はヘッダ想定
    for row in rows[1:]:
        if len(row) <= IDX_STATUS:
            continue

        status = row[IDX_STATUS].strip() if len(row) > IDX_STATUS else ""
        if status != PUBLISHED_STATUS:
            continue

        date  = row[IDX_DATE]  if len(row) > IDX_DATE  else ""
        title = row[IDX_TITLE] if len(row) > IDX_TITLE else ""
        name  = row[IDX_NAME]  if len(row) > IDX_NAME  else ""
        url   = row[IDX_URL]   if len(row) > IDX_URL   else ""

        if not date or not title:
            continue

        posts.append({
            "date": date,
            "title": title,
            "name": name,
            "url": url
        })

    with open("data.json", "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)

    print(f"OK: data.json updated ({len(posts)} items)")

if __name__ == "__main__":
    main()
