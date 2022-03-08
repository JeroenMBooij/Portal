import { Component, OnInit, ChangeDetectionStrategy  } from '@angular/core';
import { Router } from '@angular/router';
import { revealAnimation } from 'src/app/common/animations/reveal.animation';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { TranslationService } from 'src/app/services/translation/translation.service';


@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [revealAnimation]
})
export class HomeComponent implements OnInit {

    public username: string;
    public amTheme: string;

    constructor(
        private translationService: TranslationService,
        private themeService: ThemeService,
        private router: Router) 
    { 
    }

    ngOnInit(): void 
    {

        //TODO proper css mat-drawer-inner-container styling
        // dirty work around, because editing mat-drawer-inner-container in css does not work for some reason

        let drawer = (document.getElementsByClassName('mat-drawer-inner-container') as HTMLCollectionOf<HTMLElement>)[0];
        drawer.classList.add('d-flex');
        drawer.style.maxHeight = 'calc(100vh - var(--header-height))';
        //
    }

    ngAfterViewInit() 
    {
        this.themeService.update.subscribe(update => {
            this.amTheme = `am-${update.replace('-theme', '')}`;
        });
    }

    public toggle(state: string): void
    {
    }

    public useLanguage(language: string): void
    {
        this.translationService.setLanguage(language);
    }

}
