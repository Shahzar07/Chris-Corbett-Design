import React, { useState } from 'react';
import { SITE_COPY, PROJECTS, SERVICES, TESTIMONIALS } from './constants.tsx';
import { ArrowRight, Instagram, Linkedin, Mail, Phone, Quote, Menu, X as CloseIcon } from 'lucide-react';
import VoiceAgent from './components/VoiceAgent.tsx';

const App: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 md:px-6 h-16 md:h-20 flex items-center justify-between">
          <div className="text-lg md:text-2xl font-semibold tracking-tighter uppercase whitespace-nowrap overflow-hidden text-ellipsis mr-4">
            {SITE_COPY.name}
          </div>
          
          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-500">
            <a href="#work" className="hover:text-slate-900 transition-colors">Work</a>
            <a href="#services" className="hover:text-slate-900 transition-colors">Services</a>
            <a href="#about" className="hover:text-slate-900 transition-colors">About</a>
            <a href="#contact" className="hover:text-slate-900 transition-colors">Contact</a>
          </div>

          <div className="flex items-center space-x-4">
            <a href="#contact" className="hidden sm:inline-block bg-slate-900 text-white px-5 md:px-8 py-2 md:py-2.5 rounded-full text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition active:scale-95">
              Inquire
            </a>
            
            {/* Mobile Menu Toggle */}
            <button 
              className="md:hidden p-2 text-slate-600"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <CloseIcon className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 top-16 bg-white z-40 p-6 flex flex-col space-y-8 text-2xl font-light">
            <a href="#work" onClick={() => setMobileMenuOpen(false)} className="border-b border-slate-100 pb-4">Work</a>
            <a href="#services" onClick={() => setMobileMenuOpen(false)} className="border-b border-slate-100 pb-4">Services</a>
            <a href="#about" onClick={() => setMobileMenuOpen(false)} className="border-b border-slate-100 pb-4">About</a>
            <a href="#contact" onClick={() => setMobileMenuOpen(false)} className="border-b border-slate-100 pb-4">Contact</a>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="relative min-h-[90vh] md:h-screen flex items-center justify-center overflow-hidden pt-20">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=2000&q=80" 
            className="w-full h-full object-cover scale-105"
            alt="Elite Landscape Architecture"
          />
          <div className="absolute inset-0 bg-black/45"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-6 max-w-5xl mx-auto">
          <h1 className="text-5xl sm:text-7xl md:text-8xl lg:text-9xl font-light mb-8 leading-[0.9] tracking-tight">
            Artistry in <br /> <span className="italic font-normal">Nature</span>
          </h1>
          <p className="text-sm md:text-lg font-light mb-12 tracking-[0.3em] uppercase text-white/80">
            {SITE_COPY.title}
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <a href="#work" className="w-full sm:w-auto px-10 py-4 md:py-5 bg-white text-slate-900 rounded-full text-xs font-bold uppercase tracking-[0.2em] flex items-center justify-center group transition-all hover:pr-12">
              Explore Projects
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#contact" className="w-full sm:w-auto px-10 py-4 md:py-5 bg-transparent border border-white/40 text-white rounded-full text-xs font-bold uppercase tracking-[0.2em] hover:bg-white hover:text-slate-900 transition-all">
              Consultation
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 text-white/40 text-[9px] uppercase tracking-[0.4em] animate-pulse hidden sm:block">
          Scroll to discover
        </div>
      </section>

      {/* Intro Section */}
      <section id="about" className="py-20 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 grid md:grid-cols-12 gap-12 md:gap-20 items-center">
          <div className="md:col-span-7">
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-6 block">Legacy of Excellence</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl mb-10 leading-[1.1] tracking-tight">
              Spaces that <span className="italic">breathe</span> and <span className="italic text-slate-400">endure</span>.
            </h2>
            <p className="text-lg md:text-xl text-slate-600 leading-relaxed mb-10 font-light max-w-2xl">
              {SITE_COPY.bio}
            </p>
            <div className="flex flex-wrap gap-8 md:gap-16">
              <div>
                <div className="text-4xl font-light mb-1">30+</div>
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Years Portfolio</div>
              </div>
              <div>
                <div className="text-4xl font-light mb-1">500+</div>
                <div className="text-[9px] font-bold uppercase tracking-[0.2em] text-slate-400">Global Projects</div>
              </div>
            </div>
          </div>
          <div className="md:col-span-5 relative mt-12 md:mt-0">
            <div className="aspect-[4/5] overflow-hidden rounded-3xl shadow-2xl">
              <img 
                src="https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=1200&q=80" 
                className="w-full h-full object-cover"
                alt="Architectural Detailing"
              />
            </div>
            <div className="absolute -bottom-8 -right-4 md:-right-8 bg-slate-900 text-white p-6 md:p-8 rounded-2xl max-w-[240px] md:max-w-xs shadow-xl scale-90 sm:scale-100">
              <Quote className="w-6 h-6 text-slate-500 mb-4" />
              <p className="text-base italic font-light mb-4 text-white/90 leading-relaxed">"Chris has an uncanny ability to read the land and suggest exactly what it needs."</p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">— Architectural Digest</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section id="work" className="py-20 md:py-32 bg-[#fdfcf9]">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 md:mb-24 gap-6">
            <div className="max-w-2xl">
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-6 block">Portfolio</span>
              <h2 className="text-4xl md:text-7xl leading-none tracking-tight">Selected Works</h2>
            </div>
            <a href="#" className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-900 border-b border-slate-900 pb-1 flex items-center group self-start md:self-auto">
              Archive <ArrowRight className="ml-2 w-3 h-3 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid sm:grid-cols-2 gap-x-8 md:gap-x-16 gap-y-20 md:gap-y-32">
            {PROJECTS.map((project, idx) => (
              <div key={project.id} className={`group cursor-pointer ${idx % 2 !== 0 ? 'md:mt-32' : ''}`}>
                <div className="overflow-hidden rounded-2xl md:rounded-[2rem] aspect-[4/5] sm:aspect-[4/3] mb-8 shadow-sm">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-[1.5s] ease-out"
                  />
                </div>
                <div className="px-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-3 block">{project.category}</span>
                  <h3 className="text-2xl md:text-4xl mb-4 font-light tracking-tight">{project.title}</h3>
                  <p className="text-slate-500 text-sm md:text-base font-light leading-relaxed line-clamp-2">{project.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="h-20 md:h-40"></div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 md:py-32 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="max-w-3xl mb-16 md:mb-24">
            <span className="text-[10px] font-bold uppercase tracking-[0.4em] text-slate-500 mb-6 block">Service Spectrum</span>
            <h2 className="text-4xl md:text-7xl mb-8 tracking-tight">Comprehensive Architectural <span className="italic text-slate-400 font-light">Vision</span>.</h2>
            <p className="text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl">
              From historic restoration to contemporary master planning, we manage the intricate dialogue between built structures and the natural world.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
            {SERVICES.map((service, idx) => (
              <div key={idx} className="p-8 md:p-10 border border-white/5 rounded-3xl hover:bg-white/[0.03] transition-all group flex flex-col justify-between min-h-[320px]">
                <div>
                  <div className="text-white mb-8 group-hover:scale-110 transition-transform origin-left">
                    {service.icon}
                  </div>
                  <h3 className="text-xl md:text-2xl font-light mb-6 tracking-tight">{service.title}</h3>
                  <p className="text-slate-500 leading-relaxed text-sm font-light">
                    {service.description}
                  </p>
                </div>
                <div className="mt-8 pt-8 border-t border-white/5 opacity-0 group-hover:opacity-100 transition-opacity">
                   <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/40">Inquire Details</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Marquee Section */}
      <section className="py-24 md:py-32 bg-white overflow-hidden border-b border-slate-100 relative">
        <div className="max-w-7xl mx-auto px-4 md:px-6 mb-16 md:mb-20">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-6 block">Perspective</span>
          <h2 className="text-4xl md:text-6xl tracking-tight leading-none">Voices of the Landscape</h2>
        </div>
        
        <div className="relative h-[500px] md:h-[700px] flex justify-center gap-6 md:gap-12 px-4">
          {/* Left Column - Scrolling Up */}
          <div className="flex-1 max-w-lg relative overflow-hidden hidden sm:block">
            <div className="flex flex-col space-y-8 animate-scroll-up">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <div key={`up-${i}`} className="bg-slate-50 p-8 md:p-12 rounded-[2rem] border border-slate-100/50">
                  <Quote className="w-8 h-8 text-slate-200 mb-8" />
                  <p className="text-xl md:text-2xl italic mb-8 leading-relaxed font-light text-slate-800">"{t.quote}"</p>
                  <div>
                    <p className="font-bold uppercase tracking-[0.2em] text-[10px] text-slate-900">{t.author}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Scrolling Down */}
          <div className="flex-1 max-w-lg relative overflow-hidden">
            <div className="flex flex-col space-y-8 animate-scroll-down">
              {/* Using a static reversed list to avoid mutation during render */}
              {[...TESTIMONIALS].reverse().concat([...TESTIMONIALS].reverse()).map((t, i) => (
                <div key={`down-${i}`} className="bg-white p-8 md:p-12 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/40">
                  <Quote className="w-8 h-8 text-slate-100 mb-8" />
                  <p className="text-xl md:text-2xl italic mb-8 leading-relaxed font-light text-slate-800">"{t.quote}"</p>
                  <div>
                    <p className="font-bold uppercase tracking-[0.2em] text-[10px] text-slate-900">{t.author}</p>
                    <p className="text-[10px] text-slate-400 mt-1 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Fades */}
          <div className="absolute top-0 left-0 right-0 h-40 bg-gradient-to-b from-white via-white/80 to-transparent pointer-events-none z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-white via-white/80 to-transparent pointer-events-none z-10"></div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6">
          <div className="grid lg:grid-cols-2 gap-20">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-6 block">Inquiries</span>
              <h2 className="text-4xl md:text-7xl mb-12 tracking-tight leading-[1.1]">Transform your outdoor <span className="italic">legacy</span>.</h2>
              
              <div className="space-y-10">
                <div className="flex items-start space-x-6">
                  <div className="bg-slate-50 p-4 rounded-full">
                    <Mail className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">Correspondence</p>
                    <p className="text-xl md:text-2xl font-light hover:text-slate-500 transition-colors">
                      <a href="mailto:studio@chriscorbettdesign.com">studio@chriscorbettdesign.com</a>
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-6">
                  <div className="bg-slate-50 p-4 rounded-full">
                    <Phone className="w-5 h-5 text-slate-400" />
                  </div>
                  <div>
                    <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">Direct Studio</p>
                    <p className="text-xl md:text-2xl font-light">+1 (631) 555-0123</p>
                  </div>
                </div>
                <div className="flex items-center space-x-6 pt-6">
                   <a href="#" className="p-3 bg-slate-50 rounded-full hover:bg-slate-100 transition"><Instagram className="w-5 h-5" /></a>
                   <a href="#" className="p-3 bg-slate-50 rounded-full hover:bg-slate-100 transition"><Linkedin className="w-5 h-5" /></a>
                </div>
              </div>
            </div>
            
            <div className="bg-slate-50 p-8 md:p-16 rounded-[2.5rem] shadow-sm">
              <form className="space-y-8" onSubmit={(e) => e.preventDefault()}>
                <div className="grid sm:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">First Name</label>
                    <input type="text" className="w-full bg-white border-b border-slate-200 py-4 px-2 focus:outline-none focus:border-slate-900 transition-colors" placeholder="Jane" />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Last Name</label>
                    <input type="text" className="w-full bg-white border-b border-slate-200 py-4 px-2 focus:outline-none focus:border-slate-900 transition-colors" placeholder="Doe" />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Electronic Mail</label>
                  <input type="email" className="w-full bg-white border-b border-slate-200 py-4 px-2 focus:outline-none focus:border-slate-900 transition-colors" placeholder="jane@example.com" />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-500 ml-1">Project Intent</label>
                  <textarea rows={3} className="w-full bg-white border-b border-slate-200 py-4 px-2 focus:outline-none focus:border-slate-900 transition-colors resize-none" placeholder="Brief overview of your site and vision..."></textarea>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-full font-bold uppercase tracking-[0.3em] text-[10px] hover:bg-slate-800 transition active:scale-95 shadow-xl shadow-slate-900/10">
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 md:py-20 bg-white border-t border-slate-100 mt-auto">
        <div className="max-w-7xl mx-auto px-4 md:px-6 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="text-center md:text-left">
            <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400 mb-2">Chris Corbett Design Studio</p>
            <p className="text-slate-400 text-[10px] uppercase tracking-widest">© 2024. All architectural rights reserved.</p>
          </div>
          <div className="flex flex-wrap justify-center gap-8 md:gap-12 text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">
            <a href="#" className="hover:text-slate-900 transition">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition">Terms</a>
            <a href="#" className="hover:text-slate-900 transition">Archives</a>
          </div>
        </div>
      </footer>

      {/* AI Voice Agent Component */}
      <VoiceAgent />
    </div>
  );
};

export default App;