import { Component, OnInit } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { SafariViewController } from '@ionic-native/safari-view-controller/ngx';

@Component({
  selector: 'app-about',
  templateUrl: './about.page.html',
  styleUrls: ['./about.page.scss'],
})
export class AboutPage implements OnInit {

  description: string;

  constructor(
    private iab: InAppBrowser,
    private safariViewController: SafariViewController
  ) { }

  ngOnInit() {
    // tslint:disable-next-line:max-line-length
    this.description = '\nShri Madhusudan Bapuji is a Spiritual Philosopher who gives discourses on Spiritual topics, mainly on Shrimad Bhagavad Gita. He leads the Divine temple Anand Vrindavan Dham which is situated in Ulhasnagar, Maharshtra(India). His Divine Mission is to preach the Holy name of Lord Krishna and make people chant the Divine Mantra Hare Krishna Hare Krishna Krishna, Krishna Hare Hare, Hare Rama Hare Rama, Rama Rama Hare Hare. He struggles tirelessly to accomplish His mission and transforming people’s material lives. At present, His main centre is in Ulhasnagar where He gives spiritual lectures on regular basis which are then circulated all around the world. He also has His centres in other Indian cities such as Nagpur, Jaipur, Gujrat, Ahmedabad, as well as outside India in Dubai, USA etc.\nFor more queries regarding satsang details visit our website ';
  }

  openLink(type: string) {
    let url;
    switch (type) {
      case 'facebook':
        url = 'https://www.facebook.com/ShriMadhusudanBapuji/';
        this.checkBrowser(url);
        break;
      case 'youtube':
        url = 'https://www.youtube.com/user/AnandVrindavanDham';
        this.checkBrowser(url);
        break;
      case 'instagram':
        url = 'https://www.instagram.com/shri_madhusudan_bapuji';
        this.checkBrowser(url);
        break;
      case 'website':
        url = 'https://www.anandvrindavan.com';
        this.checkBrowser(url);
        break;
      default:
        break;
    }
  }

  checkBrowser(url: string) {
    this.safariViewController.isAvailable()
      .then((available: boolean) => {
        if (available) {
          this.safariViewController.show({
            url: url,
            hidden: false,
            animated: true,
            transition: 'slide',
            enterReaderModeIfAvailable: true
          })
           .subscribe((result: any) => {
              if (result.event === 'opened') {
                console.log('Opened');
              } else if (result.event === 'loaded') {
                console.log('Loaded');
              } else if (result.event === 'closed') {
                console.log('Closed');
              }
            },
              (error: any) => console.error(error)
            );
        } else {
          // use fallback browser, example InAppBrowser
          this.iab.create(url, '_system');
        }
      }
      );
  }
}
