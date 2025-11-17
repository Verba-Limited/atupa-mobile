import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

interface Proverb {
  yoruba: string;
  meaning: string;
}

@Component({
  selector: 'app-yoruba-proverbs',
  templateUrl: './yoruba-proverbs.page.html',
  styleUrls: ['./yoruba-proverbs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class YorubaProverbsPage {
  proverbs: Proverb[] = [
    { yoruba: 'Ise logun ise', meaning: 'Hard work is the antidote to poverty.' },
    { yoruba: 'Bi omode ba subu, a wo iwaju; bi agbalagba ba subu, a wo eyin', meaning: 'Children look ahead when they fall; elders reflect on the past.' },
    { yoruba: 'Oro buruku to n tinu eni jade, eeyan lo n gbe', meaning: 'Words spoken cannot be taken back.' },
  ];
}


