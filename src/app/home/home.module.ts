import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { HomePage } from './home.page';

import { NgChartsModule } from 'ng2-charts';

import { HomePageRoutingModule } from './home-routing.module';
import { MathjaxModule } from 'mathjax-angular';

import { ParaComponent } from '../para/para.component';

@NgModule({
  imports: [
    NgChartsModule,
    CommonModule,
    FormsModule,
    IonicModule,
    HomePageRoutingModule,
    MathjaxModule.forChild(),
  ],
  declarations: [HomePage, ParaComponent],
})
export class HomePageModule {}
