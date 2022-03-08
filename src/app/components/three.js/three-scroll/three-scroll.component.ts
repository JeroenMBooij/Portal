import { AfterViewInit, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import gsap from 'gsap';
import { BehaviorSubject } from 'rxjs';
import * as THREE from 'three';

import fragment from "./shaders/fragment.glsl";
import vertex from "./shaders/vertex.glsl";
import { ScrollModel } from './three-scroll.model';


@Component({
  selector: 'three-scroll',
  templateUrl: './three-scroll.component.html',
  styleUrls: ['./three-scroll.component.scss']
})
export class ThreeScrollComponent implements OnInit, AfterViewInit
{
    @Input() imageUrls: string[]
    @Input() position: BehaviorSubject<number>

    public scrollModel: ScrollModel;

    public groups: any;
    public materials: any;
    public material: any;

    public reelDisplay: any;
    public oldIndex: number;
    public touchPos: number;



    @ViewChild('reelContainer') reelContainerRef: ElementRef
    get container(): HTMLElement { return this.reelContainerRef.nativeElement }
    private canvas: HTMLCanvasElement;

    constructor() { }

    ngOnInit(): void {
    }

    async ngAfterViewInit(): Promise<void>
    {
        this.scrollModel = new ScrollModel();
        await this.bootstrap();
        this.setProperties();
        this.setEventHandlers();

        (window as any).scrollModel = this.scrollModel;

        this.scrollModel.animate();
    }

    ngOnDestroy(): void
    {
        window.cancelAnimationFrame((window as any).scrollAnimationId);
    }

    
    

    private setProperties(): void
    {
        this.scrollModel.attractMode = false;
        this.scrollModel.attractTo = 3;
        this.scrollModel.speed = 0;
        this.oldIndex = 0;

        this.reelDisplay = {
            rotations: this.groups.map((e) => e.rotation),
            positions: this.groups.map((e) => e.position)
        };
        
        this.scrollModel.reelElements = document.querySelectorAll(".reel-provider") as NodeListOf<HTMLImageElement>;;
        this.scrollModel.position = this.scrollModel.reelElements.length - 1;
        this.scrollModel.oldPosition = this.scrollModel.position;
        this.scrollModel.positionUpdate = this.position;
        this.scrollModel.objs = Array(this.scrollModel.reelElements.length).fill({ distance: 0 });

        this.scrollModel.objs = Array(this.scrollModel.reelElements.length).fill({ distance: 0 });

        this.switchScreen();
    }

    private setEventHandlers(): void
    {
        this.position.subscribe(position =>
        {
            this.scrollModel.position = position;
        })

        this.canvas.addEventListener("wheel", (e) => 
        {
            e.preventDefault();
            this.scrollModel.speed += e.deltaY * 0.0003;
        });

        this.touchPos = 0;
        document.body.ontouchstart = (e) => 
        {
            this.touchPos = e.changedTouches[0].clientY;
        };

        document.body.ontouchmove = (e) => 
        {
            let newTouchPos = e.changedTouches[0].clientY;
            
            this.scrollModel.speed += (newTouchPos - this.touchPos) * 0.00003;
        };

        window.addEventListener("resize", (e) =>
        {  
            this.switchScreen();
        
            this.resize();
        });
    }

    private async bootstrap(): Promise<void>
    {
        this.scrollModel.scene = new THREE.Scene();
        this.scrollModel.width = this.container.offsetWidth;
        this.scrollModel.height = this.container.offsetHeight;
        this.scrollModel.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        });

        this.scrollModel.renderer.setPixelRatio(window.devicePixelRatio);
        this.scrollModel.renderer.setSize(this.scrollModel.width, this.scrollModel.height);
        this.scrollModel.renderer.physicallyCorrectLights = true;
        this.scrollModel.renderer.outputEncoding = THREE.sRGBEncoding;

        this.canvas = this.scrollModel.renderer.domElement;

        this.container.appendChild(this.canvas);

        this.scrollModel.camera = new THREE.PerspectiveCamera(
            70,
            window.innerWidth / window.innerHeight,
            0.001,
            1000
        );

        this.scrollModel.camera.position.set(0, 0, 2);
        this.scrollModel.camera.aspect = this.scrollModel.width / this.scrollModel.height;

        this.addObjects();
        this.resize();
        this.groups = [];
        this.materials = [];
        this.scrollModel.meshes = [];
        await this.handleImages();
    }

    private async handleImages(): Promise<void>  
    {
        let images = document.querySelectorAll(".scroll-img") as NodeListOf<HTMLImageElement>;

        for (let i = 0; i < images.length; i++)
        {
            let im: HTMLImageElement = images[i];
            await new Promise((resolve, reject) => 
            {
                im.onload = () => resolve(true);
                im.onerror = reject;
            });

            let mat = this.material.clone();
            this.materials.push(mat);
            let group = new THREE.Group();

            mat.uniforms.texture1.value = new THREE.Texture(im);
            mat.uniforms.texture1.value.needsUpdate = true;

            let geo = new THREE.PlaneBufferGeometry(1.5, 1, 20, 20);
            let mesh = new THREE.Mesh(geo, mat);
            group.add(mesh);
            this.groups.push(group);
            this.scrollModel.scene.add(group);
            this.scrollModel.meshes.push(mesh);
            mesh.position.x = 0.1;
            mesh.position.y = i * 1.2;
            mesh.position.z = 0.5;

            group.rotation.x = -0.3;
            group.rotation.y = -0.4;
            group.rotation.z = -0.1;
        }
    }

    private resize(): void 
    {
        if( this.container.offsetWidth > 0)
        {
            this.scrollModel.width = this.container.offsetWidth;
            this.scrollModel.height = this.container.offsetHeight;
            this.scrollModel.renderer.setSize(this.scrollModel.width, this.scrollModel.height);
            this.scrollModel.camera.aspect = this.scrollModel.width / this.scrollModel.height;

            let imageAspect = 853 / 1280;
            let a1;
            let a2;
            if (this.scrollModel.height / this.scrollModel.width > imageAspect) 
            {
                a1 = (this.scrollModel.width / this.scrollModel.height) * imageAspect;
                a2 = 0.5;
            } 
            else 
            {
                a1 = 1;
                a2 = this.scrollModel.height / this.scrollModel.width / imageAspect;
            }

            this.material.uniforms.resolution.value.x = this.scrollModel.width;
            this.material.uniforms.resolution.value.y = this.scrollModel.height;
            this.material.uniforms.resolution.value.z = a1;
            this.material.uniforms.resolution.value.w = a2;

            this.scrollModel.camera.updateProjectionMatrix();
        }
    }

    private addObjects(): void 
    {
        this.material = new THREE.ShaderMaterial({
            extensions: {
                derivatives: true,
            },
            side: THREE.DoubleSide,
            uniforms: {
                time: { value: 0 },
                distanceFromCenter: { value: 0 },
                texture1: { value: null },
                resolution: { value: new THREE.Vector4() },
                uvRate1: { value: new THREE.Vector2(1, 1) },
            },
            transparent: true,
            vertexShader: vertex,
            fragmentShader: fragment
        });
    }

    private switchScreen()
    {
        if(window.innerWidth < 1150)
        {
            gsap.to(this.reelDisplay.rotations, 
            {
                duration: 0.3,
                x: -0.7,
                y: 0,
                z: 0,
            });

            gsap.to(this.reelDisplay.positions, 
            {
                duration: 0.3,
                x: -0.1
            });

            this.scrollModel.mobile = true;
        }
        else if (this.scrollModel.mobile)
        {
            gsap.to(this.reelDisplay.rotations, 
            {
                duration: 0.3,
                x: -0.3,
                y: -0.5,
                z: -0.1
            });

            gsap.to(this.reelDisplay.positions,   
            {
                duration: 0.3,
                x: 0
            }); 

            this.scrollModel.mobile = false; 
        }
    }

}
