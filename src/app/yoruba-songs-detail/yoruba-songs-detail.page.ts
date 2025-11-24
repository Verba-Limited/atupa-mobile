import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

interface Song {
  title: string;
  lyrics: string;
  interpretation: string;
  audioUrl?: string;
  embedUrl?: string;
}

@Component({
  selector: 'app-yoruba-songs-detail',
  templateUrl: './yoruba-songs-detail.page.html',
  styleUrls: ['./yoruba-songs-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class YorubaSongsDetailPage implements OnInit, OnDestroy {
  song: Song | null = null;
  songTitle: string = '';
  isPlaying: boolean = false;
  audioPlayer: HTMLAudioElement | null = null;
  safeEmbedUrl: SafeResourceUrl | null = null;
  isYouTubeEmbed: boolean = false;
  
  isEmbedUrl(url?: string): boolean {
    return url ? url.includes('embed') || url.includes('audiomack') || url.includes('youtube') || url.includes('youtu.be') : false;
  }
  
  convertToEmbedUrl(url: string): string {
    // Convert YouTube Shorts URLs to embed format
    if (url.includes('youtube.com/shorts/')) {
      const videoId = url.split('shorts/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Convert YouTube short URLs (youtu.be) to embed format
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1].split('?')[0];
      return `https://www.youtube.com/embed/${videoId}`;
    }
    // Convert YouTube watch URLs to embed format
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      if (videoId) {
        return `https://www.youtube.com/embed/${videoId}`;
      }
    }
    return url;
  }
  
  getEmbedUrl(): SafeResourceUrl | null {
    let urlToConvert: string | null = null;
    
    if (this.song?.embedUrl) {
      urlToConvert = this.song.embedUrl;
    } else if (this.song?.audioUrl && this.isEmbedUrl(this.song.audioUrl)) {
      urlToConvert = this.song.audioUrl;
    }
    
    if (urlToConvert) {
      this.isYouTubeEmbed = urlToConvert.includes('youtube') || urlToConvert.includes('youtu.be');
      const embedUrl = this.convertToEmbedUrl(urlToConvert);
      return this.sanitizer.bypassSecurityTrustResourceUrl(embedUrl);
    }
    
    return null;
  }

  // Song data with lyrics and interpretations
  private songsData: { [key: string]: Song } = {
    'Ise Agbe': {
      title: 'Ise Agbe',
      lyrics: `Ise agbe, ise ile wa

Eni ko se she, ama jale

Iwe kiko, laisi oko ati ada

Koi pe o, koi pe o`,
      interpretation: `Agriculture is the work in our land

Whoever does not work, will steal

Formal education without hoe and cutlass

Is not complete, is not complete.`
    },
    'Kini oun fi Ole se': {
      title: 'KINI NG\'O F\'OLE SE L\'AYE TI MO WA?',
      lyrics: `Ki'ni ng'o f'ole se l'aye ti mo wa? – 2X
L'aye ti mo wa kaka ki n'ja'le,
Kaka ki n'ja'le ma kuku d'eru;
Ki'ni ng'o f'ole se l'aye ti mo wa?

Eni to j'ale a de'le ejo – 2X
Adajo a wa f'ewon si l'ese,
F'ewon si l'ese bi onigbese;
Eni to j'ale a de'le ejo.

Aye e ma f'ole s'egbe ti mo ni – 2X
Egbe ti mo ni ewon ko sun won,
Ewon ko sun won f'omoluwabi;
Aye e ma f'ole s'egbe ti mo ni.

Oluwa ma f'ole s'egbe ti mo ni – 2X
Egbe ti mo ni kaka ko'o ja'le,
Kaka ko'o j'ale bo ba ku o to;
Aye e ma f'ole s'egbe ti mo ni.

B'eni to ja'le ba l'ola l'aye – 2X
Bo l'ola l'aye ko le r'orun wo,
Ko le r'orun wo b'olojo bade;
B'eni to ja'le ba l'ola l'aye.`,
      interpretation: `(NOTE: I took the sensitivity of some of the words in this song into consideration while translating the whole. Rather than using the literal meanings of those words, I opted for their contemporary equivalents. The historical antecedents of those words necessitated the fine-tuning.)

What would I do with stealing in my life? – 2X
Rather than stealing in my life,
I would engage in hard labour, instead of stealing;
What would I do with stealing in my life?

Whoever steals would be arraigned in court – 2X
The judge would shackle the felon's legs,
The felon would be shackled like a debtor;
Whoever steals would be arraigned in court.

May circumstances never permit my associates to steal – 2X
Restraining is not pleasant, my associates,
Restraining is not pleasurable for the honourable;
May circumstances never permit my associates to steal.

May God never permit my associates to steal – 2X
Rather than stealing, my associates,
The deceased are better than those who steal;
May circumstances never permit my associates to steal.

If the burglar becomes prosperous in life – 2X
The prosperous burglar would be denied heaven,
The burglar would be denied when the creator arrives;
If the burglar becomes prosperous in life.

By: Dele Ajaja`
    },
    'Ise Logun ise': {
      title: 'Ise Logun ise',
      lyrics: `Ise Logun ise

... Mura si se re, ore mi

Ise la fi ndeni giga

Bi a ko ba reni fehin ti

Bi ole la ri

Bi a ko ba reni gbekele,

A te ra mo se ni.

Iya re le lowo lowoh

Baba re le lesin lekan

Ti o ba gbojule won

O te tan ni mo so fun o

Apa lara igupa ni ye kan

B'aiye ba fe o loni

Ti o ba lowo lowo, won a tun fe o lola

Abi ko wa nipo atata

Aiye a ye o si terin terin

Je ki o deni ti ra ngo

Ko ri bi won ti nyin mu si o

Iya mbe fomo ti ko gbon

Ekun mbe fomo ti nsare kiri

Mafowuro sere ore mi

Mura sise ojo nlo.`,
      interpretation: `Work is the antidote for poverty

... Work hard and work smart, my friend

Hard and smart work brings success

When there is no one to rely on

Its like we are lazy

When there is no one to trust,

We focus more on our work.

Your mother might be rich

Your father might own a thousand and one horses

If you rely on them

In truth, you might be on sinking ground

families are like the arm, while extended family are like the elbow

If you are loved by the world today

If you are still rich, they will love you tomorrow as well

If you have an esteemed position

You will be honored with "fake"laughter

If you unfortunately loose your money or position

They'll turn their back on you

There is suffering for the foolish child

and there is sorrow for the child that have no plan or vision

Don't waste your formative years, my friend

work hard and plan well now, because time waits for no one`
    },
    'Kaka ki n\'bi egbaa obun': {
      title: 'KAKA KI N\'BI EGBAA OBUN',
      lyrics: `Kaka ki n'bi egbaa obun,

Maa kuku bi okan soso oga,

Maa fi yan araye loju,

Maa ro'un gbera'ga.

Se okan soso araba,

Kii se egbe egbaa osusun;

Omo to jafafa kan soso,

O san ju igba irunbi omo.

Akuku'bi san ju radarada;

Ka'ku l'omode ko ye'ni,

O san ju ka d'agba ka toro'je lo.`,
      interpretation: `(A thought-provoking verse from the late Chief J.F. Odunjo, renowned Yoruba playwright, poet, politician, and statesman. This work comes from one of his popular Alawiye sequence.)

Instead of breeding two thousand filthy ones,

I would procreate an exceptional child,

I would have something for the world to envy,

I would have something to be proud of.

A single cotton tree,

Is appreciable than two thousand cane-shrubs;

An outstanding child,

Outstrips multitudes of unproductive broods.

Infertility is better than begetting hopeless progenies;

To expire reverentially at a young age,

Is better than begging to eat at old age.

(Translated by DELE AJAJA)`
    },
    'Ise ya': {
      title: 'Ise ya (Ogun State Anthem)',
      lyrics: `Ise ya a a

Ise ya a a

Omo Ogun ise ya a

Olodumare ise ma ya o e e

Ise ya

Enyin omo Ogun e se giri

Ise po fun wa lati se e e

Omo rere ki isa se e

Omo Ogun ki i s'o le e

Ebere gb'eru o o

Olorun mbe fun wa

E tera mose o o

Ise ya

Omo Ogun ise ya a`,
      interpretation: `The Ogun State Anthem, "Ise ya", was composed by a renowned musicologist and composer, late Chief Dayo Dedeke in 1976. It was adopted the same year, as the state's anthem by the military administration of Saidu Ayodele Balogun.

Work now

Work now

Ogun children, work now

God, let work not be difficult

Work now

You children of Ogun, work hard

There is much work for us to do

A good child does not steal

Ogun children do not steal

Mercy removes fear

God is with us

Focus on your work

Work now

Ogun children, work now`,
      audioUrl: 'https://oguntoday.com.ng/wp-content/uploads/2023/01/Ise-ya-Ogun-State-Anthem-new.mp3'
    },
    'Ipo Asiwaju (Oyo State Anthem)': {
      title: 'Ipo Asiwaju (Oyo State Anthem)',
      lyrics: `Ipo Asiwaju Le'ledumare fun wa ni'pinle Oyo

Ipinle Oyo e je ka segiri

Omo Oyo ka te pa wa mo 'se

Ka ba 'ra wa sododo Ka sohun to to, to dara nigba gbogbo, nibi gbogbo fun ipinle Oyo 

Ko ni rehin o loju mi ko ni rehin o

Ko ni rehin o nigba temi ko ni rehin o

Emi a sohun to to, to dara nigba gbogbo Nibi gbogbo fun ipinle Oyo 

Asiwaju ni wa

Asiwaju ni wa Asiwaju ni wa`,
      interpretation: `The leading position that God has given us in Oyo State

Oyo State, let us be firm

Children of Oyo, let's continue our work

Let's be sincere with each other Let's say what is right and good at all times, everywhere, for Oyo State 

There will be no turning back for me

There will be no turning back in my time

I will say what is right and good at all times Everywhere for Oyo State 

We are the leaders

We are the leaders We are the leaders`,
      embedUrl: 'https://audiomack.com/embed/sheg-fundz/song/oyo-anthem'
    },
    'Ise wa fun ile wa (Osun State Anthem)': {
      title: 'Ise wa fun ile wa (Osun State Anthem)',
      lyrics: `Ise wa fun ile wa

Fun Ile Ibi Wa

Ka gbee ga

Ka gbee ga

Ka gbee ga fun aye ri

Igbagbo wa ni pe

Bati beru la bomo

Ka sise

Ka sise

Ka sise ka jo la

Isokan ati ominira

Ni ke je ka maa lepa

Tesiwaju f opo ire

Ati ohun to dara

Omo Oodua dide

Bo si ipo eto re

Iwo ni imole

Gbogbo Adulawo`,
      interpretation: `There is work for us to do

For our motherland

Let's uplift it, let's uplift it

Uplift it for the world to see

Our belief is that;

The way a child was born, so was a slave

Let's work, let's labour

Let's work, so we can together prosper

Unity and freedom

Should be our pursuit

March on for plenty success

And all that is good

The child of Oodua arise

Take your rightful place

For you are the light

Of the black race`,
      embedUrl: 'https://youtu.be/HvPNm3EANfc'
    },
    'Oun abajoro kiipe kun (Ekiti State Anthem)': {
      title: 'Oun abajoro kiipe kun (Ekiti State Anthem)',
      lyrics: `Oun abajoro kiipe kun

Oun asepo nileye

Ehin ola wa tidara o

Awa Ekiti ati parapo

Kaparapo katun panupo

Awa Ekiti ati gbominira

Okan lawansee

Ekiti, Ekiti ati gbominira (2ce)

Awa Ekiti iwaju laomalo lagbara Olorun

Awa Ekiti okan soso ma ni'wa o lailai`,
      interpretation: `The Ekiti anthem was composed by Late Magistrate J. Ola Ologunde. He wrote the anthem in 1960, leaving a significant legacy for the state.

Composer: Late Magistrate J. Ola Ologunde
Year of Composition: 1960
Significance: His work is considered a "great legacy" for the state of Ekiti.

What we discuss will not be complete

What we agree on is valuable

Our future is bright

We Ekiti people, let's unite

Let's unite and be together

We Ekiti people, let's be free

We are one

Ekiti, Ekiti, let's be free (2x)

We Ekiti people, forward we go with God's strength

We Ekiti people, we will always be united forever`,
      embedUrl: 'https://www.youtube.com/shorts/zt8lXdihrJA?feature=share'
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.songTitle = params['title'] || '';
      // Reset flags
      this.isYouTubeEmbed = false;
      this.safeEmbedUrl = null;
      this.isPlaying = false;
      
      if (this.songTitle) {
        this.song = this.songsData[this.songTitle] || null;
        if (this.song) {
          // Handle embed URLs
          if (this.song.embedUrl || (this.song.audioUrl && this.isEmbedUrl(this.song.audioUrl))) {
            this.safeEmbedUrl = this.getEmbedUrl();
          }
          // Handle direct MP3 URLs
          else if (this.song.audioUrl && !this.isEmbedUrl(this.song.audioUrl)) {
            this.audioPlayer = new Audio(this.song.audioUrl);
            this.audioPlayer.addEventListener('ended', () => {
              this.isPlaying = false;
            });
            this.audioPlayer.addEventListener('pause', () => {
              this.isPlaying = false;
            });
            this.audioPlayer.addEventListener('play', () => {
              this.isPlaying = true;
            });
          }
        }
      }
    });
  }

  ngOnDestroy() {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
      this.audioPlayer = null;
    }
  }

  toggleAudio() {
    if (!this.audioPlayer) return;

    if (this.isPlaying) {
      this.audioPlayer.pause();
    } else {
      this.audioPlayer.play();
    }
  }

  goBack() {
    if (this.audioPlayer) {
      this.audioPlayer.pause();
    }
    this.router.navigate(['/tabs/general/yoruba-songs']);
  }
}

