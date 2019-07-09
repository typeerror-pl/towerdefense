// przygotowanie płótna do rysowania oraz pobranie jego kontekstu
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const circle = {
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
    radius: 1,
};

// aktualizacja oraz rysowanie stanu gry
let lastTime = performance.now();

const makeMainLoop = (ctx: CanvasRenderingContext2D) => {
    const frame = (currentTime: number) => {

        // obliczenie delty pomiędzy dwoma klatkami
        const delta = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        // przeliczenia logiki gry
        circle.radius += 20 * delta;

        // rysowanie gry
        ctx.save();
        ctx.fillStyle = 'red';

        ctx.beginPath();
        ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // ponowne wywołanie aktualizacji stanu
        requestAnimationFrame(frame);

    };
    
    return frame;
};

if (context !== null) {
    const update = makeMainLoop(context);

    requestAnimationFrame(update);
}

// dodanie płótna do elementu body
document.body.appendChild(canvas);