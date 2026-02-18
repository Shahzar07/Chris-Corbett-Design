import React from 'react';
import { SITE_COPY, PROJECTS, SERVICES, TESTIMONIALS } from './constants';
import { ArrowRight, Instagram, Linkedin, Mail, Phone, ExternalLink, Quote } from 'lucide-react';
import VoiceAgent from './components/VoiceAgent';

const App: React.FC = () => {
  return (
    <div className="min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="text-2xl font-semibold tracking-tight uppercase">
            {SITE_COPY.name}
          </div>
          <div className="hidden md:flex items-center space-x-8 text-sm font-medium uppercase tracking-widest text-slate-600">
            <a href="#work" className="hover:text-slate-900 transition">Work</a>
            <a href="#services" className="hover:text-slate-900 transition">Services</a>
            <a href="#about" className="hover:text-slate-900 transition">About</a>
            <a href="#contact" className="hover:text-slate-900 transition">Contact</a>
          </div>
          <a href="#contact" className="bg-slate-900 text-white px-6 py-2 rounded-full text-sm uppercase tracking-widest hover:bg-slate-800 transition">
            Inquire
          </a>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1596436889106-be35e843f974?auto=format&fit=crop&w=2000&q=80" 
            className="w-full h-full object-cover scale-105"
            alt="Hero Landscape"
          />
          <div className="absolute inset-0 bg-black/40"></div>
        </div>
        
        <div className="relative z-10 text-center text-white px-4 max-w-4xl mx-auto">
          <h1 className="text-5xl md:text-8xl font-light mb-6 leading-tight">
            Artistry in <br /> <span className="italic">Nature</span>
          </h1>
          <p className="text-lg md:text-xl font-light mb-10 tracking-wide text-white/90">
            {SITE_COPY.title}
          </p>
          <div className="flex flex-col md:flex-row items-center justify-center space-y-4 md:space-y-0 md:space-x-6">
            <a href="#work" className="w-full md:w-auto px-8 py-4 bg-white text-slate-900 rounded-full font-medium flex items-center justify-center group">
              View Projects
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
            <a href="#contact" className="w-full md:w-auto px-8 py-4 bg-transparent border border-white text-white rounded-full font-medium hover:bg-white/10 transition">
              Let's Connect
            </a>
          </div>
        </div>
        
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/50 text-xs uppercase tracking-widest animate-bounce">
          Scroll to explore
        </div>
      </section>

      {/* Intro Section */}
      <section id="about" className="py-24 md:py-32 bg-white">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-16 items-center">
          <div>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 block">Our Story</span>
            <h2 className="text-4xl md:text-6xl mb-8 leading-tight">
              Designing landscapes that tell a story.
            </h2>
            <p className="text-xl text-slate-600 leading-relaxed mb-8">
              {SITE_COPY.bio}
            </p>
            <div className="flex items-center space-x-12">
              <div>
                <div className="text-3xl font-semibold mb-1">30+</div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Years Experience</div>
              </div>
              <div>
                <div className="text-3xl font-semibold mb-1">500+</div>
                <div className="text-xs uppercase tracking-widest text-slate-400">Projects Completed</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img 
              src="https://images.unsplash.com/photo-1598902108854-10e335adac99?auto=format&fit=crop&w=800&q=80" 
              className="rounded-2xl shadow-2xl"
              alt="Design Process"
            />
            <div className="absolute -bottom-6 -left-6 bg-slate-900 text-white p-8 rounded-xl max-w-xs hidden lg:block">
              <p className="text-lg italic font-light mb-4">"Chris has an uncanny ability to read the land and suggest exactly what it needs to breathe."</p>
              <p className="text-sm font-bold uppercase tracking-widest">— Architectural Digest</p>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Grid */}
      <section id="work" className="py-24 bg-[#fdfcf9]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 space-y-4 md:space-y-0">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 block">Portfolio</span>
              <h2 className="text-4xl md:text-6xl">Selected Works</h2>
            </div>
            <a href="#" className="text-sm font-bold uppercase tracking-widest text-slate-900 border-b border-slate-900 pb-1 flex items-center group">
              View All Projects <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </a>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            {PROJECTS.map((project, idx) => (
              <div key={project.id} className={`group cursor-pointer ${idx % 2 !== 0 ? 'md:translate-y-24' : ''}`}>
                <div className="overflow-hidden rounded-2xl aspect-[4/3] mb-6">
                  <img 
                    src={project.image} 
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-700"
                  />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 block">{project.category}</span>
                <h3 className="text-3xl mb-3">{project.title}</h3>
                <p className="text-slate-600 line-clamp-2 leading-relaxed">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="h-32 md:h-48"></div> {/* Spacer for offset grid */}
      </section>

      {/* Services Section */}
      <section id="services" className="py-24 bg-slate-900 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className="text-xs font-bold uppercase tracking-[0.3em] text-slate-400 mb-4 block">Expertise</span>
            <h2 className="text-4xl md:text-6xl mb-6">A Full-Service Approach</h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              We guide our clients through every stage of development, from initial site planning to the final selection of garden furniture.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((service, idx) => (
              <div key={idx} className="p-8 border border-white/10 rounded-2xl hover:bg-white/5 transition group">
                <div className="bg-white/10 p-3 rounded-lg inline-block mb-6 group-hover:bg-white group-hover:text-slate-900 transition-colors">
                  {service.icon}
                </div>
                <h3 className="text-xl font-semibold mb-4">{service.title}</h3>
                <p className="text-slate-400 leading-relaxed text-sm">
                  {service.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Marquee Section */}
      <section className="py-24 bg-white overflow-hidden border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 mb-16 text-center">
          <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 block">Perspectives</span>
          <h2 className="text-4xl md:text-5xl serif">Voices of the Landscape</h2>
        </div>
        
        <div className="relative h-[600px] flex justify-center space-x-8 px-4">
          {/* Left Column - Scrolling Up */}
          <div className="flex-1 max-w-md relative overflow-hidden hidden md:block">
            <div className="flex flex-col space-y-8 animate-scroll-up">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <div key={i} className="bg-slate-50 p-10 rounded-[2rem] border border-slate-100 shadow-sm">
                  <Quote className="w-8 h-8 text-slate-200 mb-6" />
                  <p className="text-xl serif italic mb-6 leading-relaxed text-slate-800">"{t.quote}"</p>
                  <div>
                    <p className="font-bold uppercase tracking-widest text-xs text-slate-900">{t.author}</p>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Scrolling Down */}
          <div className="flex-1 max-w-md relative overflow-hidden">
            <div className="flex flex-col space-y-8 animate-scroll-down">
              {[...TESTIMONIALS.reverse(), ...TESTIMONIALS].map((t, i) => (
                <div key={i} className="bg-white p-10 rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50">
                  <Quote className="w-8 h-8 text-slate-100 mb-6" />
                  <p className="text-xl serif italic mb-6 leading-relaxed text-slate-800">"{t.quote}"</p>
                  <div>
                    <p className="font-bold uppercase tracking-widest text-xs text-slate-900">{t.author}</p>
                    <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">{t.role}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* Gradient Overlays for Fade Effect */}
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white to-transparent pointer-events-none z-10"></div>
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white to-transparent pointer-events-none z-10"></div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-16">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 block">Get In Touch</span>
              <h2 className="text-4xl md:text-6xl mb-8 leading-tight">Start your transformation today.</h2>
              <div className="space-y-8">
                <div className="flex items-start space-x-4">
                  <div className="bg-slate-100 p-3 rounded-full">
                    <Mail className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Email</p>
                    <p className="text-lg">studio@chriscorbettdesign.com</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-slate-100 p-3 rounded-full">
                    <Phone className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Phone</p>
                    <p className="text-lg">+1 (631) 555-0123</p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="bg-slate-100 p-3 rounded-full">
                    <Instagram className="w-5 h-5 text-slate-600" />
                  </div>
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">Social</p>
                    <div className="flex space-x-4 mt-2">
                      <a href="#" className="text-slate-600 hover:text-slate-900 transition"><Instagram /></a>
                      <a href="#" className="text-slate-600 hover:text-slate-900 transition"><Linkedin /></a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="bg-slate-50 p-10 rounded-3xl">
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">First Name</label>
                    <input type="text" className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition" />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Last Name</label>
                    <input type="text" className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Email Address</label>
                  <input type="email" className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-slate-500">Project Description</label>
                  <textarea rows={4} className="w-full bg-white border border-slate-200 p-4 rounded-xl focus:outline-none focus:ring-2 focus:ring-slate-900 transition"></textarea>
                </div>
                <button type="submit" className="w-full bg-slate-900 text-white py-5 rounded-xl font-bold uppercase tracking-[0.2em] hover:bg-slate-800 transition">
                  Send Inquiry
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-white border-t border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between text-slate-400 text-sm">
          <p>© 2024 {SITE_COPY.name}. All rights reserved.</p>
          <div className="flex space-x-8 mt-4 md:mt-0 uppercase tracking-widest text-xs">
            <a href="#" className="hover:text-slate-900 transition">Privacy</a>
            <a href="#" className="hover:text-slate-900 transition">Terms</a>
            <a href="#" className="hover:text-slate-900 transition">Cookies</a>
          </div>
        </div>
      </footer>

      {/* AI Voice Agent Component */}
      <VoiceAgent />
    </div>
  );
};

export default App;