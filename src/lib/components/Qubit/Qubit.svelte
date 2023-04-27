<script lang="ts">
    import P5 from 'p5-svelte'
    import type { p5, Sketch } from 'p5-svelte';
    import { Vector } from 'p5'
    import { axes } from '$lib/stores/qubit';
    import { fullscreen } from '$lib/stores/global';
    import { onMount } from 'svelte';
    
    let p5Instance: p5;
    let radius: number;
    let height: number = 500;

    axes.subscribe(() => p5Instance && p5Instance.draw())
    fullscreen.subscribe((fs: boolean) => {
        if(!p5Instance) return

        height = fs ? window.innerHeight * 0.75 : 500
        radius = height / 3;
        p5Instance.resizeCanvas(height, height)
        p5Instance.redraw()
    })

    const handleInstance = (e: CustomEvent<p5>) => {
        p5Instance = e.detail
    }

    onMount(() => {
        radius = height / 3;
    })

    const sketch : Sketch = (p5: p5)=> {

        p5.setup = () => {
            p5.createCanvas(height, height, p5.WEBGL)
            p5.smooth()
            p5.noLoop()
        }

        p5.draw = () => {
            const phi = $axes[1].value
            const theta = $axes[2].value
            const phase = $axes[0].value
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
    <div class="qubit" >
        <P5 {sketch} on:instance={handleInstance} />
    </div>

<style lang="scss">
    .qubit {
        height: 100%;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
    }
    canvas { 
        // max-width: 50vw;
        contain: paint;
    }
</style>