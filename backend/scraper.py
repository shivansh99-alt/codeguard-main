import requests
import re


def fetch_code_from_url(url: str) -> dict:
    """
    Fetches raw code from a URL or GitHub link.

    Supports:
    - GitHub file URLs  (github.com/user/repo/blob/main/file.py)
    - GitHub raw URLs   (raw.githubusercontent.com/...)
    - Any direct URL to a code file

    Returns:
        { "code": "...", "filename": "...", "error": None }
    or
        { "code": None, "filename": None, "error": "reason" }
    """

    url = url.strip()

    # --- convert GitHub blob URL to raw URL ---
    # e.g. https://github.com/user/repo/blob/main/script.py
    #   -> https://raw.githubusercontent.com/user/repo/main/script.py
    github_blob = re.match(
        r'https?://github\.com/([^/]+)/([^/]+)/blob/(.+)', url
    )
    if github_blob:
        user, repo, rest = github_blob.groups()
        url = f"https://raw.githubusercontent.com/{user}/{repo}/{rest}"

    # extract filename from URL
    filename = url.split('/')[-1].split('?')[0] or "fetched_code.txt"
    if '.' not in filename:
        filename += ".txt"

    try:
        headers = {
            "User-Agent": "CodeGuard-PlagiarismDetector/1.0"
        }
        response = requests.get(url, headers=headers, timeout=15)

        if response.status_code != 200:
            return {
                "code": None,
                "filename": None,
                "error": f"HTTP {response.status_code} — could not fetch URL"
            }

        # check it's actually text/code (not binary)
        content_type = response.headers.get("Content-Type", "")
        if "text" not in content_type and "json" not in content_type:
            # still try to decode
            pass

        code = response.text

        # sanity check — reject very large files
        if len(code) > 100_000:
            return {
                "code": None,
                "filename": None,
                "error": "File too large (>100KB). Please use a smaller file."
            }

        return {
            "code": code,
            "filename": filename,
            "error": None
        }

    except requests.exceptions.Timeout:
        return {"code": None, "filename": None, "error": "Request timed out."}
    except requests.exceptions.ConnectionError:
        return {"code": None, "filename": None, "error": "Could not connect to URL."}
    except Exception as e:
        return {"code": None, "filename": None, "error": str(e)}
