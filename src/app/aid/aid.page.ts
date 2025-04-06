import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule, NavController, Platform } from '@ionic/angular';

@Component({
  selector: 'app-aid',
  templateUrl: './aid.page.html',
  styleUrls: ['./aid.page.scss'],
  imports: [FormsModule, IonicModule],
})
export class AidPage implements OnInit {
  constructor(private navctrl: NavController, private platform: Platform) {}
  ngOnInit() {}

  openEmail() {
    window.location.href =
      'mailto:your-email@example.com?subject=Inquiry&body=Hello, I need some help.';
  }

  openWhatsApp() {
    const phoneNumber = '+44 7908812603';
    const message = 'Hello, I need some help.';
    const whatsappUrl = this.platform.is('mobile')
      ? `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`
      : `https://web.whatsapp.com/send?phone=${phoneNumber}&text=${encodeURIComponent(
          message
        )}`;

    window.open(whatsappUrl, '_blank');
  }

  navigateBack() {
    this.navctrl.back();
  }
}
