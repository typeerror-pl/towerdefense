// typy na potrzeby gry
type Coords = 
{
    x: number;
    y: number;
}

type Radius =
{
    radius: number;
}

type Entity = Coords & Radius

type Movable = 
{
    vx: number;
    vy: number;
}

type Level =
{
    width: number;
    height: number;
}

type Tower = 
{
    cost: number;
    range: number;
    fireRatio: number;
    lastShootAt: number;
} & Entity

type Enemy = 
{
    hitPoints: number;
    reward: number;
    speed: number;
} & Entity & Movable

type Bullet =
{
    firedFrom: Tower;
    target: Enemy;
} & Entity & Movable

type GameState =
{
    hitPoints: number;
    cash: number;
    towers: Tower[];
    enemies: Enemy[];
    bullets: Bullet[];
}


// przygotowanie płótna do rysowania oraz pobranie jego kontekstu
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

// utworzenie poziomu
const level: Level =
{
    width: window.innerWidth,
    height: window.innerHeight,
};

// utworzenie stanu gry
const gameState: GameState = 
{
    cash: 1000,
    hitPoints: 10,
    towers: [],
    enemies: [],
    bullets: [],
};

// aktualne pozycja myszy
const mouse: Coords = { x: 0, y: 0 };

// ustawienie wielkości obszaru gry
canvas.width = level.width;
canvas.height = level.height;

// dodanie płótna do elementu body
document.body.appendChild(canvas);

// aktualizacja oraz rysowanie stanu gry
let lastTime = performance.now();

const makeMainLoop = (ctx: CanvasRenderingContext2D, gameState: GameState, level: Level) => {
    const frame = (currentTime: number) => {

        // obliczenie delty pomiędzy dwoma klatkami
        const delta = (currentTime - lastTime) / 1000;
        lastTime = currentTime;

        // odrysowanie stanu gry
        redrawGameState(gameState, level, ctx);

        // ponowne wywołanie aktualizacji stanu
        requestAnimationFrame(frame);

    };
    
    return frame;
};

if (context !== null) {
    const update = makeMainLoop(context, gameState, level);

    requestAnimationFrame(update);
}

// rysowanie
const clearScreen = (ctx: CanvasRenderingContext2D, level: Level): void => {
    ctx.clearRect(0, 0, level.width, level.height);
}

const drawCircle = (ctx: CanvasRenderingContext2D, circle: Entity, color: string): void => {
    ctx.save();
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
};

const drawUIOverlay = (ctx: CanvasRenderingContext2D, gameState: GameState): void => {
    ctx.save();
    ctx.font = '24px Helvetica';
    ctx.textBaseline = 'top';
    ctx.textAlign = 'left';
    ctx.fillText(provideGameStateText(gameState), 0, 0);
    ctx.restore();
};

const drawTowerOverlay = (ctx: CanvasRenderingContext2D, gameState: GameState, coords: Coords): void => {
    const newTower = provideBasicTower();
    newTower.x = coords.x;
    newTower.y = coords.y;

    const canPlace = canPlaceTower(gameState, newTower);
    const color = canPlace ? 'lightgreen' : '#ff7675';

    drawCircle(ctx, newTower, color);
};

const redrawGameState = (gameState: GameState, level: Level, ctx: CanvasRenderingContext2D): void => {
    // wyczyszczenie ekranu
    clearScreen(ctx, level);

    // wieżyczki
    gameState.towers.forEach(tower => drawCircle(ctx, tower, 'lightblue'));

    // new tower overlay
    drawTowerOverlay(ctx, gameState, mouse);

    // informacje o stanie
    drawUIOverlay(ctx, gameState);
};

// obsługa zdarzeń
const getMouseCoords = (e: MouseEvent): Coords => ({ x: e.pageX, y: e.pageY });

const onMouseMove = (e: MouseEvent) => {
    const mouseCoords = getMouseCoords(e);

    mouse.x = mouseCoords.x;
    mouse.y = mouseCoords.y;
};

const onMouseClick = (e: MouseEvent) => {
    const mouseCoords = getMouseCoords(e);

    const newTower = provideBasicTower();
    newTower.x = mouseCoords.x;
    newTower.y = mouseCoords.y;

    placeTower(gameState, newTower);
};

canvas.addEventListener('mousedown', onMouseClick);
canvas.addEventListener('mousemove', onMouseMove);

// funkcje na potrzeby gry
const distanceBetween = (p1: Coords, p2: Coords): number => {
    const delta: Coords = { x: p1.x - p2.x, y: p1.y - p2.y };

    return Math.sqrt(delta.x * delta.x + delta.y * delta.y);
}

const canPlaceTower = (gameState: GameState, newTower: Tower): boolean => {
    if (gameState.cash < newTower.cost) {
        return false;
    }

    const isPlaceOccupied = gameState.towers.some(otherTower => {
        const distance = distanceBetween(newTower, otherTower);

        return distance < (newTower.radius + otherTower.radius);
    });

    return !isPlaceOccupied;
}

const placeTower = (gameState: GameState, newTower: Tower): void => {
    if (!canPlaceTower(gameState, newTower)) {
        return;
    }

    gameState.cash -= newTower.cost;
    gameState.towers.push(newTower);
}

const provideBasicTower = (): Tower => {
    const basicTower: Tower = 
    {
        cost: 50,
        range: 300,
        fireRatio: 0.4,
        radius: 16,
        lastShootAt: 0,
        x: 0,
        y: 0,
    };

    return basicTower;
};

const provideGameStateText = (gameState: GameState): string => `HitPoints: ${gameState.hitPoints}, Cash: ${gameState.cash}`;