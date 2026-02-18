import React from 'react';
import { Leaf, Ruler, Pencil, ShieldCheck, Map, Users } from 'lucide-react';
import { Project, Service } from './types';

export const SITE_COPY = {
  name: "Chris Corbett Design",
  title: "Landscape Architecture & Master Planning",
  bio: "With over 30 years of experience, Chris Corbett transforms outdoor spaces into timeless environments. From high-end residential estates to complex commercial master plans, our designs bridge the gap between architectural precision and natural beauty.",
  location: "Sag Harbor, NY | Palm Beach, FL",
};

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Modern Coastal Estate',
    category: 'Residential',
    image: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    description: 'A seamless integration of pool, patio, and native grasses overlooking the Atlantic.'
  },
  {
    id: '2',
    title: 'The Orchard Retreat',
    category: 'Conservation',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80',
    description: 'Restoration of a historic apple orchard with contemporary gathering spaces.'
  },
  {
    id: '3',
    title: 'Skyline Terrace',
    category: 'Urban',
    image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=1200&q=80',
    description: 'A lush rooftop sanctuary in the heart of the city.'
  },
  {
    id: '4',
    title: 'Canyon Creek Master Plan',
    category: 'Commercial',
    image: 'https://chriscorbettdesign.com/wp-content/uploads/2023/06/untitled-3-1.jpg',
    description: 'An expansive community park focused on water conservation and accessibility.'
  }
];

export const TESTIMONIALS = [
  {
    quote: "Chris's vision for our family estate in Sag Harbor turned a simple garden into a multi-generational sanctuary.",
    author: "The Vanderbilt Family",
    role: "Private Estate Owner"
  },
  {
    quote: "The bridge between architecture and landscape has never felt more seamless. Simply world-class design work.",
    author: "Architectural Digest",
    role: "Feature Review"
  },
  {
    quote: "Exceptional master planning that honors the heritage of the land while embracing a sustainable future.",
    author: "Director of Conservation",
    role: "NGO Partner"
  },
  {
    quote: "A meticulous eye for detail. Every stone placement feels like it was ordained by nature itself.",
    author: "Michael Chen",
    role: "Residential Client, Palm Beach"
  },
  {
    quote: "Their ability to work with native species while maintaining a high-luxury aesthetic is truly unmatched in the industry.",
    author: "Garden Design Magazine",
    role: "Editorial Spotlight"
  },
  {
    quote: "From initial concept to final construction management, the process was flawlessly professional and collaborative.",
    author: "Julian Thorne",
    role: "Estate Manager, East Hampton"
  }
];

export const SERVICES: Service[] = [
  {
    title: "Master Planning",
    description: "Holistic site analysis and long-term visioning for estates and commercial developments.",
    icon: <Map className="w-6 h-6" />
  },
  {
    title: "Custom Landscape Design",
    description: "Detailed plant palettes, hardscape detailing, and water feature integration.",
    icon: <Pencil className="w-6 h-6" />
  },
  {
    title: "Construction Management",
    description: "Overseeing the realization of designs to ensure architectural integrity and quality.",
    icon: <ShieldCheck className="w-6 h-6" />
  },
  {
    title: "Ecological Restoration",
    description: "Utilizing native species to restore local biodiversity and manage storm water.",
    icon: <Leaf className="w-6 h-6" />
  }
];

export const SYSTEM_INSTRUCTION = `
You are the Studio Assistant for Chris Corbett Design, an elite landscape architecture firm.
Your tone is professional, sophisticated, and helpful. 

Key Info:
- Principal: Chris Corbett.
- Focus: High-end residential, commercial master planning, and conservation.
- Regions: The Hamptons (Sag Harbor), Palm Beach, and luxury urban projects.
- Design Philosophy: Bridging the gap between architecture and nature. Timeless, functional, and sustainable.
- Services: Master planning, custom design, construction management, environmental restoration.

Goal:
Encourage users to book a consultation or view the portfolio. Answer questions about the firm's history and process based on the info above. If you don't know something, offer to have a human team member follow up.
`;