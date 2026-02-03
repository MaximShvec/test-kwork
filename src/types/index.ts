
import type { ReactNode } from 'react';

export interface FurnitureCategory {
  id: string;
  name: string;
  icon?: ReactNode;


}

export interface PortfolioItem {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string; // Should match FurnitureCategory['name'] (case-insensitive)
  dataAiHint?: string;
  price?: number; // Optional: specific price for this item

}

export interface Testimonial {
  quote: string;
  name: string;
  designation: string;
  src: string;
  dataAiHint?: string;
}

    