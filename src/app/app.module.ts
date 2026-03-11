import {
  ApplicationRef,
  DoBootstrap,
  Injector,
  NgModule
} from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { createCustomElement, NgElementConstructor } from '@angular/elements';
import { Router } from '@angular/router';
import { selectorComponentMap } from "./custom1-module/customComponentMappings";
import { TranslateModule } from '@ngx-translate/core';
import { CommonModule } from '@angular/common';
import { AutoAssetSrcDirective } from './services/auto-asset-src.directive';

export const AppModule = ({ providers }: { providers: any }) => {
  @NgModule({
    declarations: [
      AppComponent,
      AutoAssetSrcDirective
    ],
    exports: [AutoAssetSrcDirective],
    imports: [
      BrowserModule,
      CommonModule,
      TranslateModule.forRoot({})
    ],
    providers: providers,
    bootstrap: []
  })
  class AppModule implements DoBootstrap {
    private webComponentSelectorMap =
      new Map<string, NgElementConstructor<unknown>>();

    constructor(private injector: Injector, private router: Router) {
      // Prevent router collision with Primo shell
      router.dispose();
    }

    ngDoBootstrap(appRef: ApplicationRef) {
      for (const [selector, component] of selectorComponentMap) {
        const element = createCustomElement(component, {
          injector: this.injector
        });

        this.webComponentSelectorMap.set(selector, element);
      }
    }
    public getComponentRef(componentName: string) {
      return this.webComponentSelectorMap.get(componentName);
    }
  }

  return AppModule;
};