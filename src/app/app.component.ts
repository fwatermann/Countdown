import {Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {CountdownComponent} from "./countdown/countdown.component";

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, CountdownComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'Countdown';

  private interval: any;
  private version: number = 0;

  fetchVersion(): Promise<number> {
    return new Promise<number>((resolve, reject) => {
      fetch('/version.txt').then(response => {
        if (response.ok) {
          response.text().then(text => {
            resolve(parseInt(text));
          });
        } else {
          reject(response);
        }
      });
    });
  }

  ngOnInit() {
    this.fetchVersion().then(version => {
      this.version = version;
      this.interval = setInterval(() => {
        this.fetchVersion().then(version => {
          if (version > this.version) {
            window.location.reload();
          }
        });
      }, 10000);
    });
  }

  ngOnDestroy() {
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

}
