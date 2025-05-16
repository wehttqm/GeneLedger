from fastapi import FastAPI, File, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
import os
import shutil

app = FastAPI()

origins = ["*"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploaded_data"

os.makedirs(UPLOAD_DIR, exist_ok=True)


@app.post("/upload_dna")
async def upload_file(file: UploadFile):
    file_location = os.path.join(UPLOAD_DIR, file.filename)

    with open(file_location, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    # Call convert_combine
    # redirect output to be processed by JSON, returned here

    return JSONResponse(
        content={"filename": file.filename, "message": "File uploaded successfully"},
        status_code=200,
    )


@app.post("/get/${name}")
async def get_genes(name: str):
    if name == "NA12878":
        return [
            {"id": "NA12891", "relationship": "dad", "shared_dna": 46.9},
            {"id": "NA12892", "relationship": "mom", "shared_dna": 53.1},
        ]
    elif name == "NA12891":
        return [{"id": "NA12878", "relationship": "child", "shared_dna": 46.9}]
