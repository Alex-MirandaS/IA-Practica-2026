import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MaterialModule } from './material.module';
import { BulkDataComponent } from './pages/bulk-data/bulk-data.component';
import { CustomScheduleComponent } from './pages/custom-schedule/custom-schedule.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { PerformanceComponent } from './pages/performance/performance.component';
import { PensumComponent } from './pages/pensum/pensum.component';
import { RepetitionsComponent } from './pages/repetitions/repetitions.component';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent,
    BulkDataComponent,
    PensumComponent,
    CustomScheduleComponent,
    PerformanceComponent,
    RepetitionsComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    MaterialModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
