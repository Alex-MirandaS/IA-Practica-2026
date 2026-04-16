import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BulkDataComponent } from './pages/bulk-data/bulk-data.component';
import { CustomScheduleComponent } from './pages/custom-schedule/custom-schedule.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PerformanceComponent } from './pages/performance/performance.component';
import { PensumComponent } from './pages/pensum/pensum.component';
import { RepetitionsComponent } from './pages/repetitions/repetitions.component';

const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'carga-masiva', component: BulkDataComponent },
  { path: 'pensum', component: PensumComponent },
  { path: 'horario-personalizado', component: CustomScheduleComponent },
  { path: 'rendimiento', component: PerformanceComponent },
  { path: 'repitencias', component: RepetitionsComponent },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
