
(() => {
    const movements = [];
    const WINDOW_MS = 1000;
    const MIN_DISTANCE = 8;
    const SHAKE_THRESHOLD = 12;

    let lastX = null;
    let lastY = null;
    let lastDirection = null;
    let directionChanges = 0;
    let lastShakeTime = 0;

    document.addEventListener("mousemove", (event) => {
        const now = performance.now();
        const x = event.clientX;
        const y = event.clientY;

        if (lastX !== null) {
            const dx = x - lastX;
            const dy = y - lastY;

            // Ignore tiny movements
            if (Math.hypot(dx, dy) >= MIN_DISTANCE) {
                // Use the dominant axis to track direction
                const direction = Math.abs(dx) > Math.abs(dy)
                    ? (dx > 0 ? "right" : "left")
                    : (dy > 0 ? "down" : "up");

                if (
                    lastDirection !== null &&
                    direction !== lastDirection &&
                    now - lastShakeTime > 0
                ) {
                    directionChanges++;
                }

                lastDirection = direction;
                lastShakeTime = now;

                movements.push({ time: now, x, y });
            }
        }

        lastX = x;
        lastY = y;

        // Remove old movements
        while (
            movements.length &&
            now - movements[0].time > WINDOW_MS
        ) {
            movements.shift();
        }

        if (directionChanges >= SHAKE_THRESHOLD) {
            console.warn("Excessive mouse shaking detected!");

            // Your custom action goes here
            document.dispatchEvent(
                new CustomEvent("mouseShakeDetected", {
                    detail: {
                        directionChanges,
                        windowMs: WINDOW_MS
                    }
                })
            );

            directionChanges = 0;
            lastDirection = null;
            movements.length = 0;
        }
    });
})();