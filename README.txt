=========================================
      LECTOR DE FACTURAS IA (OCR)
=========================================

🌐 LINK DE ACCESO (WEB):
https://proyecto-lector-imagenes.vercel.app

-----------------------------------------
1. DESCRIPCIÓN DEL PROYECTO
-----------------------------------------
Esta aplicación permite extraer datos estructurados de facturas de forma interactiva. 
Utiliza tecnología OCR avanzada (Tesseract.js) para identificar automáticamente campos clave como Nombre de Empresa, RTN, Fecha, Cliente, Total y más. El procesamiento se realiza 100% en el navegador, garantizando velocidad y privacidad total.

🆕 NUEVA CARACTERÍSTICA: CORRECCIÓN INTERACTIVA
El sistema ahora dibuja cuadros sobre los campos detectados en la imagen. Si el algoritmo se equivoca, puedes mover o redimensionar los cuadros manualmente, y el sistema re-analizará automáticamente esa región específica para mayor precisión.

-----------------------------------------
2. CÓMO FUNCIONA (INSTRUCCIONES)
-----------------------------------------
1. Acceda al enlace proporcionado arriba.
2. Arrastre una imagen de factura al área indicada o haga clic para seleccionar un archivo.
3. Haga clic en el botón "✨ Analizar Factura".
4. El sistema mostrará:
   - Cuadros de selección sobre los campos detectados (Empresa, RTN, Total, etc.)
   - Una tabla con los datos extraídos
5. Si algún campo es incorrecto:
   - Arrastra el cuadro hacia la ubicación correcta en la imagen
   - Redimensiona el cuadro usando el manejador en la esquina inferior derecha
   - El sistema re-analizará automáticamente esa zona
6. Descargue los datos como archivo CSV para usar en Excel.
7. Use el botón "Limpiar" para procesar una nueva factura.

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

FASE 3: Especialización en Facturas (Enero 2026)
- Implementación de detección automática de campos estructurados.
- Sistema interactivo de cuadros de selección (ROI - Region of Interest).
- Re-análisis de regiones específicas para corrección manual.
- Exportación de datos a formato CSV/Excel.

-----------------------------------------
4. CARACTERÍSTICAS TÉCNICAS
-----------------------------------------
- Tecnologías: HTML, CSS, JavaScript, Tesseract.js.
- Diseño: Interfaz moderna con efectos de cristal, animaciones y modo oscuro.
- Soporte de Idiomas: Español e Inglés (spa+eng).
- Compatibilidad: Funciona en Chrome, Safari, Edge y navegadores móviles.
- Campos Detectados: Empresa, Factura #, Fecha, Cliente, Dirección, RTN, Artículos, Cantidad, Total.
- Interactividad: Cuadros arrastrables y redimensionables con re-análisis automático.

-----------------------------------------
Desarrollado con ❤️ para Nayarlatothep
=========================================
