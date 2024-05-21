<script lang="ts">
    import P5 from 'p5-svelte'
    import type { p5, Sketch } from 'p5-svelte';
    import { Vector } from 'p5'
    import { debounce, clamp, min, throttle } from '$lib/utils/utils';
    import { onMount } from 'svelte';
    import { qubits, focusedQubit } from '$lib/stores/qubits';
    import { redrawCables } from '$lib/stores/patching';
    import type { Tweened } from 'svelte/motion';
    
    export let axes: Tweened<number[]>;
    export let i: number;
    let theta: number = 0; // 2
    let phi: number = 0; // 1
    let phase: number = 0; // 0
    export let disabled: boolean = false;
    
    let container: HTMLDivElement
    let p5Instance: p5 | null = null;
    let height: number = 100;
    let radius = height / 3;
    let resize: (...args: any[]) => void;

    onMount(async () => {
        window.addEventListener('resize', resize)
        
        let timeoutID: NodeJS.Timeout;
        const unsubscribeQubits = qubits.subscribe(() => {
            if (!p5Instance) return;
            if (timeoutID) clearTimeout(timeoutID)
            timeoutID = setTimeout(resize, 100)
        })

        // Wait for p5 instance to be created before subscribing to axes
        // Fixes a firefox error where it can't find the renderer
        while (!p5Instance) {
            await new Promise(resolve => setTimeout(resolve, 100));
        }

        const unsubscribeAxes = axes.subscribe(([x,y,z]) => {
            if(!p5Instance) return;
            theta = z
            phi = y
            phase = x
            p5Instance && p5Instance.draw()
        })

        return () => {
            if (timeoutID) clearTimeout(timeoutID)
            window.removeEventListener('resize', resize)
            unsubscribeQubits()
            unsubscribeAxes()
            p5Instance?.remove()
            p5Instance = null
        }
    });

    const handleInstance = (e: CustomEvent<p5>) => {
        p5Instance = e.detail
    }

    const sketch : Sketch = (p5: p5)=> {
        function isWithinCanvas(x: number, y: number) {
            return x > 0 && x < p5.height && y > 0 && y < p5.height
        }

        function getSize()  {
            if (!container) return;
            const dimensions = container.getBoundingClientRect()
            height = min(dimensions.width - 100, 500)
            radius = height / 2.5;
        }

        function handleResize() {
            getSize()
            p5.resizeCanvas(height, height)
            redrawCables()
        }

        p5.mouseIsPressed = false
        p5.mousePressed = e => {
            // @ts-ignore
            const isCanvas = e.target instanceof HTMLCanvasElement
            p5.mouseIsPressed = isCanvas && isWithinCanvas(p5.mouseX, p5.mouseY)
        }
        p5.mouseReleased = e => p5.mouseIsPressed = false

        p5.setup = () => {
            getSize()
            p5.createCanvas(height, height, p5.WEBGL)
            p5.smooth()
            p5.noLoop()

            resize = debounce(handleResize, 100)
        }

        const debouncedMouseDragged = throttle(() => {
            if (!isWithinCanvas(p5.mouseX, p5.mouseY) || !p5.mouseIsPressed) return;

            const setPhase = p5.keyIsPressed && p5.key === 'Shift';

            if (setPhase) {
                phase = clamp(p5.mouseX / (p5.width * 0.95));
            } else {
                phi = clamp(p5.mouseX / (p5.width * 0.95));
                theta = clamp(p5.mouseY / (p5.height * 0.95));
            }

            axes.set([phase, phi, theta])
            focusedQubit.set(i)
            return false;
        }, 25);

        p5.mouseDragged = () => {
            if(disabled) return;
            debouncedMouseDragged();
        };

        p5.draw = () => {
            p5.smooth()
            p5.background('#404040')
            
            const vector = Vector.fromAngles(
                p5.radians(theta * 180), 
                p5.radians(phi * 360), 
                radius
            )

            // sphere
            p5.push()
            p5.rotateY(p5.radians(90))
            p5.ambientMaterial(194);
            let c = p5.color('rgb(209, 206, 199)')
            
            c.setAlpha(50)
            p5.stroke(c)
            p5.strokeWeight(0.25)
            p5.noFill()
            
            // Azimuth
            const cos_y = p5.cos(p5.radians(-phi * 360));
            const sin_y = p5.sin(p5.radians(-phi * 360));
            p5.applyMatrix(cos_y, 0.0, sin_y, 0.0, 0.0, 1.0, 0.0, 0.0, -sin_y, 0.0, cos_y, 0.0, 0.0, 0.0, 0.0, 1.0);

            // Inclination
            const cos_x = p5.cos(p5.radians(-theta * 180));
            const sin_x = p5.sin(p5.radians(-theta * 180));
            p5.applyMatrix(cos_x, sin_x, -sin_x, cos_x, 0, 0);

            // Phase
            const cos_z = p5.cos(p5.radians(phase * 180));
            const sin_z = p5.sin(p5.radians(phase * 180));
            p5.applyMatrix(cos_z, 0.0, sin_z, 0.0, 0.0, 1.0, 0.0, 0.0, -sin_z, 0.0, cos_z, 0.0, 0.0, 0.0, 0.0, 1.0);
            p5.sphere(radius - 2, 20, 20);
            p5.pop()
            
            // Position
            p5.push()
            p5.stroke('white')
            p5.translate(vector.x, vector.y, vector.z)
            p5.sphere(4);
            p5.pop()

            // azimuth ring
            p5.push()
            p5.noFill()
            p5.stroke('#FF695A')
            p5.strokeWeight(4)
            p5.rotateY(p5.radians(90))
            p5.rotateY(p5.radians(phi * 360))
            p5.circle(0, 0, (radius * 2));
            p5.pop()

            // inclination ring
            p5.push()
            p5.noFill()
            p5.stroke('#E5007F')
            p5.strokeWeight(4)
            p5.rotateX(p5.radians(90))
            p5.translate(0, 0, -vector.y)
            p5.circle(0, 0, (p5.sin(p5.radians(theta * 180)) * radius * 2));
            p5.pop()
        }
    }

</script>

<div 
    class="qubit"
    class:disabled={disabled}
    bind:this={container}
>
    <P5 {sketch} on:instance={handleInstance} />
</div>

<style lang="scss">
    .disabled {
        cursor: not-allowed;
    }
    .qubit {
        height: 100%;
        width: 100%;
        display: flex;
        overflow: hidden;
        align-items: center;
        justify-content: center;
        cursor: move;
    }
</style>