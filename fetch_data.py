import os
import json
import requests
from requests.auth import HTTPBasicAuth

BASE_URL = os.environ["JIRA_BASE_URL"].rstrip("/")
EMAIL = os.environ["JIRA_EMAIL"]
TOKEN = os.environ["JIRA_API_TOKEN"]

SEARCH_URL = f"{BASE_URL}/rest/api/3/search/jql"

JQL = """
project = TECHBLOG
AND issuetype = "記事執筆"
AND status = 公開
AND duedate IS NOT EMPTY
ORDER BY duedate ASC
"""

params = {
    "jql": JQL,
    "fields": [
        "summary",
        "assignee",
        "duedate",
        "status",
        "customfield_12345"  # ← 記事URLのカスタムフィールドID（後で確定）
    ],
    "maxResults": 100
}

res = requests.post(
    SEARCH_URL,
    auth=HTTPBasicAuth(EMAIL, TOKEN),
    headers={"Accept": "application/json"},
    json=params,
    timeout=15
)

if res.status_code != 200:
    print("Request URL:", SEARCH_URL)
    print("Status:", res.status_code)
    print(res.text)
    res.raise_for_status()

issues = res.json()["issues"]

data = []
for issue in issues:
    f = issue["fields"]
    url = f.get("customfield_12345")

    if not url:
        continue  # URLない記事は社外に出さない

    data.append({
        "date": f["duedate"],
        "title": f["summary"],
        "author": f["assignee"]["displayName"] if f["assignee"] else "",
        "url": url
    })

with open("data.json", "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)
