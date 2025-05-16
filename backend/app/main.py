from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
import os
import shutil
import numpy as np
import pandas as pd


app = FastAPI()

UPLOAD_DIR = "uploaded_data"

# Ensure the upload directory exists
os.makedirs(UPLOAD_DIR, exist_ok=True)

def txt_to_array(text_content, delimiter=None):
    """
    Convert text content with columns to a numpy array
    """
    # Split the text into lines
    lines = [line.strip() for line in text_content.strip().split('\n')]
    
    # Split each line by delimiter
    rows = [line.split(delimiter) for line in lines if line]
    
    # Convert to numpy array
    return np.array(rows)

@app.post("/upload_dna/{name}")
async def upload_file(file: UploadFile):
    file_location = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    result = subprocess.run(
            f"./scripts/convert_combine {file.name}",
            shell=True,
            check=True,
            text=True,
            capture_output=True
        )
    data_array = txt_to_array(result.stdout)
    print(data_array)

    return data_array

