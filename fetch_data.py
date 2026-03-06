import os
import json
from google.oauth2 import service_account
from googleapiclient.discovery import build


def main():

    spreadsheet_id=os.environ["SPREADSHEET_ID"]
    sheet_name=os.environ["SHEET_NAME"]
    key=os.environ["GCP_SERVICE_ACCOUNT_KEY"]

    creds_info=json.loads(key)

    creds=service_account.Credentials.from_service_account_info(
        creds_info,
        scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"]
    )

    service=build("sheets","v4",credentials=creds)

    result=service.spreadsheets().values().get(
        spreadsheetId=spreadsheet_id,
        range=f"{sheet_name}!M2:M"
    ).execute()

    rows=result.get("values",[])

    posts=[]

    for r in rows:

        if not r:
            continue

        raw=r[0]

        try:
            obj=json.loads(raw)
        except:
            continue

        if "date" not in obj:
            continue

        if "title" not in obj:
            continue

        posts.append(obj)

    with open("data.json","w",encoding="utf-8") as f:
        json.dump(posts,f,ensure_ascii=False,indent=2)


if __name__=="__main__":
    main()
