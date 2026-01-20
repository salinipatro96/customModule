import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ViewMapButtonComponent } from './view-map-button/view-map-button.component';
import { ViewMapComponent } from '../view-map/view-map.component';

@NgModule({
  declarations: [ViewMapButtonComponent],
  imports: [CommonModule, ViewMapComponent]
})
export class CustomModule {}

export { bootstrapRemoteApp } from '../../bootstrap';
