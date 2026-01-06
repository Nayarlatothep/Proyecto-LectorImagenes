// ===== DOM Elements =====
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const previewImage = document.getElementById('previewImage');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultText = document.getElementById('resultText');
const copyBtn = document.getElementById('copyBtn');
const downloadBtn = document.getElementById('downloadBtn');
const clearBtn = document.getElementById('clearBtn');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');

// ===== State =====
let currentImage = null;
let isProcessing = false;

// ===== Event Listeners =====
uploadArea.addEventListener('click', () => fileInput.click());

uploadArea.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadArea.classList.add('dragover');
});

uploadArea.addEventListener('dragleave', () => {
    uploadArea.classList.remove('dragover');
});

uploadArea.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadArea.classList.remove('dragover');
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
        handleImageUpload(file);
    }
});

fileInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (file) {
        handleImageUpload(file);
    }
});

analyzeBtn.addEventListener('click', performOCR);
copyBtn.addEventListener('click', copyToClipboard);
downloadBtn.addEventListener('click', downloadAsText);
clearBtn.addEventListener('click', clearAll);

// ===== Functions =====
function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = e.target.result;
        previewImage.src = currentImage;
        previewImage.classList.add('visible');
        uploadPlaceholder.style.display = 'none';
        analyzeBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

async function performOCR() {
    if (!currentImage || isProcessing) return;

    isProcessing = true;
    analyzeBtn.disabled = true;
    analyzeBtn.querySelector('.btn-text').textContent = 'Procesando...';
    analyzeBtn.querySelector('.btn-loader').hidden = false;
    progressContainer.hidden = false;
    resultText.value = '';

    try {
        const result = await Tesseract.recognize(currentImage, 'spa+eng', {
            logger: (m) => {
                if (m.status === 'recognizing text') {
                    const percent = Math.round(m.progress * 100);
                    progressFill.style.width = `${percent}%`;
                    progressText.textContent = `Reconociendo texto... ${percent}%`;
                } else if (m.status === 'loading tesseract core') {
                    progressText.textContent = 'Cargando motor OCR...';
                    progressFill.style.width = '10%';
                } else if (m.status === 'initializing tesseract') {
                    progressText.textContent = 'Inicializando Tesseract...';
                    progressFill.style.width = '20%';
                } else if (m.status === 'loading language traineddata') {
                    progressText.textContent = 'Cargando idiomas (spa+eng)...';
                    progressFill.style.width = '40%';
                } else if (m.status === 'initializing api') {
                    progressText.textContent = 'Preparando análisis...';
                    progressFill.style.width = '50%';
                }
            }
        });

        progressFill.style.width = '100%';
        progressText.textContent = '✅ ¡Análisis completado!';

        resultText.value = result.data.text.trim() || 'No se detectó texto en la imagen.';
        enableResultButtons();

        setTimeout(() => {
            progressContainer.hidden = true;
            progressFill.style.width = '0%';
        }, 2000);

    } catch (error) {
        console.error('OCR Error:', error);
        resultText.value = `Error al procesar la imagen: ${error.message}`;
        progressText.textContent = '❌ Error en el procesamiento';
    } finally {
        isProcessing = false;
        analyzeBtn.disabled = false;
        analyzeBtn.querySelector('.btn-text').textContent = '✨ Analizar Imagen';
        analyzeBtn.querySelector('.btn-loader').hidden = true;
    }
}

function enableResultButtons() {
    copyBtn.disabled = false;
    downloadBtn.disabled = false;
    clearBtn.disabled = false;
}

async function copyToClipboard() {
    try {
        await navigator.clipboard.writeText(resultText.value);
        const originalText = copyBtn.textContent;
        copyBtn.textContent = '✅ Copiado!';
        setTimeout(() => {
            copyBtn.textContent = originalText;
        }, 2000);
    } catch (err) {
        console.error('Failed to copy:', err);
    }
}

function downloadAsText() {
    const text = resultText.value;
    const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'texto_extraido.txt';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function clearAll() {
    currentImage = null;
    previewImage.src = '';
    previewImage.classList.remove('visible');
    uploadPlaceholder.style.display = 'block';
    fileInput.value = '';
    resultText.value = '';
    analyzeBtn.disabled = true;
    copyBtn.disabled = true;
    downloadBtn.disabled = true;
    clearBtn.disabled = true;
    progressContainer.hidden = true;
    progressFill.style.width = '0%';
}
