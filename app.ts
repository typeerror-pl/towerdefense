// przygotowanie płótna do rysowania oraz pobranie jego kontekstu
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// rysowanie po kontekście płótna
function draw(ctx: CanvasRenderingContext2D): void {

    ctx.fillStyle = 'red';
    ctx.fillRect(100, 100, 100, 100);

    ctx.fillStyle = 'green';
    ctx.fillRect(300, 100, 100, 100);

    ctx.fillStyle = 'blue';
    ctx.fillRect(500, 100, 100, 100);

}

if (context !== null) {
    draw(context);
}

// dodanie płótna do elementu body
document.body.appendChild(canvas);