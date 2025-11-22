import { useState, useEffect } from 'react';
import { Calendar, Sparkles, Trophy, Clock, Users, Zap, Award, MapPin, Phone, Menu, X, ChevronDown } from 'lucide-react';
import { ParticleBackground } from '@/components/ui/particle-background';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { NeonButton } from '@/components/ui/neon-button';
import { GlassCard } from '@/components/ui/glass-card';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { label: 'About', id: 'about' },
    { label: 'Domains', id: 'domains' },
    { label: 'Prizes', id: 'prizes' },
    { label: 'Venue Flow', id: 'venue-flow' },
    { label: 'Judging', id: 'judging' },
    { label: 'Contact', id: 'contact' }
  ];

  return (
    <div className="min-h-screen gradient-bg text-foreground overflow-x-hidden">
      <ParticleBackground />

      <nav className="fixed top-0 left-0 right-0 z-50 glass-effect border-b border-primary/20">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sparkles className="w-8 h-8 text-primary animate-pulse-glow" />
              <span className="text-2xl font-bold gradient-text">HACKAURA</span>
            </div>

            <div className="hidden xl:flex items-center gap-8">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="text-foreground/80 hover:text-primary transition-colors duration-300"
                >
                  {item.label}
                </button>
              ))}
              <NeonButton href="#register" variant="primary">
                Register
              </NeonButton>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden text-foreground"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="xl:hidden mt-4 pb-4 space-y-4">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  className="block w-full text-left text-foreground/80 hover:text-primary transition-colors duration-300 py-2"
                >
                  {item.label}
                </button>
              ))}
              <NeonButton href="#register" variant="primary" className="w-full">
                Register
              </NeonButton>
            </div>
          )}
        </div>
      </nav>

      <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4">
        <div className="container mx-auto text-center space-y-8 z-10">
          <div className="inline-flex items-center gap-2 glass-effect border border-primary/30 rounded-full px-6 py-3 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-sm uppercase tracking-wider">November 28-29, 2025</span>
          </div>

          <h1 className="text-5xl xl:text-8xl font-bold mb-4">
            <span className="gradient-text">HACKAURA</span>
            <br />
            <span className="text-3xl xl:text-5xl text-foreground/80">2025</span>
          </h1>

          <p className="text-xl xl:text-3xl font-semibold text-primary mb-4">
            Ignite. Innovate. Impact.
          </p>

          <p className="text-base xl:text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
            Join us for a 24-hour national-level hackathon organized by Vikram Sarabhai Tech Club at VSMIT, Nipani. 
            Compete in Generative AI and Cybersecurity domains for a prize pool of ₹45,000.
          </p>

          <div className="flex flex-col xl:flex-row items-center justify-center gap-4 mb-12">
            <NeonButton href="#register" variant="primary" icon={<Zap />}>
              Register Now
            </NeonButton>
            <NeonButton onClick={() => scrollToSection('about')} variant="outline" icon={<ChevronDown />}>
              Learn More
            </NeonButton>
          </div>

          <div className="mt-16">
            <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-6">
              Registration Closes In
            </h3>
            <CountdownTimer />
          </div>
        </div>
      </section>

      <section id="about" className="relative py-24 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl xl:text-6xl font-bold text-center mb-4">
            <span className="gradient-text">About HACKAURA</span>
          </h2>
          <p className="text-center text-foreground/70 max-w-3xl mx-auto mb-16">
            HACKAURA 2025 is a premier 24-hour coding marathon where innovation meets excellence. 
            Organized by the Vikram Sarabhai Tech Club at VSMIT, Nipani, this national-level hackathon 
            brings together passionate developers, designers, and problem-solvers to create groundbreaking solutions.
          </p>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <GlassCard glowColor="cyan" hover3d>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                  <Users className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Flash Mob Kickoff</h3>
                <p className="text-foreground/70 text-sm">
                  High-energy student performance to ignite the event with excitement and entertainment
                </p>
              </div>
            </GlassCard>

            <GlassCard glowColor="purple" hover3d>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
                  <Sparkles className="w-8 h-8 text-secondary" />
                </div>
                <h3 className="text-xl font-bold mb-2">Grand Inauguration</h3>
                <p className="text-foreground/70 text-sm">
                  Official welcome with guest introductions, event briefing, and rule announcements
                </p>
              </div>
            </GlassCard>

            <GlassCard glowColor="pink" hover3d>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                  <Clock className="w-8 h-8 text-accent" />
                </div>
                <h3 className="text-xl font-bold mb-2">24-Hour Marathon</h3>
                <p className="text-foreground/70 text-sm">
                  Non-stop coding with overnight stay allowed on campus to bring your ideas to life
                </p>
              </div>
            </GlassCard>

            <GlassCard glowColor="magenta" hover3d>
              <div className="text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-neon-magenta/20 flex items-center justify-center">
                  <Award className="w-8 h-8 text-neon-magenta" />
                </div>
                <h3 className="text-xl font-bold mb-2">Mentor Support</h3>
                <p className="text-foreground/70 text-sm">
                  Expert guidance throughout the event to help you overcome challenges and excel
                </p>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section id="domains" className="relative py-24 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl xl:text-6xl font-bold text-center mb-4">
            <span className="gradient-text">Competition Domains</span>
          </h2>
          <p className="text-center text-foreground/70 max-w-3xl mx-auto mb-16">
            Choose your battlefield and showcase your expertise in cutting-edge technology domains
          </p>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <GlassCard glowColor="cyan" hover3d>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
                    <Sparkles className="w-6 h-6 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold">Generative AI</h3>
                </div>
                <p className="text-foreground/70">
                  Focus on AI-powered innovative solutions using generative models and machine learning. 
                  Create intelligent systems that can generate content, solve complex problems, and push 
                  the boundaries of artificial intelligence.
                </p>
              </div>
            </GlassCard>

            <GlassCard glowColor="purple" hover3d>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-secondary/20 flex items-center justify-center">
                    <Zap className="w-6 h-6 text-secondary" />
                  </div>
                  <h3 className="text-2xl font-bold">Cybersecurity</h3>
                </div>
                <p className="text-foreground/70">
                  Build robust security solutions against cyber threats. Develop innovative tools and 
                  systems to protect digital assets, detect vulnerabilities, and create a safer digital 
                  ecosystem for everyone.
                </p>
              </div>
            </GlassCard>
          </div>

          <div className="mt-12 text-center">
            <GlassCard glowColor="pink" className="max-w-3xl mx-auto">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-neon-yellow/20 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-neon-yellow text-xl">⚡</span>
                </div>
                <div className="text-left">
                  <h4 className="font-bold text-lg mb-2">Problem Statements Revealed at Venue</h4>
                  <p className="text-foreground/70 text-sm">
                    Problem statements will be revealed exclusively at the venue after the grand inauguration. 
                    This ensures a fair and exciting competition for all participants.
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section id="prizes" className="relative py-24 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl xl:text-6xl font-bold text-center mb-4">
            <span className="gradient-text">Prize Distribution</span>
          </h2>
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-3 glass-effect border border-neon-yellow/30 rounded-2xl px-8 py-4">
              <Trophy className="w-8 h-8 text-neon-yellow animate-bounce" />
              <span className="text-3xl xl:text-4xl font-bold text-neon-yellow">₹45,000</span>
              <span className="text-foreground/70">Total Prize Pool</span>
            </div>
          </div>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            <GlassCard glowColor="cyan" hover3d>
              <h3 className="text-2xl font-bold mb-6 text-center">Main Awards</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/30">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-primary" />
                    <span className="font-semibold">1st Place</span>
                  </div>
                  <span className="text-primary font-bold">Cash Prize + Certificate</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/10 border border-secondary/30">
                  <div className="flex items-center gap-3">
                    <Trophy className="w-6 h-6 text-secondary" />
                    <span className="font-semibold">2nd Place</span>
                  </div>
                  <span className="text-secondary font-bold">Cash Prize + Certificate</span>
                </div>
              </div>
              <p className="text-center text-sm text-foreground/60 mt-4">
                For both Generative AI and Cybersecurity domains
              </p>
            </GlassCard>

            <GlassCard glowColor="purple" hover3d>
              <h3 className="text-2xl font-bold mb-6 text-center">Design Excellence Awards</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 rounded-xl bg-accent/10 border border-accent/30">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-accent" />
                    <span className="font-semibold">1st Place</span>
                  </div>
                  <span className="text-accent font-bold">Certificate</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-accent/10 border border-accent/30">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-accent" />
                    <span className="font-semibold">2nd Place</span>
                  </div>
                  <span className="text-accent font-bold">Certificate</span>
                </div>
                <div className="flex items-center justify-between p-4 rounded-xl bg-accent/10 border border-accent/30">
                  <div className="flex items-center gap-3">
                    <Award className="w-6 h-6 text-accent" />
                    <span className="font-semibold">3rd Place</span>
                  </div>
                  <span className="text-accent font-bold">Certificate</span>
                </div>
              </div>
              <p className="text-center text-sm text-foreground/60 mt-4">
                For both Generative AI and Cybersecurity domains
              </p>
            </GlassCard>
          </div>

          <div className="text-center">
            <GlassCard glowColor="magenta" className="max-w-2xl mx-auto">
              <p className="text-lg">
                <span className="font-bold text-neon-magenta">Participation Certificates</span> for all participants
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      <section id="venue-flow" className="relative py-24 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl xl:text-6xl font-bold text-center mb-4">
            <span className="gradient-text">On-Venue Flow</span>
          </h2>
          <p className="text-center text-foreground/70 max-w-3xl mx-auto mb-4">
            Day 1 - November 28, 2025
          </p>
          <p className="text-center text-sm text-foreground/60 mb-16">
            Follow the timeline to make the most of your hackathon experience
          </p>

          <div className="max-w-4xl mx-auto space-y-6">
            <GlassCard glowColor="cyan" hover3d>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-primary">11:30 AM</span>
                    <span className="text-xl font-semibold">Entry Cut-Off & Verification</span>
                  </div>
                  <ul className="text-foreground/70 space-y-1 text-sm">
                    <li>• ID verification mandatory</li>
                    <li>• Payment collection at venue</li>
                    <li>• Team Identity Card distribution</li>
                    <li>• Team leader presence required</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            <GlassCard glowColor="purple" hover3d>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-10 h-10 text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-secondary">12:00 PM</span>
                    <span className="text-xl font-semibold">Flash Mob Performance</span>
                  </div>
                  <ul className="text-foreground/70 space-y-1 text-sm">
                    <li>• High-energy student performance</li>
                    <li>• Entertainment and excitement</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            <GlassCard glowColor="pink" hover3d>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Sparkles className="w-10 h-10 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-accent">12:15 PM</span>
                    <span className="text-xl font-semibold">Grand Inauguration</span>
                  </div>
                  <ul className="text-foreground/70 space-y-1 text-sm">
                    <li>• Welcome speech</li>
                    <li>• Guest introduction</li>
                    <li>• Event briefing</li>
                    <li>• Rule announcement</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            <GlassCard glowColor="magenta" hover3d>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-neon-magenta/20 flex items-center justify-center flex-shrink-0">
                  <Zap className="w-10 h-10 text-neon-magenta" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-neon-magenta">1:00 PM</span>
                    <span className="text-xl font-semibold">Problem Statement Reveal</span>
                  </div>
                  <ul className="text-foreground/70 space-y-1 text-sm">
                    <li>• Domains: Gen AI & Cybersecurity</li>
                    <li>• Problem statements revealed on venue</li>
                    <li>• Domain confirmation by teams</li>
                    <li>• No changes allowed after confirmation</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            <GlassCard glowColor="cyan" hover3d>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-primary">1:30 PM</span>
                    <span className="text-xl font-semibold">Desk Setup & Preparation</span>
                  </div>
                  <ul className="text-foreground/70 space-y-1 text-sm">
                    <li>• Desk allocation</li>
                    <li>• Wi-Fi access setup</li>
                    <li>• Power extension setup</li>
                    <li>• Snacks & lunch schedule</li>
                  </ul>
                </div>
              </div>
            </GlassCard>

            <GlassCard glowColor="purple" hover3d>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-secondary/20 flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                  <Trophy className="w-10 h-10 text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-secondary">2:00 PM</span>
                    <span className="text-xl font-semibold">Hackathon Begins!</span>
                  </div>
                  <p className="text-foreground/70 text-sm">
                    24-hour coding marathon starts - Let the innovation begin!
                  </p>
                </div>
              </div>
            </GlassCard>
          </div>

          <div className="mt-12 max-w-4xl mx-auto">
            <GlassCard glowColor="pink">
              <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span className="text-neon-yellow text-2xl">⚡</span>
                Staying & Exit Rules
              </h3>
              <ul className="text-foreground/70 space-y-2 text-sm">
                <li>• 24-hour hackathon with overnight stay allowed on campus</li>
                <li>• Participants cannot leave campus without permission</li>
                <li>• Only team leader can step out briefly with approval</li>
                <li>• No laptops allowed outside after problem reveal</li>
              </ul>
            </GlassCard>
          </div>
        </div>
      </section>

      <section id="judging" className="relative py-24 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl xl:text-6xl font-bold text-center mb-4">
            <span className="gradient-text">Judging Criteria</span>
          </h2>
          <p className="text-center text-foreground/70 max-w-3xl mx-auto mb-16">
            Your projects will be evaluated based on these comprehensive parameters
          </p>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mb-16">
            {[
              { title: 'Innovation & Creativity', icon: Sparkles, color: 'cyan' },
              { title: 'Problem-Solving Approach', icon: Zap, color: 'purple' },
              { title: 'Technical Complexity', icon: Award, color: 'pink' },
              { title: 'Implementation Quality', icon: Trophy, color: 'magenta' },
              { title: 'Functionality & Demo', icon: Clock, color: 'cyan' },
              { title: 'UI/UX Quality', icon: Users, color: 'purple' },
              { title: 'Presentation & Clarity', icon: MapPin, color: 'pink' },
              { title: 'Overall Impact', icon: Sparkles, color: 'magenta' }
            ].map((criterion, index) => (
              <GlassCard key={index} glowColor={criterion.color as any} hover3d>
                <div className="text-center">
                  <criterion.icon className={`w-8 h-8 mx-auto mb-3 text-neon-${criterion.color}`} />
                  <h3 className="font-semibold">{criterion.title}</h3>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="max-w-4xl mx-auto space-y-8">
            <GlassCard glowColor="cyan">
              <h3 className="text-2xl font-bold mb-4">Competition Rules</h3>
              <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 text-sm text-foreground/70">
                <div className="space-y-2">
                  <p>• Team size: 1–4 members</p>
                  <p>• Plagiarism strictly prohibited</p>
                  <p>• Decisions of judges are final</p>
                  <p>• No domain change after confirmation</p>
                </div>
                <div className="space-y-2">
                  <p>• Adhere to all deadlines</p>
                  <p>• Respect venue rules and coordinators</p>
                  <p>• Bring your own laptops, chargers, and tools</p>
                  <p>• Maintain professional conduct</p>
                </div>
              </div>
            </GlassCard>

            <GlassCard glowColor="purple">
              <h3 className="text-2xl font-bold mb-4">Frequently Asked Questions</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="font-semibold text-primary mb-1">Who can participate?</p>
                  <p className="text-foreground/70">Any student passionate about Gen AI or Cybersecurity</p>
                </div>
                <div>
                  <p className="font-semibold text-secondary mb-1">Is overnight stay allowed?</p>
                  <p className="text-foreground/70">Yes, 24 hours with overnight stay on campus</p>
                </div>
                <div>
                  <p className="font-semibold text-accent mb-1">When will we get problem statements?</p>
                  <p className="text-foreground/70">Revealed at venue after inauguration</p>
                </div>
                <div>
                  <p className="font-semibold text-neon-magenta mb-1">Can we change teams?</p>
                  <p className="text-foreground/70">No, team changes not allowed after registration</p>
                </div>
                <div>
                  <p className="font-semibold text-primary mb-1">Is food provided?</p>
                  <p className="text-foreground/70">Yes, meals and snacks provided during event</p>
                </div>
                <div>
                  <p className="font-semibold text-secondary mb-1">Is prior experience needed?</p>
                  <p className="text-foreground/70">Basic programming knowledge helpful, enthusiasm matters most</p>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section id="contact" className="relative py-24 px-4">
        <div className="container mx-auto">
          <h2 className="text-4xl xl:text-6xl font-bold text-center mb-4">
            <span className="gradient-text">Contact Us</span>
          </h2>
          <p className="text-center text-foreground/70 max-w-3xl mx-auto mb-16">
            Have questions? Reach out to our event coordinators
          </p>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 max-w-5xl mx-auto mb-12">
            {[
              { name: 'Sandesh Birannavar', phone: '77951246' },
              { name: 'Pankaj Babaleshwar', phone: '8217221908' },
              { name: 'Mudassir Alladatkhan', phone: '8088989442' },
              { name: 'Rakshita Halluri', phone: '7204033630' }
            ].map((coordinator, index) => (
              <GlassCard key={index} glowColor={['cyan', 'purple', 'pink', 'magenta'][index] as any} hover3d>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                    <Phone className="w-8 h-8 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{coordinator.name}</h3>
                  <a
                    href={`tel:${coordinator.phone}`}
                    className="text-primary hover:text-primary/80 transition-colors"
                  >
                    {coordinator.phone}
                  </a>
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="text-center">
            <GlassCard glowColor="cyan" className="max-w-2xl mx-auto">
              <div className="flex items-center justify-center gap-3 mb-2">
                <MapPin className="w-6 h-6 text-primary" />
                <h3 className="text-xl font-bold">Venue</h3>
              </div>
              <p className="text-foreground/70">
                VSMIT Campus, Nipani
                <br />
                <span className="text-sm">(Detailed venue information to be announced)</span>
              </p>
            </GlassCard>
          </div>
        </div>
      </section>

      <section id="register" className="relative py-24 px-4">
        <div className="container mx-auto">
          <GlassCard glowColor="purple" className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl xl:text-5xl font-bold mb-4">
              <span className="gradient-text">Ready to Innovate?</span>
            </h2>
            <p className="text-foreground/70 mb-8 text-lg">
              Join us for 24 hours of innovation, collaboration, and impact!
            </p>
            <NeonButton href="https://forms.gle" variant="primary" icon={<Zap />} className="text-lg">
              Register Now
            </NeonButton>
            <p className="text-sm text-foreground/60 mt-6">
              Registration closes on November 26, 2025 at 7:00 PM
            </p>
          </GlassCard>
        </div>
      </section>

      <footer className="relative py-12 px-4 border-t border-primary/20">
        <div className="container mx-auto">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Sparkles className="w-6 h-6 text-primary" />
              <span className="text-2xl font-bold gradient-text">HACKAURA 2025</span>
            </div>
            <p className="text-foreground/70">
              Organized by <span className="font-semibold text-primary">Vikram Sarabhai Tech Club</span>
            </p>
            <p className="text-sm text-foreground/60">
              VSM's Somashekhar R Kothiwale Institute of Technology, Nipani
            </p>
            <p className="text-sm text-foreground/50 pt-4">
              Designed & Developed by Vikram Sarabhai Tech Club © 2025
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
