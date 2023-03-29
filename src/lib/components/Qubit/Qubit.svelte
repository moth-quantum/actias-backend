<script lang="ts">
    import P5 from 'p5-svelte'
    import type { p5, Sketch } from 'p5-svelte';
    import { Vector } from 'p5'
    export let size: number;

    export let x: number, y: number, z: number;

    const sketch : Sketch = (p5: p5)=> {
        const radius = 150

        p5.setup = () => {
            p5.createCanvas(size, size, p5.WEBGL)
            p5.smooth()
        }
        p5.resize = () => p5.resizeCanvas(size, size)

        p5.draw = () => {
            p5.smooth()
            p5.background('#404040')

            let locX = -p5.width / 4;
            let locY = 0

            p5.ambientLight(60, 60, 60);
            p5.pointLight(255, 255, 255, locX, locY, 100);
            
            const vector = Vector.fromAngles(p5.radians(y * 180), p5.radians(x * 180), radius)

            // sphere
            p5.push()
            // p5.noFill()
            p5.ambientMaterial(194);
            let c = p5.color('rgb(255,255,255)')
            c.setAlpha(10)
            p5.stroke(c)
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
            p5.rotateY(p5.radians(x * 180))
            p5.circle(0, 0, (radius * 2));
            p5.pop()

            // inclination ring
            p5.push()
            p5.noFill()
            p5.stroke('#E5007F')
            p5.strokeWeight(4)
            p5.rotateX(p5.radians(90))
            p5.translate(0, 0, -vector.y)
            p5.circle(0, 0, (p5.sin(p5.radians(y * 180)) * radius * 2));
            p5.pop()
        }
    }

</script>
  
<P5 {sketch} />