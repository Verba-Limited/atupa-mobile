import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

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
  constructor(private router: Router) {}

  songs: SongItem[] = [
    { title: 'Ise Agbe' },
    { title: 'Kini oun fi Ole se' },
    { title: 'Ise Logun ise' },
    { title: 'Kaka ki n\'bi egbaa obun' },
    { title: 'Ise ya (Ogun State Anthem)' },
    { title: 'Ipo Asiwaju (Oyo State Anthem)' },
    { title: 'Ise wa fun ile wa (Osun State Anthem)' },
    { title: 'Oun abajoro kiipe kun (Ekiti State Anthem)' },
  ];

  viewSongDetail(song: SongItem) {
    this.router.navigate(['/tabs/general/yoruba-songs-detail'], {
      queryParams: { title: song.title }
    });
  }
}


