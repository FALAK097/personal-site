import os
import sys
import json
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build

CLIENT_SECRETS = "/Users/falakgala/Documents/client_secret_405198345721-hhdnpu8kr79tek12e80h850dmo5vldli.apps.googleusercontent.com.json"
TOKEN_FILE = os.path.expanduser("~/Library/Application Support/mcp-gsc/token.json")
SCOPES = [
    "https://www.googleapis.com/auth/webmasters",
    "https://www.googleapis.com/auth/webmasters.readonly"
]

def authenticate():
    if os.path.exists(TOKEN_FILE):
        print(f"Token already exists at {TOKEN_FILE}")
        return
    print(f"Starting OAuth flow with {CLIENT_SECRETS}...")
    flow = InstalledAppFlow.from_client_secrets_file(CLIENT_SECRETS, SCOPES)
    creds = flow.run_local_server(port=0, open_browser=True)
    os.makedirs(os.path.dirname(TOKEN_FILE), exist_ok=True)
    with open(TOKEN_FILE, "w") as f:
        f.write(creds.to_json())
    print(f"Successfully authenticated and saved token to {TOKEN_FILE}")

def inspect_and_submit():
    if not os.path.exists(TOKEN_FILE):
        print(f"No token found at {TOKEN_FILE}. Run authenticate first.")
        return
    from google.oauth2.credentials import Credentials
    creds = Credentials.from_authorized_user_file(TOKEN_FILE)
    service = build("searchconsole", "v1", credentials=creds)

    print("\n--- Listing GSC Properties ---")
    sites = service.sites().list().execute()
    entries = sites.get("siteEntry", [])
    if not entries:
        print("No properties found in this Google account.")
        return

    target_site = None
    for entry in entries:
        site_url = entry.get("siteUrl")
        permission = entry.get("permissionLevel")
        print(f"Property: {site_url} ({permission})")
        if "falakgala.dev" in site_url:
            target_site = site_url

    if not target_site:
        print("\nProperty 'falakgala.dev' was not found in the verified properties list.")
        return

    print(f"\nTarget site identified: {target_site}")

    # Submit sitemap
    sitemap_url = "https://falakgala.dev/sitemap.xml"
    print(f"\n--- Submitting Sitemap {sitemap_url} ---")
    try:
        service.sitemaps().submit(siteUrl=target_site, feedpath=sitemap_url).execute()
        print(f"Sitemap successfully submitted: {sitemap_url}")
    except Exception as e:
        print(f"Error submitting sitemap: {e}")

    # Check sitemaps status
    try:
        sitemaps_list = service.sitemaps().list(siteUrl=target_site).execute()
        print("Current sitemaps:")
        for sm in sitemaps_list.get("sitemap", []):
            print(f"  - {sm.get('path')} (last submitted: {sm.get('lastSubmitted')}, errors: {sm.get('errors', 0)})")
    except Exception as e:
        print(f"Error checking sitemaps: {e}")

    # Inspect key URLs
    print("\n--- Inspecting URLs ---")
    urls_to_inspect = [
        "https://falakgala.dev/",
        "https://falakgala.dev/about",
        "https://falakgala.dev/writing",
        "https://falakgala.dev/writing/sync-obsidian-notes-with-syncthing"
    ]
    for url in urls_to_inspect:
        try:
            inspection = service.urlInspection().index().inspect(body={
                "inspectionUrl": url,
                "siteUrl": target_site
            }).execute()
            res = inspection.get("inspectionResult", {})
            idx_state = res.get("indexStatusResult", {}).get("coverageState", "Unknown")
            verdict = res.get("indexStatusResult", {}).get("verdict", "Unknown")
            print(f"URL: {url} -> Verdict: {verdict}, Coverage: {idx_state}")
        except Exception as e:
            print(f"URL: {url} -> Inspection error: {e}")

if __name__ == "__main__":
    if len(sys.argv) > 1 and sys.argv[1] == "inspect":
        inspect_and_submit()
    else:
        authenticate()
        inspect_and_submit()
