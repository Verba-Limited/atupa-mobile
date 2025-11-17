import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, Platform } from '@ionic/angular';
import { TextToSpeech } from '@capacitor-community/text-to-speech';

// Import the animals data
import { animalsData } from '../data/animals-data';

interface Animal {
  name: string;
  picture: string;
  yorubaName: string;
}

@Component({
  selector: 'app-dictionary',
  templateUrl: './dictionary.page.html',
  styleUrls: ['./dictionary.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class DictionaryPage implements OnInit {
  animals: Animal[] = [];
  filteredAnimals: Animal[] = [];
  searchTerm: string = '';
  selectedCategory: string = 'all';
  isLoading: boolean = true;
  isModalOpen: boolean = false;
  selectedAnimal: Animal | null = null;

  // Category mappings for filtering
  private categoryMappings: { [key: string]: string[] } = {
    mammals: [
      'Tiger', 'Lion', 'Elephant', 'Dog', 'Cat', 'Goat', 'Cow', 'Horse', 'Chicken',
      'Leopard', 'Buffalo', 'Hippopotamus', 'Giraffe', 'Rhinoceros', 'Deer', 'Cheetah',
      'Hyena', 'Wild Boar', 'Fox', 'Monkey', 'Chimpanzee', 'Baboon', 'Ape', 'Squirrel',
      'Hedgehog', 'Porcupine', 'Mouse', 'Pouch Rat', 'Grasscutter', 'Civet cat',
      'Yellow-haired Monkey', 'Hound', 'Jackal'
    ],
    birds: [
      'Eagle', 'Vulture', 'Kite', 'Owl', 'Ostrich', 'Peacock', 'Guinea fowl', 'Raven',
      'Pelican', 'Duck', 'Water Bird', 'Sea Bird', 'Seagulls', 'Cattle-egret', 'Grey Heron',
      'Dove', 'Wild Pigeon', 'Swallow', 'Weaver', 'Canary', 'Woodpecker', 'Palm bird',
      'Songbird', 'Bushfowl'
    ],
    reptiles: [
      'Python', 'Cobra', 'Viper', 'Alligator', 'Monitor Lizard', 'Lizard', 'Gecko',
      'Chameleon', 'Tortoise'
    ],
    insects: [
      'Butterfly', 'Dragonfly', 'Beetle', 'Scorpion', 'Bee', 'Housefly', 'Mosquito',
      'Gadfly', 'Gnats', 'Termite', 'Tick/Flea'
    ],
    aquatic: [
      'Fish', 'Shark', 'Jellyfish', 'Lobster', 'Crab', 'Fresh-water Snail'
    ]
  };

  constructor(
    private modalController: ModalController,
    private platform: Platform
  ) {}

  ngOnInit() {
    this.loadAnimals();
  }

  async loadAnimals() {
    try {
      this.isLoading = true;
      
      // Simulate loading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 500));
      
      this.animals = animalsData.sort((a, b) => a.name.localeCompare(b.name));
      this.filteredAnimals = [...this.animals];
      
      this.isLoading = false;
    } catch (error) {
      console.error('Error loading animals:', error);
      this.isLoading = false;
    }
  }

  onSearchChange(event: any) {
    this.searchTerm = event.detail.value.toLowerCase();
    this.applyFilters();
  }

  onCategoryChange(event: any) {
    this.selectedCategory = event.detail.value;
    this.applyFilters();
  }

  applyFilters() {
    let filtered = [...this.animals];

    // Apply category filter
    if (this.selectedCategory !== 'all') {
      const categoryAnimals = this.categoryMappings[this.selectedCategory] || [];
      filtered = filtered.filter(animal => 
        categoryAnimals.includes(animal.name)
      );
    }

    // Apply search filter
    if (this.searchTerm.trim()) {
      filtered = filtered.filter(animal =>
        animal.name.toLowerCase().includes(this.searchTerm) ||
        animal.yorubaName.toLowerCase().includes(this.searchTerm)
      );
    }

    this.filteredAnimals = filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  openAnimalDetail(animal: Animal) {
    this.selectedAnimal = animal;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.selectedAnimal = null;
  }

  async speakText(text: string) {
    try {
      if (this.platform.is('capacitor')) {
        await this.nativeSpeechSynthesis(text);
      } else {
        await this.webSpeechSynthesis(text);
      }
    } catch (error) {
      console.error('Error speaking text:', error);
    }
  }

  private async nativeSpeechSynthesis(text: string) {
    await TextToSpeech.speak({
      text: text,
      lang: 'yo',
      rate: 1.0,
      pitch: 1.0,
    });
  }

  private async webSpeechSynthesis(text: string) {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'yo';
    utterance.rate = 1.0;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  }

  onImageError(event: any) {
    // Fallback image or hide broken images
    event.target.style.display = 'none';
  }

  getAnimalRows(): Animal[][] {
    const rows: Animal[][] = [];
    const itemsPerRow = 2;
    
    for (let i = 0; i < this.filteredAnimals.length; i += itemsPerRow) {
      rows.push(this.filteredAnimals.slice(i, i + itemsPerRow));
    }
    
    return rows;
  }
}
