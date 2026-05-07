import os
from pathlib import Path


def load_local_env():
    env_path = Path(__file__).with_name(".env")

    if not env_path.exists():
        return

    for line in env_path.read_text(encoding="utf-8").splitlines():
        line = line.strip()

        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)

        os.environ.setdefault(
            key.strip(),
            value.strip().strip("\"'")
        )


load_local_env()


def explain_similarity(code1, code2, similarity_percent, file1, file2):

    if similarity_percent >= 80:
        level = "very high"
    elif similarity_percent >= 50:
        level = "moderate"
    else:
        level = "low"

    explanation = f"""
The similarity between {file1} and {file2} is {similarity_percent}%,
which indicates a {level} level of code overlap.

Both files contain similar programming structure,
logic flow, and implementation patterns.
Some variable names, syntax structure,
or coding approaches appear related.

This may indicate shared logic,
reference usage, or possible plagiarism.
"""

    return explanation.strip()