<script lang="ts">
    import P5 from 'p5-svelte'
    import type { p5, Sketch } from 'p5-svelte';
    export let size: number;

    export let x: number, y: number, z: number;

    const sketch : Sketch = (p5: p5)=> {
        const radius = 150
        p5.setup = () => {
            p5.createCanvas(size, size, p5.WEBGL)
            
        }
        p5.resize = () => p5.resizeCanvas(size, size)

        p5.draw = () => {
            p5.smooth()

            const cos_x = p5.cos(-x * 180);
            const sin_x = p5.sin(-x * 180);
            const cos_y = p5.cos(y * 180);
            const sin_y = p5.sin(y * 180);
            const cos_z = p5.cos(z * 180);
            const sin_z = p5.sin(z * 180);

            p5.angleMode(p5.DEGREES)
            p5.rotateY(-112.5)
            p5.background('#404040')

            // sphere
            p5.push()
            p5.noFill()
            let c = p5.color('rgb(255,255,255)')
            c.setAlpha(20)
            p5.stroke(c)
            p5.sphere(radius - 1, 20, 20);
            p5.pop()

            // inclination circle
            p5.push()
            p5.noFill()
            p5.stroke('#FF695A')
            p5.strokeWeight(4)
            p5.applyMatrix(cos_x, 0.0, sin_x, 0.0, 0.0, 1.0, 0.0, 0.0, -sin_x, 0.0, cos_x, 0.0, 0.0, 0.0, 0.0, 1.0);
            p5.circle(0, 0, radius * 2 + 4);
            p5.pop()

            // azimuth circle
            p5.push()
            p5.noFill()
            p5.stroke('#E5007F')
            p5.strokeWeight(4)
            p5.rotateX(90)
            const yPos = radius - y * (radius * 2)
            p5.translate(0, 0, yPos)
            p5.circle(0, 0, p5.sin(y * 180) * (radius * 2) + 4);
            p5.pop()
            
            
            // Azimuth
            p5.applyMatrix(cos_x, 0.0, sin_x, 0.0, 0.0, 1.0, 0.0, 0.0, -sin_x, 0.0, cos_x, 0.0, 0.0, 0.0, 0.0, 1.0);
            // Inclination
            p5.applyMatrix(cos_y, sin_y, -sin_y, cos_y, 0, 0);
            // Phase
            p5.applyMatrix(cos_z, 0.0, sin_z, 0.0, 0.0, 1.0, 0.0, 0.0, -sin_z, 0.0, cos_z, 0.0, 0.0, 0.0, 0.0, 1.0);

            // position
            p5.translate(0, -radius - 2.5);
            p5.stroke('white')
            p5.sphere(4);


        }
    }

</script>
  
<P5 {sketch} />