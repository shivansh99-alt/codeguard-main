import re

def tokenize(code):
    """
    Converts raw code into a list of tokens.
    Strips comments, normalizes strings, extracts meaningful symbols.
    """
    # remove single line comments
    code = re.sub(r'#.*', '', code)
    code = re.sub(r'//.*', '', code)
    # remove block comments
    code = re.sub(r'/\*.*?\*/', '', code, flags=re.DOTALL)
    # normalize string values
    code = re.sub(r'".*?"', '"STR"', code)
    code = re.sub(r"'.*?'", "'STR'", code)
    # extract tokens
    tokens = re.findall(r'\w+|[{}();=+\-*/\[\]<>!&|]', code)
    return tokens
