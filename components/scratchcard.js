class ScratchCard extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <style>
                .scratch-section {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 3rem 2rem 1.5rem 2rem;
                    position: relative;
                    z-index: 10;
                }
                .scratch-card-container {
                    position: relative;
                    width: 170px;
                    height: 170px;
                    background: rgba(125, 26, 41, 0.04);
                    border: 1px solid var(--accent-gold);
                    border-radius: 50%;
                    box-shadow: 0 10px 25px rgba(125, 26, 41, 0.05);
                    overflow: hidden;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    user-select: none;
                    -webkit-user-select: none;
                    transition: all 0.5s cubic-bezier(0.16, 1, 0.3, 1);
                }
                .scratch-card-container:hover {
                    border-color: var(--primary-crimson);
                    box-shadow: 0 15px 30px rgba(125, 26, 41, 0.1), 0 0 20px rgba(223, 177, 91, 0.2);
                    transform: scale(1.03);
                }
                .scratch-card-revealed {
                    text-align: center;
                    width: 100%;
                    height: 100%;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 1.5rem;
                    border-radius: 50%;
                    background: radial-gradient(circle, rgba(223, 177, 91, 0.08) 0%, transparent 80%);
                }
                .revealed-day {
                    font-family: var(--font-body);
                    font-size: 0.6rem;
                    color: var(--accent-gold);
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    opacity: 0.9;
                }
                .revealed-date {
                    font-family: var(--font-heading);
                    font-size: 3.2rem;
                    color: var(--primary-crimson);
                    line-height: 1.1;
                    margin: 0.1rem 0;
                    text-shadow: 0 0 8px rgba(223, 177, 91, 0.15);
                }
                .revealed-month {
                    font-family: var(--font-body);
                    font-size: 0.6rem;
                    color: var(--text-color);
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    opacity: 0.9;
                }
                .scratch-canvas {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    cursor: pointer;
                    z-index: 2;
                    border-radius: 50%;
                    transition: opacity 0.5s ease;
                }
                .scratch-hint {
                    font-family: var(--font-body);
                    font-size: 0.6rem;
                    color: var(--text-muted);
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    margin-top: 1rem;
                    opacity: 0.8;
                    animation: pulseHint 2s infinite ease-in-out;
                }
                @keyframes pulseHint {
                    0%, 100% { opacity: 0.4; }
                    50% { opacity: 0.9; }
                }
                @media (max-width: 768px) {
                    .scratch-section {
                        padding: 2rem 1rem 1rem 1rem;
                    }
                    .scratch-card-container {
                        width: 140px;
                        height: 140px;
                    }
                    .revealed-date { font-size: 2.5rem; }
                    .revealed-day { font-size: 0.5rem; }
                    .revealed-month { font-size: 0.5rem; }
                }
            </style>
            <div class="scratch-section fade-up">
                <div class="scratch-card-container">
                    <div class="scratch-card-revealed">
                        <div class="revealed-day">Thursday</div>
                        <div class="revealed-date">27</div>
                        <div class="revealed-month">August 2026</div>
                    </div>
                    <canvas class="scratch-canvas" width="170" height="170"></canvas>
                </div>
                <div class="scratch-hint" id="scratchHint">Scratch gold layer to reveal wedding date</div>
            </div>
        `;

        this.initScratchCard();
    }

    initScratchCard() {
        const canvas = this.querySelector('.scratch-canvas');
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        const container = this.querySelector('.scratch-card-container');
        const hint = this.querySelector('#scratchHint');
        
        let width = container.clientWidth;
        let height = container.clientHeight;
        canvas.width = width;
        canvas.height = height;

        // Draw gold cover surface
        const drawCover = () => {
            ctx.clearRect(0, 0, width, height);

            // Base border background
            ctx.fillStyle = '#fdfbf7'; // Cream base
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, width / 2, 0, Math.PI * 2);
            ctx.fill();

            // Gold metallic gradient overlay
            const grad = ctx.createLinearGradient(0, 0, width, height);
            grad.addColorStop(0, '#a37b32'); 
            grad.addColorStop(0.3, '#ffe8be'); 
            grad.addColorStop(0.5, '#dfb15b'); 
            grad.addColorStop(0.7, '#ffe8be'); 
            grad.addColorStop(1, '#8c6221'); 
            ctx.fillStyle = grad;
            
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, width / 2 - 1, 0, Math.PI * 2);
            ctx.fill();

            // Sparkle details
            ctx.save();
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, width / 2 - 1, 0, Math.PI * 2);
            ctx.clip();
            for (let i = 0; i < 300; i++) {
                const px = Math.random() * width;
                const py = Math.random() * height;
                const op = Math.random() * 0.2;
                ctx.fillStyle = `rgba(255, 255, 255, ${op})`;
                ctx.fillRect(px, py, 1.2, 1.2);
            }
            ctx.restore();

            // Dash border
            ctx.strokeStyle = 'rgba(125, 26, 41, 0.25)';
            ctx.lineWidth = 1;
            ctx.setLineDash([3, 3]);
            ctx.beginPath();
            ctx.arc(width / 2, height / 2, width / 2 - 6);
            ctx.stroke();
            ctx.setLineDash([]);

            // Draw text
            ctx.fillStyle = '#7d1a29'; // Maroon color text
            ctx.font = '500 8.5px Montserrat, sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.letterSpacing = '1px';
            ctx.fillText('SCRATCH', width / 2, height / 2 - 16);
            
            ctx.font = '300 12px Montserrat, sans-serif';
            ctx.fillText('✦', width / 2, height / 2);
            
            ctx.font = '500 8.5px Montserrat, sans-serif';
            ctx.fillText('TO REVEAL', width / 2, height / 2 + 16);
        };

        drawCover();

        window.addEventListener('resize', () => {
            if (canvas.style.opacity === '0') return;
            width = container.clientWidth;
            height = container.clientHeight;
            canvas.width = width;
            canvas.height = height;
            drawCover();
        });

        let isScratching = false;
        const brushRadius = 15;

        const getCoords = (e) => {
            const rect = canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        const scratch = (x, y) => {
            ctx.globalCompositeOperation = 'destination-out';
            ctx.beginPath();
            ctx.arc(x, y, brushRadius, 0, Math.PI * 2);
            ctx.fill();
        };

        const checkScratchPercentage = () => {
            try {
                const imgData = ctx.getImageData(0, 0, width, height);
                const pixels = imgData.data;
                const totalPixels = pixels.length / 4;
                let clearedPixels = 0;
                
                for (let i = 0; i < pixels.length; i += 16) {
                    if (pixels[i + 3] === 0) {
                        clearedPixels++;
                    }
                }
                
                const percentage = (clearedPixels / ((totalPixels / 4) * 0.785)) * 100;
                if (percentage > 35) {
                    canvas.style.pointerEvents = 'none';
                    canvas.style.opacity = '0';
                    if (hint) {
                        hint.innerText = '✦ Save the Date ✦';
                        hint.style.animation = 'none';
                        hint.style.color = 'var(--primary-crimson)';
                    }
                }
            } catch (e) {
                console.error("Scratch check error", e);
            }
        };

        const startScratch = (e) => {
            isScratching = true;
            const coords = getCoords(e);
            scratch(coords.x, coords.y);
        };

        const moveScratch = (e) => {
            if (!isScratching) return;
            e.preventDefault();
            const coords = getCoords(e);
            scratch(coords.x, coords.y);
        };

        const endScratch = () => {
            if (!isScratching) return;
            isScratching = false;
            checkScratchPercentage();
        };

        canvas.addEventListener('mousedown', startScratch);
        canvas.addEventListener('mousemove', moveScratch);
        window.addEventListener('mouseup', endScratch);

        canvas.addEventListener('touchstart', startScratch, { passive: false });
        canvas.addEventListener('touchmove', moveScratch, { passive: false });
        window.addEventListener('touchend', endScratch);
    }
}
customElements.define('scratch-card', ScratchCard);
