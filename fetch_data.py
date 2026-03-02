import os
import json
import requests
from datetime import datetime

BASE_URL = os.environ["JIRA_BASE_URL"].rstrip("/")
EMAIL = os.environ["JIRA_EMAIL"]
API_TOKEN = os.environ["JIRA_API_TOKEN"]

# Jira のカスタムフィールドID（ここはあなたの環境で確定している前提）
ARTICLE_URL_FIELD = "customfield_11788"   # 記事URL
PUBLISHED_DATE_FIELD = "customfield_11820"  # 記事公開日

JQL = """
project = TECHBLOG
AND issuetype = "記事執筆"
AND status = 公開
AND {url} IS NOT EMPTY
AND {date} IS NOT EMPTY
ORDER BY {date} ASC
""".format(url=ARTICLE_URL_FIELD, date=PUBLISHED_DATE_FIELD)

res = requests.post(
    f"{BASE_URL}/rest/api/3/search/jql",
    auth=(EMAIL, API_TOKEN),
    headers={"Accept": "application/json"},
    json={
        "jql": JQL,
        "fields": [
            "summary",
            "assignee",
            ARTICLE_URL_FIELD,
            PUBLISHED_DATE_FIELD
        ],
        "maxResults": 100
    }
)

# 失敗しても理由が分かるように
if res.status_code != 200:
    print("Status:", res.status_code)
    print(res.text)
    res.raise_for_status()

issues = res.json()["issues"]

items = []
for issue in issues:
    fields = issue["fields"]

    items.append({
        "title": fields["summary"],
        "url": fields[ARTICLE_URL_FIELD],
        "author": fields["assignee"]["displayName"] if fields["assignee"] else "",
        "date": fields[PUBLISHED_DATE_FIELD]
    })

with open("data.json", "w", encoding="utf-8") as f:
    json.dump(items, f, ensure_ascii=False, indent=2)

print(f"Generated data.json ({len(items)} items)")
