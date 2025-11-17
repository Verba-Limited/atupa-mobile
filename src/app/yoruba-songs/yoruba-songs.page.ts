import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';

interface SongItem {
  title: string;
}

@Component({
  selector: 'app-yoruba-songs',
  templateUrl: './yoruba-songs.page.html',
  styleUrls: ['./yoruba-songs.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class YorubaSongsPage {
  songs: SongItem[] = [
    { title: 'Ise Agbe' },
    { title: 'Kini oun fi Ole se' },
  ];
}


