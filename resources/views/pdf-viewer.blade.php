<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>Preview Dokumen - {{ $title }}</title>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js"></script>
    <style>
        body {
            margin: 0;
            padding: 0;
            background-color: #525659;
            font-family: 'Inter', sans-serif;
            overflow: hidden;
        }
        #viewer-container {
            position: absolute;
            top: 56px;
            left: 0;
            right: 0;
            bottom: 0;
            overflow-y: auto;
            display: flex;
            flex-direction: column;
            align-items: center;
            padding: 20px 0;
        }
        .page-container {
            position: relative;
            margin-bottom: 24px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            background-color: white;
            min-height: 800px;
            width: fit-content;
        }
        canvas {
            display: block;
        }
        #toolbar {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            height: 56px;
            background-color: #323639;
            color: white;
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 0 24px;
            z-index: 1000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.4);
        }
        .title-area {
            flex: 1;
            min-width: 0;
        }
        .title-text {
            font-weight: 500;
            font-size: 15px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
            display: block;
        }
        #page-info {
            font-size: 14px;
            background: rgba(255,255,255,0.1);
            padding: 6px 12px;
            border-radius: 4px;
            margin: 0 20px;
        }
        #loading-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: #323639;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
            z-index: 2000;
        }
        .spinner {
            border: 3px solid rgba(255,255,255,0.1);
            border-radius: 50%;
            border-top: 3px solid #3b82f6;
            width: 48px;
            height: 48px;
            animation: spin 1s linear infinite;
            margin-bottom: 16px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        body {
            user-select: none;
            -webkit-user-select: none;
            -moz-user-select: none;
            -ms-user-select: none;
        }
        ::-webkit-scrollbar {
            width: 12px;
        }
        ::-webkit-scrollbar-track {
            background: #525659;
        }
        ::-webkit-scrollbar-thumb {
            background: #888;
            border-radius: 6px;
            border: 3px solid #525659;
        }
        ::-webkit-scrollbar-thumb:hover {
            background: #aaa;
        }
    </style>
</head>
<body oncontextmenu="return false;">
    <div id="loading-overlay">
        <div class="spinner"></div>
        <div id="loading-text">Menyiapkan Dokumen...</div>
    </div>

    <div id="toolbar">
        <div class="title-area">
            <span class="title-text">{{ $title }}</span>
        </div>
        <div id="page-info">
            Halaman <span id="page-num">1</span> dari <span id="page-count">-</span>
        </div>
        <div style="flex: 1; display: flex; justify-content: flex-end;">
            <div id="render-status" style="font-size: 12px; color: #aaa;">Memuat...</div>
        </div>
    </div>

    <div id="viewer-container">
        <div id="canvas-container"></div>
    </div>

    <script>
        (async function() {
            const streamUrl = '{!! $pdfStreamUrl !!}';
            const csrfToken = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
            
            const pdfjsLib = window['pdfjs-dist/build/pdf'];
            pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

            let pdfDoc = null;
            let scale = 1.5;
            const container = document.getElementById('canvas-container');
            const viewerContainer = document.getElementById('viewer-container');

            async function renderPages() {
                for (let num = 1; num <= pdfDoc.numPages; num++) {
                    const page = await pdfDoc.getPage(num);
                    const viewport = page.getViewport({ scale: scale });
                    
                    const pageDiv = document.createElement('div');
                    pageDiv.className = 'page-container';
                    pageDiv.id = 'page-section-' + num;
                    pageDiv.setAttribute('data-page-number', num);
                    
                    const canvas = document.createElement('canvas');
                    const ctx = canvas.getContext('2d');
                    canvas.height = viewport.height;
                    canvas.width = viewport.width;

                    pageDiv.appendChild(canvas);
                    container.appendChild(pageDiv);

                    const renderContext = {
                        canvasContext: ctx,
                        viewport: viewport
                    };
                    
                    await page.render(renderContext).promise;
                    
                    if (num === 1) {
                        document.getElementById('loading-overlay').style.display = 'none';
                    }

                    document.getElementById('render-status').textContent = `Memuat halaman ${num}/${pdfDoc.numPages}...`;
                }
                document.getElementById('render-status').textContent = 'Selesai dimuat';
            }

            try {
                // Fetch the PDF using POST and CSRF token
                const response = await fetch(streamUrl, {
                    method: 'POST',
                    headers: {
                        'X-CSRF-TOKEN': csrfToken,
                        'Accept': 'application/pdf'
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                // Get the binary data
                const arrayBuffer = await response.arrayBuffer();
                const pdfData = new Uint8Array(arrayBuffer);

                // Load the PDF from binary data instead of a URL
                pdfDoc = await pdfjsLib.getDocument({ data: pdfData }).promise;
                
                document.getElementById('page-count').textContent = pdfDoc.numPages;
                renderPages();

            } catch (err) {
                console.error('Error loading PDF:', err);
                document.getElementById('loading-text').textContent = 'Gagal memuat dokumen. Akses ditolak atau sesi telah kedaluwarsa.';
                document.querySelector('.spinner').style.display = 'none';
            }

            viewerContainer.addEventListener('scroll', () => {
                const pages = document.querySelectorAll('.page-container');
                let currentPage = 1;
                
                for (const page of pages) {
                    const rect = page.getBoundingClientRect();
                    if (rect.top < window.innerHeight / 2 && rect.bottom > window.innerHeight / 2) {
                        currentPage = page.getAttribute('data-page-number');
                        break;
                    }
                }
                document.getElementById('page-num').textContent = currentPage;
            });

            window.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && (e.key === 'p' || e.key === 's')) {
                    e.preventDefault();
                }
            });
        })();
    </script>
</body>
</html>
