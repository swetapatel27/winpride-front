import { Component, OnInit } from '@angular/core';
import {NgbCarouselConfig} from "@ng-bootstrap/ng-bootstrap";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  providers: [NgbCarouselConfig]

})
export class HomeComponent implements OnInit {

  constructor(config: NgbCarouselConfig,) {
    config.interval = 3000;
    config.wrap=true;
    config.keyboard = true;
    config.pauseOnHover = true;

  }

  imgUrl = "/assets/images/card1.png"


  ngOnInit(): void {
  }

}
