import json
import os
import requests
from bs4 import BeautifulSoup
from datetime import datetime
from google.oauth2 import service_account
from googleapiclient.discovery import build

def get_ogp(url):

    try:

        r = requests.get(url,timeout=5)

        soup = BeautifulSoup(r.text,"html.parser")

        tag = soup.find("meta",property="og:image")

        if tag:
            return tag["content"]

    except:
        pass

    return ""

info = json.loads(os.environ["GCP_KEY"])

creds = service_account.Credentials.from_service_account_info(
 info,
 scopes=["https://www.googleapis.com/auth/spreadsheets.readonly"]
)

service = build("sheets","v4",credentials=creds)

SPREADSHEET_ID = "1DVbCRhxizfF4FtQ0z093XfsCwXagt5qCsZwtdkramg4"

result = service.spreadsheets().values().get(
 spreadsheetId=SPREADSHEET_ID,
 range="calendar_db!A:G"
).execute()

rows = result.get("values",[])[1:]

today = datetime.today()

data=[]

for r in rows:

    if len(r)<7:
        continue

    date_str=r[0]

    try:

        date=datetime.strptime(date_str,"%Y/%m/%d")

    except:
        continue

    # 今日以降は表示しない
    if date>today:
        continue

    url=r[6]

    image=""

    if url:
        image=get_ogp(url)

    data.append({

        "date":r[0],
        "title":r[1],
        "author":r[2],
        "type":r[3],
        "status":r[4],
        "key":r[5],
        "url":url,
        "image":image

    })

os.makedirs("data",exist_ok=True)

with open("data/calendar.json","w",encoding="utf-8") as f:

    json.dump(data,f,ensure_ascii=False,indent=2)

print("calendar.json updated")
