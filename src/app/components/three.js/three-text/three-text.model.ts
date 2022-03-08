
export class TextModel
{
    
    public id: string;
    public sizes: any;
    public time: any;
    public scene: any;
    public renderer: any;
    public camera: any;
    public material: any;
    public materialText: any;

    public animate() 
    {
        let ref: TextModel = window[`txt-${this.id}`];

        window[`textRequestAnimationId-${this.id}`] = requestAnimationFrame(function() {
            ref?.animate();
        });

        ref?.render();

        ref?.renderer.render(ref.scene, ref.camera);
    }

    public render()
    {
        
        // Update objects
        this.time += 0.05;
        if(this.materialText) 
            this.materialText.uniforms.u_time.value = this.time;
        

        this.renderer.render(this.scene, this.camera);
    }
}