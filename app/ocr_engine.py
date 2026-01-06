import pytesseract
from PIL import Image
import os

# Configuración de la ruta de Tesseract (Ajusta si es necesario)
# Por defecto en Windows se instala en Program Files
tesseract_path = r'C:\Users\vrojas\AppData\Local\Programs\Tesseract-OCR\tesseract.exe'

if os.path.exists(tesseract_path):
    pytesseract.pytesseract.tesseract_cmd = tesseract_path

def extract_text(image):
    """
    Recibe un objeto de imagen (PIL.Image) y devuelve el texto extraído.
    """
    try:
        # Extraer texto usando Tesseract
        # 'spa' para español, 'eng' para inglés
        text = pytesseract.image_to_string(image, lang='spa+eng')
        return text
    except Exception as e:
        return f"Error al procesar la imagen: {str(e)}"
