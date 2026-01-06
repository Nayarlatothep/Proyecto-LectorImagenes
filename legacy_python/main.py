import streamlit as st
from PIL import Image
from app.ocr_engine import extract_text
import base64

# Configuración de la página
st.set_page_config(
    page_title="Lector de Imágenes IA",
    page_icon="🔍",
    layout="wide"
)

# Estilo personalizado (Glassmorphism & Modern Dark)
st.markdown("""
<style>
    .main {
        background-color: #0e1117;
    }
    .stApp {
        background: linear-gradient(135deg, #0e1117 0%, #1c1f26 100%);
    }
    .stHeader {
        background: transparent;
    }
    .title-text {
        font-family: 'Inter', sans-serif;
        font-weight: 800;
        color: #ffffff;
        text-align: center;
        padding-bottom: 20px;
        background: -webkit-linear-gradient(#eee, #333);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
    }
    .css-1kyx7g3 {
        background-color: rgba(255, 255, 255, 0.05);
        border-radius: 15px;
        padding: 20px;
        border: 1px solid rgba(255, 255, 255, 0.1);
        backdrop-filter: blur(10px);
    }
    .stButton>button {
        width: 100%;
        border-radius: 10px;
        background: linear-gradient(45deg, #6a11cb 0%, #2575fc 100%);
        color: white;
        font-weight: bold;
        border: none;
        padding: 10px;
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        transform: translateY(-2px);
        box-shadow: 0 5px 15px rgba(0,0,0,0.3);
    }
</style>
""", unsafe_allow_html=True)

def main():
    st.markdown("<h1 class='title-text'>🔍 Lector de Imágenes IA</h1>", unsafe_allow_html=True)
    st.markdown("<p style='text-align: center; color: #888;'>Sube una imagen y extrae el texto al instante usando OCR de alta precisión.</p>", unsafe_allow_html=True)
    
    st.write("---")
    
    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.subheader("📸 Imagen de Origen")
        uploaded_file = st.file_uploader("Elige una imagen...", type=["jpg", "jpeg", "png", "bmp", "tiff"])
        
        if uploaded_file is not None:
            image = Image.open(uploaded_file)
            st.image(image, caption="Imagen cargada", use_column_width=True)
            
            if st.button("Analizar Imagen"):
                with st.spinner('Analizando contenido...'):
                    text = extract_text(image)
                    st.session_state['extracted_text'] = text
    
    with col2:
        st.subheader("📝 Texto Extraído")
        if 'extracted_text' in st.session_state:
            text_area = st.text_area("Contenido:", value=st.session_state['extracted_text'], height=450)
            
            # Botones de descarga
            c1, c2 = st.columns(2)
            with c1:
                st.download_button(
                    label="📥 Descargar como .TXT",
                    data=st.session_state['extracted_text'],
                    file_name="texto_extraido.txt",
                    mime="text/plain"
                )
            with c2:
                if st.button("✨ Limpiar"):
                    del st.session_state['extracted_text']
                    st.rerun()
        else:
            st.info("Sube una imagen y haz clic en 'Analizar' para ver los resultados aquí.")

if __name__ == "__main__":
    main()
