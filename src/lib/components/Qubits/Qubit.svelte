<script lang="ts">
    import P5 from 'p5-svelte'
    import type { p5, Sketch } from 'p5-svelte';
    import { Vector } from 'p5'
    import { qubits } from '$lib/stores/qubits';
    import { clamp } from '../../utils/utils';
    import { debounce } from '$lib/utils/utils';
    
    export let size: 'sm' | 'md' | 'lg' = 'md';
    export let phase: number = 0;
    export let phi: number = 0;
    export let theta: number = 0;
    let p5Instance: p5;
    let height: number = 500;
    $: radius = height / 3;

    qubits.subscribe(() => {
        if(!p5Instance) return

        // TODO: only redraw when the axes on a particular qubit move
        p5Instance.draw()
    })

    const handleInstance = (e: CustomEvent<p5>) => {
        p5Instance = e.detail
    }

    const sketch : Sketch = (p5: p5)=> {
        function isWithinCanvas(x: number, y: number) {
            return x > 0 && x < p5.height && y > 0 && y < p5.height
        }
        p5.setup = () => {
            p5.createCanvas(height, height, p5.WEBGL)
            p5.smooth()
            p5.noLoop()
        }

        const debouncedMouseDragged = debounce(() => {
            if (!isWithinCanvas(p5.mouseX, p5.mouseY)) return;

            const setPhase = p5.keyIsPressed && p5.key === 'Shift';

            if (setPhase) {
                phase = clamp(p5.mouseX / (p5.width * 0.95));
            } else {
                phi = clamp(p5.mouseX / (p5.width * 0.95));
                theta = clamp(p5.mouseY / (p5.height * 0.95));
            }

            return false;
        }, 10);

        p5.mouseDragged = () => {
            debouncedMouseDragged();
        };

        p5.draw = () => {
            p5.smooth()
            p5.background('#404040')
            
            const vector = Vector.fromAngles(p5.radians(theta * 180), p5.radians(phi * 180), radius)

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
            const cos_y = p5.cos(p5.radians(-phi * 180));
            const sin_y = p5.sin(p5.radians(-phi * 180));
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
            p5.rotateY(p5.radians(phi * 180))
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
    <div class="qubit qubit--{size}">
        <P5 {sketch} on:instance={handleInstance} />
    </div>

<style lang="scss">
    .qubit {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 2rem;
        &--md {
            transform: scale(0.75);
        }

        &--sm {
            transform: scale(0.5);
        }
    }
    canvas { 
        // max-width: 50vw;
        contain: paint;
    }
</style>