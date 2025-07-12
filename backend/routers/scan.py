import numpy as np
import cv2 
import os , uuid 
from fastapi import APIRouter, File, UploadFile
from fastapi.responses import JSONResponse
import mediapipe as mp
from mediapipe.python.solutions import face_mesh 

face_mesh = mp.solutions.face_mesh 
router = APIRouter(
    prefix="/scan",     # ←***MUST*** be exactly "/scan"
    tags=["Scan"]       #     (so final path = /scan/image)
)

TMP_DIR = 'data/uploads'

def analyse_frame(frame) :
    """Return True if a face mesh is present , else false"""
    with face_mesh.FaceMesh(static_image_mode=True, max_num_faces = 1, refine_landmarks = True, min_detection_confidence = 0.6) as fm:
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        res = fm.process(rgb)
        return bool(res.multi_face_landmarks)
    
@router.post("/image")
async def scan_image(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    img = cv2.imdecode(nparr,cv2.IMREAD_COLOR)
    
    is_real = analyse_frame(img)
    return {"filename": file.filename, "has_face": is_real}

@router.post("/video")
async def scan_video(file: UploadFile = File(...)):
    tmp_name = os.path.join(TMP_DIR, f"{uuid.uuid4()}.mp4")
    with open(tmp_name, "wb") as f:
        f.write(await file.read())
    cap = cv2.VideoCapture(tmp_name)
    frames_total,frames_with_face = 0,0
    
    while cap.isOpened():
        ok, frame = cap.read()
        if not ok:
            break
        frames_total += 1
        if analyse_frame(frame):
            frames_with_face += 1
    cap.release()
    os.remove(tmp_name)
    
    return {'frames_checked': frames_total, 'frames_with_face': frames_with_face, 'percent_real': round(frames_with_face / max(frames_total,1) * 100,2)}