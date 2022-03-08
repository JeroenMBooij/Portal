import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { fadeAnimation } from 'src/app/common/animations/fade-in-out.animation';
import { ThemeService } from 'src/app/services/theme/theme.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss'],
  animations: [fadeAnimation]
})
export class OverviewComponent implements OnInit, AfterViewInit 
{

    @ViewChild('threeBuildTextContainer') threeBuildTextContainerRef: ElementRef
    get threeBuildTextContainer(): HTMLElement { return this.threeBuildTextContainerRef.nativeElement }

    public threeBuildTextContainerHeight = '0px';
    public threeBuildTextColor = 0x000000;
    
    constructor(
        private themeService: ThemeService,
        private router: Router,
        private changor: ChangeDetectorRef) { }

    ngOnInit(): void
    {
        this.threeBuildTextContainerHeight = this.getThreeBuildTextContainerHeight();

        this.themeService.update.subscribe(theme => 
        {
            switch(theme)
            {
                case 'light-theme':
                    this.threeBuildTextColor = 0x000000;
                    break;
                case 'dark-theme':
                    this.threeBuildTextColor = 0xffffff;
                    break;
            }
        });
    }

    ngAfterViewInit(): void
    {
        window.addEventListener('resize', () =>
        {
            this.threeBuildTextContainerHeight = this.getThreeBuildTextContainerHeight();
            this.changor.detectChanges();
        });
    }

    public openProjects(): void
    {
        this.router.navigate(['projects'])
    }

    private getThreeBuildTextContainerHeight(): string
    {
        let w = window.innerWidth / 14.5;
        if(w < 80)
            w = 80;
        if (w > 135)
            w = 135;

        return `${w}px`;
    }

}
