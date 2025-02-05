import os
from pprint import pprint
import openpyxl
import json

root_dir = os.getcwd()

excel_file = os.path.join(root_dir, 'util/24-1.xlsx')     # Required to change file name
json_file = os.path.join(root_dir, 'app/data/24-1.json')  # Required to change file name

wb = openpyxl.load_workbook(excel_file)
sheet = wb.active

headers = ['dept', 'code', 'name', 'prof', 'time', 'allowed_4', 'actual_4', 'allowed_3', 'actual_3', 'allowed_2', 'actual_2', 'allowed_1', 'actual_1']

# Read sheet's data and convert to dictionary
data = []
for row in sheet.iter_rows(min_row=2, values_only=True):  # First row is header
    row_dict = {headers[i]: row[i] for i in range(len(headers))}
    data.append(row_dict)

pprint(data)

# Save as JSON
with open(json_file, 'w', encoding='utf-8') as json_file:
    json.dump(data, json_file, ensure_ascii=False, indent=4)