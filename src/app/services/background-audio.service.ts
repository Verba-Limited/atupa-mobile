import { Injectable } from '@angular/core';
import { Howl } from 'howler';

@Injectable({
  providedIn: 'root',
})
export class BackgroundAudioService {
  private sound: Howl;
  private isPlaying = false;

  constructor() {
    this.sound = new Howl({
      src: ['../../assets/audio/game-music.mp3'],
      loop: true,
      volume: 0.5,
    });
  }

  play() {
    if (!this.isPlaying) {
      this.sound.play();
      this.isPlaying = true;
    }
  }

  stop() {
    this.sound.stop();
    this.isPlaying = false;
  }

  setVolume(volume: number) {
    this.sound.volume(volume);
  }
}
