import {Component, ElementRef, OnInit} from '@angular/core';
import {NgIf} from "@angular/common";
import {ActivatedRoute} from "@angular/router";

@Component({
  selector: 'app-countdown',
  standalone: true,
  imports: [
    NgIf
  ],
  templateUrl: './countdown.component.html',
  styleUrl: './countdown.component.scss'
})
export class CountdownComponent implements OnInit {

  protected days: number = 0;
  protected hours: number = 0;
  protected minutes: number = 0;
  protected seconds: number = 0;
  protected milliseconds: number = 0;
  protected text: string = "";

  private interval?: any;

  private TARGET: number = new Date(new Date().getFullYear() + 1, 0, 1, 0, 0, 0, 0).getTime();
  private TEXT = "Frohes neues Jahr!";
  protected SUBTEXT = "https://countdown.w-mi.de";

  constructor(private element: ElementRef, private route: ActivatedRoute) {
    this.element.nativeElement.style.fontSize = "14vW";
  }

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      Object.keys(params).forEach(key => {
          switch(key) {
            case 't':
              this.TARGET = parseInt(params[key]);
              break;
            case 'tr':
              this.TARGET = Date.now() + parseInt(params[key]);
              break;
            case 'text':
              const text: string = params[key];
              if(text.startsWith("b64.")) {
                this.TEXT = atob(text.substring(4));
              } else {
                this.TEXT = params[key];
              }
              break;
            case 'st':
              const subtext: string = params[key];
              if(subtext.startsWith("b64.")) {
                this.SUBTEXT = atob(subtext.substring(4));
              } else {
                this.SUBTEXT = params[key];
              }
          }
      });
    });
  }

  ngAfterViewInit() {
    this.interval = setInterval(() => {
      this.updateNumbers(this.TARGET - Date.now());
    }, 50);
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

  private updateNumbers(msLeft: number) {
    if(msLeft < 0) {
      this.days = 0;
      this.hours = 0;
      this.minutes = 0;
      this.seconds = 0;
      this.milliseconds = 0;
      this.text = this.TEXT;
      return;
    }
    let calc = msLeft;
    this.days = Math.floor(calc / (1000 * 60 * 60 * 24));
    calc -= this.days * (1000 * 60 * 60 * 24);
    this.hours = Math.floor(calc / (1000 * 60 * 60));
    calc -= this.hours * (1000 * 60 * 60);
    this.minutes = Math.floor(calc / (1000 * 60));
    calc -= this.minutes * (1000 * 60);
    this.seconds = Math.floor(calc / 1000);
    calc -= this.seconds * 1000;
    this.milliseconds = Math.floor(calc / 100);

    if(this.days > 0) {
      this.element.nativeElement.style.fontSize = "13vW";
    } else if(this.hours > 0) {
      this.element.nativeElement.style.fontSize = "16vW";
    } else if(this.minutes > 0) {
      this.element.nativeElement.style.fontSize = "24vW";
    } else if(this.seconds > 0) {
      this.element.nativeElement.style.fontSize = "38vW";
    } else if(this.milliseconds == 0) {
      this.element.nativeElement.style.fontSize = "13vW";
    }

  }

}
