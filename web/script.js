// ===== DOM Elements =====
const uploadArea = document.getElementById('uploadArea');
const fileInput = document.getElementById('fileInput');
const uploadPlaceholder = document.getElementById('uploadPlaceholder');
const previewImage = document.getElementById('previewImage');
const imageContainer = document.getElementById('imageContainer');
const roiOverlay = document.getElementById('roiOverlay');
const analyzeBtn = document.getElementById('analyzeBtn');
const invoiceTableBody = document.getElementById('invoiceTableBody');
const clearBtn = document.getElementById('clearBtn');
const exportCsvBtn = document.getElementById('exportCsvBtn');
const progressContainer = document.getElementById('progressContainer');
const progressFill = document.getElementById('progressFill');
const progressText = document.getElementById('progressText');
const interactionHint = document.getElementById('interactionHint');

// ===== Configuration =====
const INVOICE_FIELDS = [
    { key: 'empresa', label: 'Nombre Empresa', regex: /(?:empresa|cia|company|negocio)[\s:.-]+([^\n]+)/i },
    { key: 'factura', label: 'Factura #', regex: /(?:factura|no\.|invoice|doc)[\s:.-]+([0-9A-Z-]+)/i },
    { key: 'fecha', label: 'Fecha', regex: /(\d{1,2})[\/\-.](\d{1,2})[\/\-.](\d{2,4})/ },
    { key: 'cliente', label: 'Cliente', regex: /(?:cliente|consumer|name)[\s:.-]+([^\n]+)/i },
    { key: 'direccion', label: 'Dirección', regex: /(?:direccion|address|ubicacion)[\s:.-]+([^\n]+)/i },
    { key: 'rtn', label: 'RTN / Tax ID', regex: /(?:rtn|tax|id|nit)[\s:.-]+([0-9-]+)/i },
    { key: 'articulos', label: 'Artículos', regex: /(?:items|articulos|descripcion)/i },
    { key: 'cantidad', label: 'Cantidad', regex: /(?:cantidad|qty|pcs)/i },
    { key: 'total', label: 'Total', regex: /(?:total|monto|amount)[\s:.-]+([0-9.,$ ]+)/i }
];

// ===== State =====
let currentImage = null;
let isProcessing = false;
let detectedData = {};
let activeROI = null;
let offset = { x: 0, y: 0 };
let currentScale = 1;

// ===== Event Listeners =====
uploadArea.addEventListener('click', (e) => {
    if (e.target.closest('.roi-box')) return;
    fileInput.click();
});

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
clearBtn.addEventListener('click', clearAll);
exportCsvBtn.addEventListener('click', exportToCSV);

// ===== Functions =====
function handleImageUpload(file) {
    const reader = new FileReader();
    reader.onload = (e) => {
        currentImage = e.target.result;
        previewImage.src = currentImage;
        previewImage.classList.add('visible');
        imageContainer.style.display = 'flex';
        uploadPlaceholder.style.display = 'none';
        analyzeBtn.disabled = false;
        clearBtn.disabled = false;
    };
    reader.readAsDataURL(file);
}

async function performOCR() {
    if (!currentImage || isProcessing) return;

    isProcessing = true;
    analyzeBtn.disabled = true;
    analyzeBtn.querySelector('.btn-text').textContent = 'Analizando...';
    analyzeBtn.querySelector('.btn-loader').hidden = false;
    progressContainer.hidden = false;
    roiOverlay.innerHTML = '';

    try {
        const worker = await Tesseract.createWorker('spa+eng', 1, {
            logger: m => updateProgress(m)
        });

        const { data } = await worker.recognize(currentImage);

        // Process results
        processOCRResults(data);

        progressFill.style.width = '100%';
        progressText.textContent = '✅ Análisis completo. Puedes ajustar los cuadros si es necesario.';
        interactionHint.hidden = false;
        exportCsvBtn.disabled = false;

        await worker.terminate();
    } catch (error) {
        console.error('OCR Error:', error);
        progressText.textContent = '❌ Error: ' + error.message;
    } finally {
        isProcessing = false;
        analyzeBtn.disabled = false;
        analyzeBtn.querySelector('.btn-text').textContent = '✨ Re-analizar';
        analyzeBtn.querySelector('.btn-loader').hidden = true;
    }
}

function updateProgress(m) {
    if (m.status === 'recognizing text') {
        const percent = Math.round(m.progress * 100);
        progressFill.style.width = `${percent}%`;
        progressText.textContent = `Identificando campos... ${percent}%`;
    }
}

function processOCRResults(data) {
    const text = data.text;
    const lines = data.lines;

    detectedData = {};
    invoiceTableBody.innerHTML = '';

    INVOICE_FIELDS.forEach(field => {
        let value = 'No detectado';
        let foundLine = null;

        const match = text.match(field.regex);
        if (match) {
            value = match[1] ? match[1].trim() : match[0].trim();
            // Try to find the line for coordinates
            foundLine = lines.find(l => l.text.includes(value.substring(0, 5)));
        }

        detectedData[field.key] = value;
        renderTableRow(field.label, value, field.key);

        if (foundLine) {
            createROIBox(foundLine.bbox, field.label, field.key);
        }
    });
}

function renderTableRow(label, value, key) {
    const row = document.createElement('tr');
    row.innerHTML = `
        <td class="field-name">${label}</td>
        <td class="field-value" id="val-${key}">${value}</td>
    `;
    invoiceTableBody.appendChild(row);
}

function createROIBox(bbox, label, key) {
    const box = document.createElement('div');
    box.className = 'roi-box';
    box.dataset.key = key;

    // Scale coordinates based on displayed image size
    const imgRect = previewImage.getBoundingClientRect();
    const scaleX = imgRect.width / previewImage.naturalWidth;
    const scaleY = imgRect.height / previewImage.naturalHeight;

    box.style.left = `${bbox.x0 * scaleX}px`;
    box.style.top = `${bbox.y0 * scaleY}px`;
    box.style.width = `${(bbox.x1 - bbox.x0) * scaleX}px`;
    box.style.height = `${(bbox.y1 - bbox.y0) * scaleY}px`;

    const labelEl = document.createElement('div');
    labelEl.className = 'roi-label';
    labelEl.textContent = label;

    const handle = document.createElement('div');
    handle.className = 'roi-handle';

    box.appendChild(labelEl);
    box.appendChild(handle);
    roiOverlay.appendChild(box);

    setupDraggable(box);
}

function setupDraggable(el) {
    let isDragging = false;
    let isResizing = false;

    el.addEventListener('mousedown', (e) => {
        if (e.target.classList.contains('roi-handle')) {
            isResizing = true;
        } else {
            isDragging = true;
        }

        activeROI = el;
        const rect = el.getBoundingClientRect();
        offset.x = e.clientX - rect.left;
        offset.y = e.clientY - rect.top;

        e.stopPropagation();
    });

    document.addEventListener('mousemove', (e) => {
        if (!activeROI) return;

        const containerRect = roiOverlay.getBoundingClientRect();

        if (isDragging) {
            let x = e.clientX - containerRect.left - offset.x;
            let y = e.clientY - containerRect.top - offset.y;

            activeROI.style.left = `${x}px`;
            activeROI.style.top = `${y}px`;
        } else if (isResizing) {
            const rect = activeROI.getBoundingClientRect();
            const width = e.clientX - rect.left;
            const height = e.clientY - rect.top;

            activeROI.style.width = `${width}px`;
            activeROI.style.height = `${height}px`;
        }
    });

    document.addEventListener('mouseup', async () => {
        if (activeROI && (isDragging || isResizing)) {
            const key = activeROI.dataset.key;
            await reanalyzeRegion(activeROI, key);
        }
        isDragging = false;
        isResizing = false;
        activeROI = null;
    });
}

async function reanalyzeRegion(box, key) {
    const imgRect = previewImage.getBoundingClientRect();
    const scaleX = previewImage.naturalWidth / imgRect.width;
    const scaleY = previewImage.naturalHeight / imgRect.height;

    const rect = {
        left: parseInt(box.style.left) * scaleX,
        top: parseInt(box.style.top) * scaleY,
        width: parseInt(box.style.width) * scaleX,
        height: parseInt(box.style.height) * scaleY
    };

    try {
        const worker = await Tesseract.createWorker('spa+eng');
        const { data: { text } } = await worker.recognize(currentImage, {
            rectangle: rect
        });

        const newValue = text.trim() || 'No detectado';
        document.getElementById(`val-${key}`).textContent = newValue;
        detectedData[key] = newValue;

        await worker.terminate();
    } catch (err) {
        console.error('Re-analysis error:', err);
    }
}

function exportToCSV() {
    let csv = 'Campo,Valor\n';
    INVOICE_FIELDS.forEach(f => {
        csv += `"${f.label}","${detectedData[f.key] || ''}"\n`;
    });

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `factura_analizada_${new Date().getTime()}.csv`);
    link.click();
}

function clearAll() {
    currentImage = null;
    previewImage.src = '';
    previewImage.classList.remove('visible');
    imageContainer.style.display = 'none';
    uploadPlaceholder.style.display = 'block';
    fileInput.value = '';
    invoiceTableBody.innerHTML = '';
    analyzeBtn.disabled = true;
    exportCsvBtn.disabled = true;
    clearBtn.disabled = true;
    progressContainer.hidden = true;
    interactionHint.hidden = true;
    roiOverlay.innerHTML = '';
}
