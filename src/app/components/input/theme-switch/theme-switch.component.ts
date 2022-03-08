import { Component, OnInit } from '@angular/core';
import { THEME_LIST } from 'src/app/common/constants/theme.constants';
import { ThemeService } from 'src/app/services/theme/theme.service';
import { TranslationService } from 'src/app/services/translation/translation.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'theme-switch',
  templateUrl: './theme-switch.component.html',
  styleUrls: ['./theme-switch.component.scss']
})
export class ThemeSwitchComponent implements OnInit 
{
    public selectedTheme: string;
    public checked = true;

    constructor(
        private translationService: TranslationService,
        private themeService: ThemeService) 
    { 
    }

    ngOnInit(): void 
    {
        this.translationService.update.subscribe(async update => {
            if(environment.production == false)
                console.log("translationservice update subscribed");
                
            await this.bootstrap();
        });
    }

    public async switchTheme(): Promise<void>
    {
        let selectedThemeKey = this.themeService.switch();

        this.selectedTheme = await this.translationService.get(`input.${selectedThemeKey}`);
        this.checked = false;
    }

    private async bootstrap(): Promise<void>
    {
        let selectedThemeKey = this.themeService.get();
        this.selectedTheme = await this.translationService.get(`input.${selectedThemeKey}`);

        if (selectedThemeKey == THEME_LIST[0])
            this.checked = false;
        else 
            this.checked = true;
    }

}
