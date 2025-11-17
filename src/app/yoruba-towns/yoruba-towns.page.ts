import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

interface TownItem {
  name: string;
}

@Component({
  selector: 'app-yoruba-towns',
  templateUrl: './yoruba-towns.page.html',
  styleUrls: ['./yoruba-towns.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class YorubaTownsPage {
  towns: TownItem[] = [
    { name: 'Ibadan' },
    { name: 'Ile-Ife' },
    { name: 'Ogbomoso' },
    { name: 'Oshogbo' },
    { name: 'Abeokuta' },
    { name: 'Akure' },
  ];
}


