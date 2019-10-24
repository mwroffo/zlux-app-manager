import { Component, OnInit, Output, EventEmitter} from '@angular/core';

@Component({
  selector: 'app-url-form',
  templateUrl: './url-form.component.html',
  styleUrls: ['./url-form.component.css']
})
export class UrlFormComponent implements OnInit {

  constructor() { }

  url: string = "test url string";

  @Output() urlEvent = new EventEmitter<string>();

  ngOnInit() {
  }

  handleFormSubmit(form: any) {
    console.log(`from form, received`, form)
    this.url = form.url;
    this.urlEvent.emit(this.url);
  }

}
