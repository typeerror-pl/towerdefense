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
        circle.radius += 10 * delta;

        // rysowanie gry
        ctx.save();
        ctx.fillStyle = 'red';

        points.forEach(point => {
            ctx.beginPath();
            ctx.arc(point.x, point.y, circle.radius, 0, Math.PI * 2);
            ctx.fill();
        });
        
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

// obsługa zdarzeń
type Coords = 
{
    x: number;
    y: number;
}

const points: Coords[] = [];

const onMouseClick = (e: MouseEvent) => {
    const mouseCoords = getMouseCoords(e);

    points.push(mouseCoords);
};

const getMouseCoords = (e: MouseEvent): Coords => ({ x: e.pageX, y: e.pageY });

canvas.addEventListener('mousedown', onMouseClick);