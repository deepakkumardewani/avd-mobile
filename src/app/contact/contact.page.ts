import { Component, OnInit } from '@angular/core';
import { EmailComposer } from '@ionic-native/email-composer/ngx';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.page.html',
  styleUrls: ['./contact.page.scss'],
})
export class ContactPage implements OnInit {

  constructor(
    private emailComposer: EmailComposer
    ) { }

  ngOnInit() {
  }


  sendFeedback() {
    const email = {
      to: 'anandvrindavandham@gmail.com',
      subject: 'Hare Krishna',
      body: ''
    };
    this.emailComposer.open(email);
  }

}
