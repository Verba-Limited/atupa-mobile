import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';

interface Personality {
  name: string;
  picture: string;
  title?: string;
  description?: string;
}

@Component({
  selector: 'app-yoruba-mentions',
  templateUrl: './yoruba-mentions.page.html',
  styleUrls: ['./yoruba-mentions.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule],
})
export class YorubaMentionsPage implements OnInit {
  constructor(private router: Router) {}

  personalities: Personality[] = [
    // Traditional Monarchs
    { 
      name: 'Alake of Egbaland: Adedotun Aremu Gbadebo III', 
      picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      title: 'Traditional Monarch', 
      description: 'Paramount ruler of Egbaland' 
    },
    { 
      name: 'Alaafin of Oyo: Abimbola Akeem Owoade', 
      picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      title: 'Traditional Monarch', 
      description: 'Symbol of cultural pride and unity, continuing the legacy of the historic Oyo Empire' 
    },
    { 
      name: 'Awujale of Ijebuland: Sikiru Kayode Adetona', 
      picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      title: 'Traditional Monarch', 
      description: 'Paramount ruler of the Ijebu Kingdom' 
    },
    { 
      name: 'Oba of Lagos: Rilwan Akiolu', 
      picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      title: 'Traditional Monarch', 
      description: 'Traditional ruler of Lagos, a major cultural and economic hub' 
    },
    { 
      name: 'Olubadan of Ibadan', 
      picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      title: 'Traditional Monarch', 
      description: 'Ruler of Ibadan, historically a major military and political center' 
    },
    { 
      name: 'Ooni of Ife: Adeyeye Enitan Ogunwusi', 
      picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      title: 'Traditional Monarch', 
      description: 'Spiritual leader and the most powerful king in Yorubaland' 
    },
    
    // Political and Civic Leaders
    { 
      name: 'Bola Tinubu', 
      picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      title: 'Political Leader', 
      description: 'Current President of Nigeria' 
    },
    { 
      name: 'Chief Bola Ige', 
      picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      title: 'Politician & Lawyer', 
      description: 'Former Governor of Oyo State' 
    },
    { 
      name: 'Chief MKO Abiola', 
      picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      title: 'Businessman & Politician', 
      description: 'Presumed winner of 1993 elections' 
    },
    { 
      name: 'Chief Obafemi Awolowo', 
      picture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop',
      title: 'Statesman & Politician', 
      description: 'First Premier of Western Region, known for welfarist policies and free education' 
    },
    { 
      name: 'Chief Olusegun Obasanjo', 
      picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      title: 'Former President', 
      description: 'Two-time President of Nigeria, former military Head of State' 
    },
    { 
      name: 'Gani Adams', 
      picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      title: 'Activist & Traditional Leader', 
      description: '15th Aare Ona Kakanfo of Yorubaland, military commander title of the Oyo Empire' 
    },
    { 
      name: 'Yemi Osinbajo', 
      picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      title: 'Lawyer & Politician', 
      description: 'Former Vice-President of Nigeria (2015-2023)' 
    },
    
    // Leaders in Arts, Academia, and Other Fields
    { 
      name: 'Professor Akinwumi Adesina', 
      picture: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop',
      title: 'Agricultural Economist', 
      description: 'President of African Development Bank since 2015' 
    },
    { 
      name: 'Bishop Samuel Ajayi Crowther', 
      picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      title: 'Bishop & Translator', 
      description: 'Translated English Bible to Yoruba version' 
    },
    { 
      name: 'Fela Kuti', 
      picture: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop',
      title: 'Musician & Activist', 
      description: 'Pioneer of Afrobeat music' 
    },
    { 
      name: 'Nike Davies-Okundaye', 
      picture: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop',
      title: 'Artist', 
      description: 'Prominent artist known for Nigerian batik and adire textiles' 
    },
    { 
      name: 'Professor Wande Abimbola', 
      picture: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&h=400&fit=crop',
      title: 'Scholar & Traditionalist', 
      description: 'Renowned Ifa priest and academic' 
    },
    { 
      name: 'Tomi Adeyemi', 
      picture: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&h=400&fit=crop',
      title: 'Novelist & Creative Writing Coach', 
      description: 'Nigerian-American novelist known for best-selling fantasy novels' 
    },
    { 
      name: 'Wole Soyinka', 
      picture: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=400&fit=crop',
      title: 'Nobel Laureate', 
      description: 'First African Nobel Prize winner in Literature, playwright, poet, and essayist' 
    },
  ];

  ngOnInit() {
    // Sort personalities alphabetically by full name
    this.personalities.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });
  }

  onImageError(event: any) {
    // Fallback image or hide broken images
    event.target.style.display = 'none';
  }

  viewPersonalityDetail(personality: Personality) {
    this.router.navigate(['/tabs/general/yoruba-mentions-detail'], {
      queryParams: { name: personality.name }
    });
  }
}

