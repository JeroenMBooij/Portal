import { AfterViewInit, Component, ElementRef, Input, OnInit, SimpleChange, ViewChild } from '@angular/core';
import * as THREE from 'three';
import {v4 as uuidv4} from 'uuid';

import createGeometry from './files/three-bmfont-text';
import vshader from './shaders/vertex.glsl';
import fshader from './shaders/fragment.glsl';

import manifold from './files/manifold';
import fontTexture from './files/manifold.png';
import gradientTexture from './files/gradient.png';
import { TextModel } from './three-text.model';


@Component({
  selector: 'three-text',
  templateUrl: './three-text.component.html',
  styleUrls: ['./three-text.component.scss']
})
export class ThreeTextComponent implements OnInit, AfterViewInit 
{
    @Input()
    public value: string;

    @Input()
    public fontSize: number;

    @Input()
    public fontColor: number;

    @ViewChild('textCanvas') canvasRef: ElementRef
    get canvas(): HTMLCanvasElement { return this.canvasRef.nativeElement }

    public model: TextModel;
    
    constructor() 
    { 
        this.createModel();
    }

    ngOnInit(): void {
    }
    
    ngAfterViewInit(): void
    {
        this.startAnimation();
    }

    ngOnDestroy(): void
    {
        this.stopAnimation();
    }

    ngOnChanges(changes: SimpleChange) 
    {
        let propKey = Object.keys(changes)[0];

        switch(propKey)
        {
            case 'fontColor':
                if(this.model.materialText)
                {
                    this.stopAnimation();
                    this.startAnimation();
                }
                break;
        }
        
    }

    private createText(text: string, colorHex: number): void
    {
        new THREE.TextureLoader().load(fontTexture, (result) => 
        {
            this.model.material = this.createShader();
            this.setText(result, text, colorHex);
        });
    }

    private setText(textureResult, postsign, colorHex): void
    {
        let geom: any = createGeometry({
            text: postsign,
            font: manifold,
            align: 'center',
            flipY: textureResult.flipY
        });
    
        this.model.materialText = new THREE.ShaderMaterial({
            uniforms: {
                u_time: { value: this.model.time },
                u_gradientMap: { value: new THREE.TextureLoader().load(gradientTexture) },
                u_map: { value: textureResult },
                u_color: { value: new THREE.Color(colorHex) },
            },
            vertexShader: vshader,
            fragmentShader: fshader,
            side: THREE.DoubleSide,
            transparent: true,
        });
    
        let text = new THREE.Mesh(geom, this.model.materialText);
        text.scale.set(0.04, -0.04, 1);
        text.position.set(-13.5, -0.7, 2.5);

        this.model.scene.add(text)
    }

    private createShader(): THREE.ShaderMaterial
    {
        return new THREE.ShaderMaterial({
            extensions: {
                derivatives: true
            },
            side: THREE.DoubleSide,
            depthTest: false,
            depthWrite: false,
            transparent: true
        });
    }

    private createModel(): void
    {
        this.model = new TextModel();
        this.model.id = uuidv4();
        this.model.time = 0;
    }

    private bootstrap(): void
    {        

        this.model.sizes = {
            width: this.canvas.parentElement.clientWidth,
            height: this.canvas.parentElement.clientHeight,
            offsetY: this.canvas.getBoundingClientRect().top,
            offsetX: this.canvas.getBoundingClientRect().left
        }

        this.model.scene = new THREE.Scene();
        
        this.model.renderer = this.createRenderer(this.canvas, this.model.sizes);
        
        this.model.camera = this.createCamera(this.model.sizes);
        this.model.scene.add(this.model.camera);

        this.setupLights(this.model.scene);
        this.setInteractionEvents();
    }


    private setInteractionEvents(): void
    {
        window.addEventListener('resize', () =>
        {
            this.canvas.parentElement.style.height
            // Update sizes
            this.model.sizes.width = this.canvas.parentElement.clientWidth;
            this.model.sizes.height = this.canvas.parentElement.clientHeight;
            this.model.sizes.offsetX = this.canvas.getBoundingClientRect().left;
            this.model.sizes.offsetY = this.canvas.getBoundingClientRect().top;

            // Update camera
            this.model.camera.aspect = this.model.sizes.width / this.model.sizes.height;
            this.model.camera.updateProjectionMatrix();

            // Update materialText.uniforms.viewport
            this.model.materialText.uniforms.u_viewport = { type: 'v2', value: new THREE.Vector2(this.model.sizes.width, this.model.sizes.height) }


            // Update renderer
            this.model.renderer.setSize(this.model.sizes.width, this.model.sizes.height);
            this.model.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        });

    }

    private createRenderer(canvas, sizes): THREE.WebGLRenderer
    {
        let renderer = new THREE.WebGLRenderer({
            canvas: canvas,
            alpha: true
        });
        
        renderer.setSize(sizes.width, sizes.height);
        
        return renderer;
    }

    private createCamera(sizes): THREE.PerspectiveCamera
    {
        let camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 5;

        return camera;
    }

    private setupLights(scene): void
    {
        let pointLight = new THREE.PointLight(0xffffff, 1);
        pointLight.position.x = -0.8;
        pointLight.position.y = -8.8;
        pointLight.position.z = 9.7;
        scene.add(pointLight);
    }

    private startAnimation(): void
    {
        this.createModel();
        this.bootstrap();
        this.createText(this.value, this.fontColor);

        window[`txt-${this.model.id}`] = this.model;
        this.model.animate();
    }

    private stopAnimation(): void
    {
        window.cancelAnimationFrame(window[`roboRequestAnimationId-${this.model.id}`]);
        delete window[`txt-${this.model.id}`];
    }

}

