from flask import Flask, request, jsonify
from flask_cors import CORS
import sys, os

sys.path.append(os.path.dirname(__file__))

from algorithms.lcs import similarity_score, get_matching_lines
from huggingface import explain_similarity
from scraper import fetch_code_from_url

app = Flask(__name__)
CORS(app)


@app.route('/', methods=['GET'])
def home():
    return jsonify({"status": "CodeGuard API is running 🚀"})


@app.route('/fetch-url', methods=['POST'])
def fetch_url():
    """
    Receives a URL, fetches the code from it, returns filename + code.
    Frontend uses this to populate a file slot from a GitHub/URL.
    """
    data = request.get_json()
    url  = data.get("url", "").strip()

    if not url:
        return jsonify({"error": "No URL provided"}), 400

    result = fetch_code_from_url(url)

    if result["error"]:
        return jsonify({"error": result["error"]}), 400

    return jsonify({
        "filename": result["filename"],
        "code":     result["code"]
    })


@app.route('/compare', methods=['POST'])
def compare():
    """
    Accepts:
      - Uploaded files  (multipart form — key: 'files')
      - URL-fetched code (JSON list   — key: 'url_sources': [{filename, code}])
    Combines both, compares every pair, returns results.
    """

    # --- uploaded files ---
    uploaded = request.files.getlist('files')
    file_data = []

    for f in uploaded:
        try:
            content = f.read().decode('utf-8')
            file_data.append({"name": f.filename, "code": content})
        except Exception:
            return jsonify({"error": f"Could not read {f.filename}"}), 400

    # --- URL-fetched sources (sent as JSON in form field) ---
    import json
    url_sources_raw = request.form.get('url_sources', '[]')
    try:
        url_sources = json.loads(url_sources_raw)
        for src in url_sources:
            file_data.append({
                "name": src.get("filename", "url_source.txt"),
                "code": src.get("code", "")
            })
    except Exception:
        pass

    if len(file_data) < 2:
        return jsonify({"error": "Need at least 2 files/URLs to compare"}), 400
    if len(file_data) > 5:
        return jsonify({"error": "Maximum 5 sources allowed"}), 400

    # --- compare every pair ---
    results = []
    for i in range(len(file_data)):
        for j in range(i + 1, len(file_data)):
            f1 = file_data[i]
            f2 = file_data[j]

            score   = similarity_score(f1["code"], f2["code"])
            percent = round(score * 100, 2)
            matching_lines = get_matching_lines(f1["code"], f2["code"])

            if percent >= 80:
                level = "HIGH"
            elif percent >= 50:
                level = "MEDIUM"
            else:
                level = "LOW"

            explanation = explain_similarity(
                f1["code"], f2["code"],
                percent, f1["name"], f2["name"]
            )

            results.append({
                "file1":         f1["name"],
                "file2":         f2["name"],
                "code1":         f1["code"],
                "code2":         f2["code"],
                "similarity":    percent,
                "level":         level,
                "matching_lines": matching_lines,
                "explanation":   explanation
            })

    return jsonify(results)


if __name__ == '__main__':
    app.run(debug=True, port=5000)
