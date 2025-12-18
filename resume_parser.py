from pyresparser import ResumeParser
import sys
import json

file_path = sys.argv[1]
data = ResumeParser(file_path).get_extracted_data()
print(json.dumps(data))
