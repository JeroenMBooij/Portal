import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { ProjectModel } from './Project.model';

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss']
})
export class ProjectsComponent implements OnInit 
{
    
    public projectIndex: BehaviorSubject<number>;
    public projects: ProjectModel[];
    public projectImages: string[];
    public currentProject: ProjectModel;

    constructor(
        private translationService: TranslationService,
        private router: Router,
        private changeDectorRef: ChangeDetectorRef)      
    {
    }

    async ngOnInit(): Promise<void> 
    {
        await this.initProjects();

        this.projectIndex = new BehaviorSubject(this.projects.length - 1);

        this.projectIndex.subscribe(index => 
        {
            this.currentProject = this.projects[index];
            this.changeDectorRef.detectChanges();
        });

        this.translationService.update.subscribe(async update => 
        {
            await this.initProjects();
            this.currentProject = this.projects[this.projectIndex.value];
        });
    }

    public switchProject(title: string)
    {
        this.projectIndex.next(this.projects.findIndex(project => project.title == title));
    }


    public openGithubProject(): void
    {
        window.open(this.currentProject.githubUrl, '_blank').focus();
    }

    private async initProjects(): Promise<void>
    {
        let imageRootUrl = './assets/images/projects';

        let authProject = new ProjectModel();
        authProject.title = await this.translationService.get('projects.auth.title');
        authProject.content = await this.translationService.get('projects.auth.content');
        authProject.imageUrl = `${imageRootUrl}/auth.png`;
        authProject.githubUrl = 'https://github.com/JeroenMBooij/JWT-SSO-Authentication';
        authProject.techStack = [".NET 5.0 Web Api", "Swagger", "MSSQL", "Docker"];

        let taskProject = new ProjectModel();
        taskProject.title = await this.translationService.get('projects.task.title');
        taskProject.content = await this.translationService.get('projects.task.content');
        taskProject.imageUrl = `${imageRootUrl}/task.png`;
        taskProject.githubUrl = 'https://github.com/JeroenMBooij/Real-Time-Task-Manager';
        taskProject.techStack = ["Angular", "RXJS", "Firebase", "Material Theme", "Karma & Jasmine", "Protractor e2e"];

        let voiceProject = new ProjectModel();
        voiceProject.title = await this.translationService.get('projects.voice.title');
        voiceProject.content = await this.translationService.get('projects.voice.content');
        voiceProject.imageUrl = `${imageRootUrl}/voice.png`;
        voiceProject.githubUrl = 'https://github.com/JeroenMBooij/Voice-Control-API-Manager';
        voiceProject.techStack = ["Node-TS", "MongoDB", "Mongoose", "Express", "Swagger", "Mocha", "Chai.js", "TSOA"];

        let emailProject = new ProjectModel();
        emailProject.title = await this.translationService.get('projects.email.title');
        emailProject.content = await this.translationService.get('projects.email.content');
        emailProject.imageUrl = `${imageRootUrl}/email.png`;
        emailProject.githubUrl = 'https://github.com/JeroenMBooij/Email-Service';
        emailProject.techStack = [".NET 5.0", "Mailkit", "Swagger", "Docker"];

        let deeplearningProject = new ProjectModel();
        deeplearningProject.title = await this.translationService.get('projects.deeplearning.title');
        deeplearningProject.content = await this.translationService.get('projects.deeplearning.content');
        deeplearningProject.imageUrl = `${imageRootUrl}/deeplearning.png`;
        deeplearningProject.githubUrl = 'https://colab.research.google.com/drive/16-2RFIBQ-y21aDFI6yFODOpm-GVb44J_#scrollTo=M0v8NLhjnCjf';
        deeplearningProject.techStack = ["Python", "Pandas", "Keras", "OpenCV"];
        
        let didacProject = new ProjectModel();
        didacProject.title = await this.translationService.get('projects.didac.title');
        didacProject.content = await this.translationService.get('projects.didac.content');
        didacProject.imageUrl = `${imageRootUrl}/didac.png`;
        didacProject.githubUrl = 'https://github.com/JeroenMBooij/Teacher-Didac-App';
        didacProject.techStack = ["Kubernetes", ".NET 5.0", "Angular", "Django", "RXJS", "Firebase", "Three.js", "Monaco Editor", "Hangfire (task scheduler)"];

        this.projects = [
            didacProject,
            deeplearningProject,
            emailProject,
            voiceProject,
            taskProject,
            authProject
        ];

        this.projectImages = this.projects.map(project => project.imageUrl);
        
    }


}
