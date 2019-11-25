

/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/
import { DomSanitizer } from '@angular/platform-browser';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: []
})

export class AppComponent {
  url: any = 'https://mwroffo.github.io';
  title: string = 'my zowe embedded browser';

  constructor(
    private sanitizer: DomSanitizer
    ) {   
      
    }
    // mine:
    handleUrlEvent($event: any) {
      this.url = $event;
      this.url = this.sanitizer.bypassSecurityTrustResourceUrl(this.url);
    }
}


/*
  This program and the accompanying materials are
  made available under the terms of the Eclipse Public License v2.0 which accompanies
  this distribution, and is available at https://www.eclipse.org/legal/epl-v20.html
  
  SPDX-License-Identifier: EPL-2.0
  
  Copyright Contributors to the Zowe Project.
*/

