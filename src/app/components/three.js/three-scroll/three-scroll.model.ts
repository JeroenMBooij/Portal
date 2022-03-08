
import { BehaviorSubject } from 'rxjs';
import * as THREE from 'three';

export class ScrollModel
{    
    public scene: THREE.Scene;
    public renderer: THREE.WebGLRenderer;
    public camera: THREE.PerspectiveCamera;
    public position: number;
    public oldPosition: number;
    public positionUpdate: BehaviorSubject<number>;
    public attractMode: boolean;
    public attractTo: number;
    public speed: number;   
    public reelElements: any;
    public objs: any;
    public meshes: any;    
    public width: any;
    public height: any;
    public mobile = false;

    public animate(): void
    {
        let ref: ScrollModel = (window as any).scrollModel;

        ref.sketchPosition();

        (window as any).scrollAnimationId = window.requestAnimationFrame(ref.animate);
    }


    public sketchPosition()
    {
        this.render();

        if (this.attractMode) 
            this.position += -(this.position - this.attractTo) * 0.04;
        else
        {
            this.position -= this.speed;
            this.speed *= 0.8;

            if(this.position > ((this.reelElements.length - 1)) + 0.4)
                this.position = ((this.reelElements.length - 1)) + 0.4;
            if(this.position < -0.4)
                this.position = -0.4;
        }
            

        this.objs.forEach((o, i) => {
            o.distance = Math.min(Math.abs(this.position - i), 1);
            o.distance = 1 - o.distance ** 2;
            this.reelElements[i].style.transform = `scale(${1 + 0.4 * o.distance})`;
            let scale = 1 + 0.2 * o.distance;

            this.meshes[i].position.y = i * 1.2 - this.position * 1.2;
            this.meshes[i].scale.set(scale, scale, scale);
            this.meshes[i].material.uniforms.distanceFromCenter.value = o.distance;
        });

        let rounded = Math.round(this.position);
        let diff = rounded - this.position;

        if(this.attractMode === false)
            this.position += Math.sign(diff) * Math.pow(Math.abs(diff), 0.7) * 0.035;

        if(Math.round(this.position) != this.oldPosition)
        {
            this.oldPosition = Math.round(this.position);
            this.positionUpdate?.next(this.oldPosition);
        }
    }


    private render(): void
    {        
        this.renderer.render(this.scene, this.camera);
    }
    
}