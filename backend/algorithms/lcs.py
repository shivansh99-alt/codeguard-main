import sys, os
sys.path.append(os.path.dirname(os.path.dirname(__file__)))
from tokenizer import tokenize

def lcs_length(t1, t2):
    m, n = len(t1), len(t2)
    dp = [[0] * (n + 1) for _ in range(m + 1)]
    for i in range(1, m + 1):
        for j in range(1, n + 1):
            if t1[i-1] == t2[j-1]:
                dp[i][j] = dp[i-1][j-1] + 1
            else:
                dp[i][j] = max(dp[i-1][j], dp[i][j-1])
    return dp[m][n]

def similarity_score(code1, code2):
    t1 = tokenize(code1)
    t2 = tokenize(code2)
    if not t1 or not t2:
        return 0.0
    lcs = lcs_length(t1, t2)
    return round(lcs / max(len(t1), len(t2)), 4)

def get_matching_lines(code1, code2):
    """Returns line numbers that match between two files."""
    lines1 = code1.splitlines()
    lines2 = code2.splitlines()
    matching = []
    for i, line1 in enumerate(lines1):
        stripped1 = line1.strip()
        if len(stripped1) < 4:
            continue
        for j, line2 in enumerate(lines2):
            if stripped1 == line2.strip():
                matching.append({
                    "line1": i + 1,
                    "line2": j + 1,
                    "content": stripped1
                })
                break
    return matching
