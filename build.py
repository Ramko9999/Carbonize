import os
import sys

rawJs = ""
fileLines = []
with open("./build/index.html", "r") as f:
    scriptStart, scriptEnd = -1, -1
    for i, line in enumerate(f.readlines()):
        line = line.strip()
        fileLines.append(line)
        if line == "<script>":
            scriptStart = i
        if line == "</script>":
            scriptEnd = i
    
    if scriptStart == -1 or scriptEnd == -1:
        print("there is no script in the index.html file...")
        f.close()
        sys.exit()
    else:
        print(scriptStart, scriptEnd) 
        rawJs = "\n".join(fileLines[scriptStart + 1:scriptEnd])
        fileLines = fileLines[0:scriptStart] + ["<script src=./runner.js></script>"] + fileLines[scriptEnd + 1:]

runnerPath = "./build/runner.js"
if os.path.exists(runnerPath):
    print("runner.js already exists... deleting it")
    os.remove(runnerPath)

with open("./build/runner.js", "w") as f:
    f.write(rawJs)
    print("runner.js is created...")

os.remove("./build/index.html")
with open("./build/index.html", "w") as f:
    f.write("\n".join(fileLines))
    print("index.html is re-created...")


