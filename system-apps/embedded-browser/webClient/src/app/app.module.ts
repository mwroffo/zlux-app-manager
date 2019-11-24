

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser'
import { NgModule, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UrlFormComponent } from './url-form/url-form.component';

import { AppComponent } from './app.component';
import {HelloService} from './services/hello.service';

import { TranslationModule, L10nConfig, ISOCode, L10nLoader, LOCALE_CONFIG,
  TRANSLATION_CONFIG, LocaleConfig, TranslationConfig } from 'angular-l10n';
import { Angular2L10nConfig, Angular2InjectionTokens } from 'pluginlib/inject-resources';


const l10nConfig: L10nConfig = {
  translation: {
      providers: [],
      composedLanguage: [ISOCode.Language, ISOCode.Country],
      caching: true,
      missingValue: 'No key'
  }
};


@NgModule({
  declarations: [
    AppComponent,
    UrlFormComponent
  ],
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    TranslationModule.forRoot(l10nConfig)
  ],
  providers: [HelloService],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(
    private l10nLoader: L10nLoader,
    @Inject(Angular2InjectionTokens.L10N_CONFIG) private l10nConfig: Angular2L10nConfig,
    @Inject(LOCALE_CONFIG) private localeConfig: LocaleConfig,
    @Inject(TRANSLATION_CONFIG) private translationConfig: TranslationConfig,

  ) {
    this.localeConfig.defaultLocale = this.l10nConfig.defaultLocale;
    this.translationConfig.providers = this.l10nConfig.providers;
    this.l10nLoader.load();
  }
}


/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

