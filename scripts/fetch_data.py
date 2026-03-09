from google.oauth2 import service_account
from googleapiclient.discovery import build
import json

SCOPES=["https://www.googleapis.com/auth/spreadsheets.readonly"]

creds=service_account.Credentials.from_service_account_file(
"service-account.json",
scopes=SCOPES
)

service=build("sheets","v4",credentials=creds)

SHEET_ID="1DVbCRhxizfF4FtQ0z093XfsCwXagt5qCsZwtdkramg4"

res=service.spreadsheets().values().get(
spreadsheetId=SHEET_ID,
range="api!A:F"
).execute()

rows=res.get("values",[])[1:]

data=[]

for r in rows:
data.append({
"date":r[0],
"day":r[1],
"title":r[2],
"author":r[3],
"type":r[4],
"url":r[5]
})

with open("../data/calendar.json","w",encoding="utf8") as f:
json.dump(data,f,ensure_ascii=False,indent=2)
