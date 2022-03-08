import { Component } from '@angular/core';
import { SwUpdate } from '@angular/service-worker';
import { ThemeService } from './services/theme/theme.service';
import { TranslationService } from './services/translation/translation.service';
import { environment } from 'src/environments/environment';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackBarComponent } from './components/dialog/snack-bar/snack-bar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
 
export class AppComponent 
{
    public update = false;
    public authenticated = false;
    public inProduction = environment.production;

    constructor(
        private translationService: TranslationService,
        private themeService: ThemeService,
        private snackbar: MatSnackBar,
        private updates: SwUpdate,
        private iconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer)
    {
        this.bootstrapSwUpdates();
        this.bootstrapIconRegistry();
    }

    async ngOnInit(): Promise<void> 
    {
        await this.bootstrapNewUser();
    }

    private async bootstrapNewUser(): Promise<void>
    {
        if(environment.production)
        {
            const isNew = localStorage.getItem("visit") == null;
            const isDark = this.themeService.update.value == 'dark-theme';
            if(isNew && isDark)
            {
                localStorage.setItem("visit", "true");
                
                let message = await this.translationService.get('info.welcome');
                this.snackbar.openFromComponent(SnackBarComponent, 
                {
                    data: `<p>${message}</p>`,
                    verticalPosition: 'top',
                    duration: 10000,
                    panelClass: ['mat-toolbar', 'mat-accent']
                });
            }

            window.addEventListener('beforeunload', (e) => 
            {
                localStorage.removeItem("visit");
            });
        }
    }


    private bootstrapSwUpdates(): void
    {
        this.updates.available.subscribe(event => 
            {
                if(environment.production == false)
                    console.log("spa update subscribed.");
    
                this.update = true;
    
                this.updates.activateUpdate().then(() => document.location.reload());
            });
    }


    private bootstrapIconRegistry(): void
    {
        this.iconRegistry.addSvgIcon('github', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/github.svg'));
        this.iconRegistry.addSvgIcon('add-light', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/add-light.svg'));
        this.iconRegistry.addSvgIcon('add-dark', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/add-dark.svg'));
        this.iconRegistry.addSvgIcon('my-info', this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/info.svg'));
    }

}
