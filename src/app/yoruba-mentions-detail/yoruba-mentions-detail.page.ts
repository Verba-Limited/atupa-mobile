import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute, Router } from '@angular/router';

interface Personality {
  name: string;
  picture: string;
  title?: string;
  description?: string;
  bio?: string;
  achievements?: string[];
}

@Component({
  selector: 'app-yoruba-mentions-detail',
  templateUrl: './yoruba-mentions-detail.page.html',
  styleUrls: ['./yoruba-mentions-detail.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class YorubaMentionsDetailPage implements OnInit {
  personality: Personality | null = null;
  personalityName: string = '';

  // Extended personality data with more details
  private personalitiesData: { [key: string]: Personality } = {
    'Alake of Egbaland: Adedotun Aremu Gbadebo III': {
      name: 'Alake of Egbaland: Adedotun Aremu Gbadebo III',
      picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      title: 'Traditional Monarch',
      description: 'Paramount ruler of Egbaland',
      bio: 'The Alake of Egbaland is the paramount ruler of the Egba people, one of the major subgroups of the Yoruba ethnic group. The throne represents centuries of tradition and cultural heritage.',
      achievements: [
        'Paramount ruler of Egbaland',
        'Cultural and spiritual leader',
        'Preserves Egba traditions and customs'
      ]
    },
    'Alaafin of Oyo: Abimbola Akeem Owoade': {
      name: 'Alaafin of Oyo: Abimbola Akeem Owoade',
      picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      title: 'Traditional Monarch',
      description: 'Symbol of cultural pride and unity, continuing the legacy of the historic Oyo Empire',
      bio: 'The Alaafin of Oyo is the traditional ruler of the Oyo Kingdom, which was one of the most powerful empires in West Africa. The throne represents the continuation of a rich historical legacy.',
      achievements: [
        'Symbol of cultural pride and unity',
        'Continues legacy of historic Oyo Empire',
        'Spiritual and cultural leader'
      ]
    },
    'Awujale of Ijebuland: Sikiru Kayode Adetona': {
      name: 'Awujale of Ijebuland: Sikiru Kayode Adetona',
      picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      title: 'Traditional Monarch',
      description: 'Paramount ruler of the Ijebu Kingdom',
      bio: 'The Awujale of Ijebuland is the paramount ruler of the Ijebu people, known for their entrepreneurial spirit and rich cultural traditions.',
      achievements: [
        'Paramount ruler of Ijebu Kingdom',
        'Longest-reigning monarch in Ijebu history',
        'Promotes Ijebu culture and development'
      ]
    },
    'Oba of Lagos: Rilwan Akiolu': {
      name: 'Oba of Lagos: Rilwan Akiolu',
      picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      title: 'Traditional Monarch',
      description: 'Traditional ruler of Lagos, a major cultural and economic hub',
      bio: 'The Oba of Lagos is the traditional ruler of Lagos, Nigeria\'s commercial capital. The throne plays a significant role in the cultural and social life of Lagos.',
      achievements: [
        'Traditional ruler of Lagos',
        'Cultural leader of Nigeria\'s commercial capital',
        'Bridge between tradition and modernity'
      ]
    },
    'Olubadan of Ibadan': {
      name: 'Olubadan of Ibadan',
      picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      title: 'Traditional Monarch',
      description: 'Ruler of Ibadan, historically a major military and political center',
      bio: 'The Olubadan of Ibadan is the traditional ruler of Ibadan, one of the largest cities in Africa. The throne represents the historical significance of Ibadan as a major military and political center.',
      achievements: [
        'Ruler of one of Africa\'s largest cities',
        'Historical military and political significance',
        'Cultural preservation and development'
      ]
    },
    'Ooni of Ife: Adeyeye Enitan Ogunwusi': {
      name: 'Ooni of Ife: Adeyeye Enitan Ogunwusi',
      picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      title: 'Traditional Monarch',
      description: 'Spiritual leader and the most powerful king in Yorubaland',
      bio: 'The Ooni of Ife is regarded as the spiritual leader and the most powerful king in Yorubaland. Ile-Ife is considered the ancestral home of the Yoruba people, and the Ooni\'s lineage traces back to Oduduwa, the mythical progenitor of the Yoruba people.',
      achievements: [
        'Spiritual leader of Yorubaland',
        'Descendant of Oduduwa',
        'Promotes Yoruba unity and culture globally'
      ]
    },
    'Bola Tinubu': {
      name: 'Bola Tinubu',
      picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      title: 'Political Leader',
      description: 'Current President of Nigeria',
      bio: 'Bola Ahmed Tinubu is a prominent Nigerian politician and the current President of Nigeria. He has held various key positions throughout his career and is known for his political influence and leadership.',
      achievements: [
        'Current President of Nigeria',
        'Former Governor of Lagos State',
        'Prominent political leader and strategist'
      ]
    },
    'Chief Bola Ige': {
      name: 'Chief Bola Ige',
      picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      title: 'Politician & Lawyer',
      description: 'Former Governor of Oyo State',
      bio: 'Chief Bola Ige was a prominent Nigerian lawyer and politician who served as the Governor of Oyo State. He was known for his legal expertise and political activism.',
      achievements: [
        'Former Governor of Oyo State',
        'Renowned lawyer and legal expert',
        'Advocate for democracy and justice'
      ]
    },
    'Chief MKO Abiola': {
      name: 'Chief MKO Abiola',
      picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      title: 'Businessman & Politician',
      description: 'Presumed winner of 1993 elections',
      bio: 'Chief Moshood Kashimawo Olawale Abiola was a Nigerian businessman, publisher, and politician. He is widely believed to have won the 1993 Nigerian presidential election, which was annulled by the military government.',
      achievements: [
        'Presumed winner of 1993 presidential election',
        'Successful businessman and philanthropist',
        'Symbol of democracy and justice'
      ]
    },
    'Chief Obafemi Awolowo': {
      name: 'Chief Obafemi Awolowo',
      picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      title: 'Statesman & Politician',
      description: 'First Premier of Western Region, known for welfarist policies and free education',
      bio: 'Chief Obafemi Awolowo was a Nigerian nationalist, statesman, and political leader. He was the first Premier of the Western Region and is remembered for his welfarist policies, free education initiatives, and industrial development efforts.',
      achievements: [
        'First Premier of Western Region',
        'Introduced free education in Western Nigeria',
        'Pioneer of welfarist policies',
        'Major figure in Nigerian nationalism'
      ]
    },
    'Chief Olusegun Obasanjo': {
      name: 'Chief Olusegun Obasanjo',
      picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      title: 'Former President',
      description: 'Two-time President of Nigeria, former military Head of State',
      bio: 'Chief Olusegun Obasanjo is a Nigerian statesman and retired military general who served as Nigeria\'s military Head of State from 1976 to 1979 and later as a two-term civilian President from 1999 to 2007.',
      achievements: [
        'Two-time President of Nigeria',
        'Former military Head of State',
        'Significant figure in Nigerian and global politics',
        'Promoted economic reforms and democracy'
      ]
    },
    'Gani Adams': {
      name: 'Gani Adams',
      picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      title: 'Activist & Traditional Leader',
      description: '15th Aare Ona Kakanfo of Yorubaland, military commander title of the Oyo Empire',
      bio: 'Gani Adams is a Nigerian activist and politician who holds the esteemed traditional title of the 15th Aare Ona Kakanfo of Yorubaland. This title is historically associated with the military commander of the Oyo Empire.',
      achievements: [
        '15th Aare Ona Kakanfo of Yorubaland',
        'Activist and cultural promoter',
        'Traditional military commander title holder'
      ]
    },
    'Yemi Osinbajo': {
      name: 'Yemi Osinbajo',
      picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      title: 'Lawyer & Politician',
      description: 'Former Vice-President of Nigeria (2015-2023)',
      bio: 'Yemi Osinbajo is a Nigerian lawyer and politician who served as the Vice-President of Nigeria from 2015 to 2023. He is known for his legal expertise and public service.',
      achievements: [
        'Former Vice-President of Nigeria (2015-2023)',
        'Renowned lawyer and professor',
        'Advocate for social justice and development'
      ]
    },
    'Professor Akinwumi Adesina': {
      name: 'Professor Akinwumi Adesina',
      picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      title: 'Agricultural Economist',
      description: 'President of African Development Bank since 2015',
      bio: 'Professor Akinwumi Adesina is a Nigerian agricultural economist who has served as the President of the African Development Bank since 2015. He is known for his work in agricultural development and food security.',
      achievements: [
        'President of African Development Bank since 2015',
        'Agricultural economist and development expert',
        'Promotes food security and agricultural development in Africa'
      ]
    },
    'Bishop Samuel Ajayi Crowther': {
      name: 'Bishop Samuel Ajayi Crowther',
      picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      title: 'Bishop & Translator',
      description: 'Translated English Bible to Yoruba version',
      bio: 'Bishop Samuel Ajayi Crowther was the first African Anglican bishop and a prominent linguist. He is best known for translating the English Bible into the Yoruba language, making it accessible to Yoruba-speaking people.',
      achievements: [
        'First African Anglican bishop',
        'Translated English Bible to Yoruba',
        'Pioneer in Yoruba linguistics and translation',
        'Promoted Christianity and education'
      ]
    },
    'Fela Kuti': {
      name: 'Fela Kuti',
      picture: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop',
      title: 'Musician & Activist',
      description: 'Pioneer of Afrobeat music',
      bio: 'Fela Anikulapo Kuti was a Nigerian musician, composer, and political activist. He is credited with creating Afrobeat, a music genre that combines traditional Yoruba music with jazz, funk, and highlife.',
      achievements: [
        'Pioneer of Afrobeat music',
        'Political activist and social critic',
        'Used music as a tool for social change',
        'Cultural icon and musical innovator'
      ]
    },
    'Nike Davies-Okundaye': {
      name: 'Nike Davies-Okundaye',
      picture: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop',
      title: 'Artist',
      description: 'Prominent artist known for Nigerian batik and adire textiles',
      bio: 'Nike Davies-Okundaye is a Nigerian artist known for her work in Nigerian batik and adire textiles. She has played a significant role in preserving and promoting traditional Yoruba textile arts.',
      achievements: [
        'Prominent textile artist',
        'Preserves traditional adire and batik techniques',
        'Promotes Nigerian art globally',
        'Cultural ambassador for Yoruba arts'
      ]
    },
    'Professor Wande Abimbola': {
      name: 'Professor Wande Abimbola',
      picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      title: 'Scholar & Traditionalist',
      description: 'Renowned Ifa priest and academic',
      bio: 'Professor Wande Abimbola is a Nigerian academic and traditionalist who is renowned as an Ifa priest. He has worked to bridge the gap between traditional Yoruba religion and academia.',
      achievements: [
        'Renowned Ifa priest',
        'Academic scholar of Yoruba religion',
        'Bridges tradition and academia',
        'Preserves and promotes Ifa knowledge'
      ]
    },
    'Tomi Adeyemi': {
      name: 'Tomi Adeyemi',
      picture: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop',
      title: 'Novelist & Creative Writing Coach',
      description: 'Nigerian-American novelist known for best-selling fantasy novels',
      bio: 'Tomi Adeyemi is a Nigerian-American novelist and creative writing coach known for her best-selling fantasy novels. Her work draws inspiration from Yoruba mythology and West African culture.',
      achievements: [
        'Best-selling fantasy novelist',
        'Incorporates Yoruba mythology in literature',
        'Creative writing coach and educator',
        'Promotes African culture through literature'
      ]
    },
    'Wole Soyinka': {
      name: 'Wole Soyinka',
      picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      title: 'Nobel Laureate',
      description: 'First African Nobel Prize winner in Literature, playwright, poet, and essayist',
      bio: 'Wole Soyinka is a Nigerian playwright, poet, and essayist who was awarded the Nobel Prize in Literature in 1986, making him the first African to receive this prestigious award. His works explore themes of African identity, politics, and culture.',
      achievements: [
        'First African Nobel Prize winner in Literature (1986)',
        'Renowned playwright, poet, and essayist',
        'Political activist and social critic',
        'Promotes African literature and culture globally'
      ]
    }
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.personalityName = params['name'] || '';
      if (this.personalityName) {
        this.personality = this.personalitiesData[this.personalityName] || null;
      }
    });
  }

  goBack() {
    this.router.navigate(['/tabs/general/yoruba-mentions']);
  }

  onImageError(event: any) {
    event.target.style.display = 'none';
  }
}

