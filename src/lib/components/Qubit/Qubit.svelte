<script>
    import P5 from 'p5-svelte'

    const sketch = (p5) => {
        p5.setup = () => {
            p5.createCanvas(400, 400)
        }
        p5.draw = () => {
            p5.background(220)
            p5.ellipse(p5.mouseX, p5.mouseY, 20, 20)
        }
    }
</script>
  
<P5 {sketch} />