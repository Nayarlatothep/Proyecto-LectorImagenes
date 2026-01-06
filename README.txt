=========================================
      LECTOR DE IMÁGENES IA (OCR)
=========================================

🌐 LINK DE ACCESO (WEB):
https://proyecto-lector-imagenes.vercel.app

-----------------------------------------
1. DESCRIPCIÓN DEL PROYECTO
-----------------------------------------
Esta aplicación permite extraer texto de imágenes (OCR) de forma instantánea y segura. 
A diferencia de otras herramientas, el procesamiento se realiza 100% en el navegador del usuario utilizando la librería Tesseract.js. Esto garantiza velocidad y privacidad, ya que las imágenes no se suben a ningún servidor externo para su análisis.

-----------------------------------------
2. CÓMO FUNCIONA (INSTRUCCIONES)
-----------------------------------------
1. Acceda al enlace proporcionado arriba.
2. Arrastre una imagen al área indicada o haga clic para seleccionar un archivo desde su dispositivo móvil o PC.
3. Haga clic en el botón "✨ Analizar Imagen".
4. El sistema mostrará una barra de progreso mientras el motor de IA identifica los caracteres.
5. El texto extraído aparecerá en el recuadro de la derecha.
6. Puede copiar el texto al portapapeles o descargarlo como un archivo .txt.
7. Use el botón "Limpiar" para procesar una nueva imagen.

-----------------------------------------
3. PROCESO DE DESARROLLO
-----------------------------------------
El proyecto evolucionó a través de las siguientes fases:

FASE 1: Prototipo en Python (Streamlit)
- Desarrollo inicial utilizando Python, Streamlit y Tesseract-OCR local.
- Limitación: Requiere instalación de binarios en el servidor, lo que dificulta el despliegue web gratuito.

FASE 2: Migración a Aplicación Web Estática (Vercel)
- Rediseño completo utilizando HTML5, CSS3 (Glassmorphism) y JavaScript puro.
- Integración de Tesseract.js vía CDN para procesamiento en el lado del cliente (browser-side).
- Optimización de UI para carga rápida y diseño responsive.

FASE 3: Despliegue y Distribución
- Configuración de vercel.json para alojamiento nativo.
- Vinculación con repositorio GitHub: Nayarlatothep/Proyecto-LectorImagenes.
- Lanzamiento de la URL pública para uso global.

-----------------------------------------
4. CARACTERÍSTICAS TÉCNICAS
-----------------------------------------
- Tecnologías: HTML, CSS, JavaScript, Tesseract.js.
- Diseño: Interfaz moderna con efectos de cristal, animaciones y modo oscuro.
- Soporte de Idiomas: Español e Inglés (spa+eng).
- Compatibilidad: Funciona en Chrome, Safari, Edge y navegadores móviles.

-----------------------------------------
Desarrollado con ❤️ para Nayarlatothep
=========================================
