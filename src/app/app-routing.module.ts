import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { HomeComponent } from './pages/home/home.component';
import { OverviewComponent } from './pages/overview/overview.component';
import { ProjectsComponent } from './pages/projects/projects.component';

const routes: Routes = [
    {
        path: '', 
        component: HomeComponent,
        children: [
            {
                path: '', 
                component: OverviewComponent
            },
            {
                path: 'projects', 
                component: ProjectsComponent
            }
        ]
    },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
