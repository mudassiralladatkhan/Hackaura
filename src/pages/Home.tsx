import { useState, useEffect } from 'react';
import { Zap, Calendar, Sparkles, Users, Trophy, Clock, Award, MapPin, Phone, Menu, X, Coffee, Utensils, Mail, Flame, School, Cpu, Lock } from 'lucide-react';
import { ParticleBackground } from '@/components/ui/particle-background';
import { CountdownTimer } from '@/components/ui/countdown-timer';
import { NeonButton } from '@/components/ui/neon-button';
import { GlassCard } from '@/components/ui/glass-card';
import { ScrollAnimation } from '@/components/ui/scroll-animation';
import { Link } from 'react-router-dom';
import { fetchRegistrationStats } from '@/lib/stats';

export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [stats, setStats] = useState({ teams: 0, colleges: 0 });

  useEffect(() => {
    fetchRegistrationStats().then(data => {
      setStats({
        teams: data.totalTeams,
        colleges: data.totalColleges
      });
    });
  }, []);

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
            <div className="flex items-center gap-2 mr-8">
              <img
                src="/vsm-logo.png.png"
                alt="vsm Logo"
                className="w-10 h-10 md:w-14 md:h-14 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <span className="text-sm md:text-base font-bold gradient-text whitespace-nowrap overflow-hidden text-ellipsis max-w-[200px] md:max-w-none">VSM's Somashekhar R Kothiwale Institute of Technology</span>
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
              <Link to="/register">
                <NeonButton variant="primary">
                  Register
                </NeonButton>
              </Link>
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
              <Link to="/register" className="w-full">
                <NeonButton variant="primary" className="w-full">
                  Register
                </NeonButton>
              </Link>
            </div>
          )}
        </div>
      </nav>



      <section className="relative min-h-screen flex items-center justify-center pt-32 pb-16 px-4">
        {/* Absolute logos removed - now inline */}
        <div className="container mx-auto text-center space-y-6 z-10 relative">

          {/* Centered VSTC Logo */}
          <div className="flex justify-center mb-6 animate-fade-in">
            <img
              src="/vstc-logo.png.png"
              alt="VSTC Logo"
              className="h-20 md:h-28 w-auto object-contain drop-shadow-glow"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="flex flex-col items-center justify-center animate-fade-in">
            <span className="font-extrabold tracking-[0.1em] md:tracking-[0.15em] mb-2 bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(168,85,247,0.3)] text-xl md:text-3xl text-center px-4 leading-tight">
              Vikram Sarabhai Tech Club
            </span>
            <span className="text-sm md:text-base uppercase tracking-[0.3em] text-primary/80 font-semibold mb-4">
              Presents
            </span>
            <div className="w-24 h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50 mb-2"></div>
          </div>

          <ScrollAnimation direction="down">
            <h1 className="text-5xl xl:text-8xl font-bold mb-4">
              <span className="gradient-text">HACKAURA</span>
              <br />
              <span className="text-3xl xl:text-5xl text-foreground/80">2026</span>
            </h1>
          </ScrollAnimation>

          {/* Collaboration Section */}
          <div className="flex flex-col items-center justify-center gap-4 animate-fade-in py-2">
            <span className="text-sm md:text-base uppercase tracking-widest text-foreground/60 italic">
              in collaboration with
            </span>
            <img
              src="/savikar-logo.png.png"
              alt="Savikar Logo"
              className="h-28 md:h-40 w-auto object-contain drop-shadow-glow"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>

          <div className="flex flex-col items-center justify-center gap-1 mb-8 animate-fade-in">
            <span className="text-xs uppercase tracking-widest text-primary/60 font-semibold">Smart Media Technology Group</span>
            <p className="text-base text-foreground font-semibold">Hemanth C S</p>
          </div>

          <div className="inline-flex items-center gap-2 glass-effect border border-primary/30 rounded-full px-6 py-3 mb-4">
            <Calendar className="w-5 h-5 text-primary" />
            <span className="text-sm uppercase tracking-wider">March 1-2, 2026</span>
          </div>

          <ScrollAnimation direction="up" delay={0.2}>
            <p className="text-xl xl:text-3xl font-semibold text-primary mb-4">
              Ignite. Innovate. Impact.
            </p>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={0.4}>
            <p className="text-base xl:text-lg text-foreground/70 max-w-2xl mx-auto mb-8">
              Join us for a 24-hour national-level hackathon organized by Vikram Sarabhai Tech Club at VSMSRKIT, Nipani.
              Compete in Generative AI, Cybersecurity, and Full Stack domains for a prize pool of ₹45,000.
            </p>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={0.6}>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/register">
                <NeonButton variant="primary" className="w-full sm:w-auto min-w-[200px] text-lg py-6">
                  Register Now
                </NeonButton>
              </Link>
              <Link to="/submit">
                <NeonButton variant="secondary" className="w-full sm:w-auto min-w-[200px] text-lg py-6 border-purple-500/50 hover:bg-purple-500/10 hover:border-purple-400 text-purple-300">
                  Submit Project
                </NeonButton>
              </Link>
            </div>

            {/* Problem Statement Announcements */}
            <div className="mt-12 animate-fade-in">
              <GlassCard className="max-w-4xl mx-auto p-6 border-neon-yellow/30 bg-neon-yellow/5">
                <h3 className="text-xl md:text-2xl font-bold mb-2 text-neon-yellow flex items-center justify-center gap-2">
                  <Lock className="w-6 h-6" />
                  PROBLEM STATEMENTS
                  <Lock className="w-6 h-6" />
                </h3>
                <p className="text-neon-yellow/60 text-sm mb-6 uppercase tracking-widest">
                  Revealing at Venue on March 1st
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <button disabled className="w-full py-3 px-4 rounded-xl border border-cyan-500/30 bg-cyan-500/5 text-cyan-500/50 font-semibold cursor-not-allowed flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    Gen AI
                  </button>
                  <button disabled className="w-full py-3 px-4 rounded-xl border border-purple-500/30 bg-purple-500/5 text-purple-500/50 font-semibold cursor-not-allowed flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    Cybersecurity
                  </button>
                  <button disabled className="w-full py-3 px-4 rounded-xl border border-pink-500/30 bg-pink-500/5 text-pink-500/50 font-semibold cursor-not-allowed flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    Full Stack
                  </button>
                  <button disabled className="w-full py-3 px-4 rounded-xl border border-neon-magenta/30 bg-neon-magenta/5 text-neon-magenta/50 font-semibold cursor-not-allowed flex items-center justify-center gap-2">
                    <Lock className="w-4 h-4" />
                    IoT
                  </button>
                </div>
              </GlassCard>
            </div>
          </ScrollAnimation>

          <ScrollAnimation direction="up" delay={0.8}>
            <div className="mt-16 text-center">
              <h3 className="text-sm uppercase tracking-widest text-muted-foreground mb-6">
                Registration Starts In
              </h3>
              <CountdownTimer />
            </div>
          </ScrollAnimation>

          {/* Live Stats Section */}
          <ScrollAnimation direction="up" delay={1.0}>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-16 pb-8">
              <GlassCard glowColor="cyan" className="text-center py-6">
                <div className="flex justify-center mb-2">
                  <Users className="w-6 h-6 text-primary animate-pulse" />
                </div>
                <h4 className="text-3xl font-bold text-white mb-1">{stats.teams > 0 ? stats.teams : '--'}</h4>
                <p className="text-xs uppercase tracking-wider text-primary/80">Registered Teams</p>
              </GlassCard>

              <GlassCard glowColor="purple" className="text-center py-6">
                <div className="flex justify-center mb-2">
                  <School className="w-6 h-6 text-secondary animate-pulse" />
                </div>
                <h4 className="text-3xl font-bold text-white mb-1">{stats.teams > 0 ? stats.colleges : '--'}</h4>
                <p className="text-xs uppercase tracking-wider text-secondary/80">Colleges</p>
              </GlassCard>

              <GlassCard glowColor="pink" className="text-center py-6">
                <div className="flex justify-center mb-2">
                  <Trophy className="w-6 h-6 text-accent animate-pulse" />
                </div>
                <h4 className="text-3xl font-bold text-white mb-1">₹45k</h4>
                <p className="text-xs uppercase tracking-wider text-accent/80">Prize Pool</p>
              </GlassCard>

              <GlassCard glowColor="magenta" className="text-center py-6">
                <div className="flex justify-center mb-2">
                  <Flame className="w-6 h-6 text-neon-magenta animate-pulse" />
                </div>
                <h4 className="text-3xl font-bold text-white mb-1">24h</h4>
                <p className="text-xs uppercase tracking-wider text-neon-magenta/80">Non-Stop Coding</p>
              </GlassCard>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <section id="about" className="relative py-24 px-4">
        <div className="container mx-auto">
          <ScrollAnimation direction="up">
            <h2 className="text-4xl xl:text-6xl font-bold text-center mb-4">
              <span className="gradient-text">About HACKAURA</span>
            </h2>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={0.2}>
            <p className="text-center text-foreground/70 max-w-3xl mx-auto mb-16">
              HACKAURA 2026 is a premier 24-hour coding marathon where innovation meets excellence.
              Organized by the Vikram Sarabhai Tech Club at VSMSRKIT, Nipani, this national-level hackathon
              brings together passionate developers, designers, and problem-solvers to create groundbreaking solutions.
            </p>
          </ScrollAnimation>

          <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
            <ScrollAnimation direction="left" delay={0.3}>
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
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.4}>
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
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.5}>
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
            </ScrollAnimation>

            <ScrollAnimation direction="right" delay={0.6}>
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
            </ScrollAnimation>
          </div>
        </div>
      </section>

      <section id="domains" className="relative py-24 px-4">
        <div className="container mx-auto">
          <ScrollAnimation direction="up">
            <h2 className="text-4xl xl:text-6xl font-bold text-center mb-4">
              <span className="gradient-text">Competition Domains</span>
            </h2>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={0.2}>
            <p className="text-center text-foreground/70 max-w-3xl mx-auto mb-16">
              Choose your battlefield and showcase your expertise in cutting-edge technology domains
            </p>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <ScrollAnimation direction="left" delay={0.3}>
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
            </ScrollAnimation>

            <ScrollAnimation direction="right" delay={0.4}>
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
            </ScrollAnimation>

            <ScrollAnimation direction="left" delay={0.5}>
              <GlassCard glowColor="pink" hover3d>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center">
                      <Award className="w-6 h-6 text-accent" />
                    </div>
                    <h3 className="text-2xl font-bold">Full Stack</h3>
                  </div>
                  <p className="text-foreground/70">
                    Build complete end-to-end web applications. Showcase your skills in both frontend and
                    backend development, creating seamless user experiences with modern frameworks and
                    scalable architectures.
                  </p>
                </div>
              </GlassCard>
            </ScrollAnimation>

            <ScrollAnimation direction="right" delay={0.6}>
              <GlassCard glowColor="magenta" hover3d>
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-neon-magenta/20 flex items-center justify-center">
                      <Cpu className="w-6 h-6 text-neon-magenta" />
                    </div>
                    <h3 className="text-2xl font-bold">Internet of Things</h3>
                  </div>
                  <p className="text-foreground/70">
                    Develop smart connected solutions bridging the physical and digital worlds.
                    Create innovative IoT systems using sensors, microcontrollers, and cloud platforms
                    to solve real-world problems efficiently.
                  </p>
                </div>
              </GlassCard>
            </ScrollAnimation>
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
          <ScrollAnimation direction="up">
            <h2 className="text-4xl xl:text-6xl font-bold text-center mb-4">
              <span className="gradient-text">Prize Distribution</span>
            </h2>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={0.2}>
            <div className="text-center mb-16">
              <div className="inline-flex items-center gap-3 glass-effect border border-neon-yellow/30 rounded-2xl px-8 py-4">
                <Trophy className="w-8 h-8 text-neon-yellow animate-bounce" />
                <span className="text-3xl xl:text-4xl font-bold text-neon-yellow">₹45,000</span>
                <span className="text-foreground/70">Total Prize Pool</span>
              </div>
            </div>
          </ScrollAnimation>

          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8 max-w-5xl mx-auto mb-12">
            <ScrollAnimation direction="left" delay={0.3}>
              <GlassCard glowColor="cyan" hover3d>
                <h3 className="text-2xl font-bold mb-6 text-center">Main Awards</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-primary/10 border border-primary/30">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-primary" />
                      <span className="font-semibold">1st Place (Each Domain)</span>
                    </div>
                    <span className="text-primary font-bold">Cash Prize + Certificate</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-secondary/10 border border-secondary/30">
                    <div className="flex items-center gap-3">
                      <Trophy className="w-6 h-6 text-secondary" />
                      <span className="font-semibold">2nd Place (Each Domain)</span>
                    </div>
                    <span className="text-secondary font-bold">Cash Prize + Certificate</span>
                  </div>
                </div>
                <p className="text-center text-sm text-foreground/60 mt-4">
                  Same awards for all three domains: Generative AI, Cybersecurity & Full Stack
                </p>
              </GlassCard>
            </ScrollAnimation>

            <ScrollAnimation direction="right" delay={0.4}>
              <GlassCard glowColor="purple" hover3d>
                <h3 className="text-2xl font-bold mb-6 text-center">Design Excellence Awards</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 rounded-xl bg-accent/10 border border-accent/30">
                    <div className="flex items-center gap-3">
                      <Award className="w-6 h-6 text-accent" />
                      <span className="font-semibold">1st Place (Each Domain)</span>
                    </div>
                    <span className="text-accent font-bold">Certificate</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-accent/10 border border-accent/30">
                    <div className="flex items-center gap-3">
                      <Award className="w-6 h-6 text-accent" />
                      <span className="font-semibold">2nd Place (Each Domain)</span>
                    </div>
                    <span className="text-accent font-bold">Certificate</span>
                  </div>
                  <div className="flex items-center justify-between p-4 rounded-xl bg-accent/10 border border-accent/30">
                    <div className="flex items-center gap-3">
                      <Award className="w-6 h-6 text-accent" />
                      <span className="font-semibold">3rd Place (Each Domain)</span>
                    </div>
                    <span className="text-accent font-bold">Certificate</span>
                  </div>
                </div>
                <p className="text-center text-sm text-foreground/60 mt-4">
                  Same awards for all three domains: Generative AI, Cybersecurity & Full Stack
                </p>
              </GlassCard>
            </ScrollAnimation>
          </div>

          <ScrollAnimation direction="up" delay={0.5}>
            <div className="text-center">
              <GlassCard glowColor="magenta" className="max-w-2xl mx-auto">
                <p className="text-lg">
                  <span className="font-bold text-neon-magenta">Participation Certificates</span> for all participants
                </p>
              </GlassCard>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <section id="venue-flow" className="relative py-24 px-4">
        <div className="container mx-auto">

          <ScrollAnimation direction="up">
            <h2 className="text-4xl xl:text-6xl font-bold text-center mb-4">
              <span className="gradient-text">Event Schedule</span>
            </h2>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={0.2}>
            <p className="text-center text-foreground/70 max-w-3xl mx-auto mb-4">
              Day 1 - March 1, 2026
            </p>
            <p className="text-center text-sm text-foreground/60 mb-16">
              Follow the timeline to make the most of your hackathon experience
            </p>
          </ScrollAnimation>

          <div className="max-w-4xl mx-auto space-y-6">
            <ScrollAnimation direction="left">
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
                      <li>• Team Identity Card distribution</li>
                      <li>• Team leader presence required</li>
                    </ul>
                  </div>
                </div>
              </GlassCard>
            </ScrollAnimation>

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
                    <li>• Domains: Gen AI, Cybersecurity & Full Stack</li>
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

            <GlassCard glowColor="pink" hover3d>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-10 h-10 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-accent">4:00 PM</span>
                    <span className="text-xl font-semibold">Evening Snacks & Tea</span>
                  </div>
                  <p className="text-foreground/70 text-sm">
                    Refreshments to keep you energized
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard glowColor="magenta" hover3d>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-neon-magenta/20 flex items-center justify-center flex-shrink-0">
                  <Utensils className="w-10 h-10 text-neon-magenta" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-neon-magenta">8:00 PM</span>
                    <span className="text-xl font-semibold">Dinner Break</span>
                  </div>
                  <p className="text-foreground/70 text-sm">
                    Hot dinner served for all participants
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard glowColor="cyan" hover3d>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-primary">10:00 PM</span>
                    <span className="text-xl font-semibold">Mentor Round 1</span>
                  </div>
                  <p className="text-foreground/70 text-sm">
                    Expert mentors available for guidance and support
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard glowColor="purple" hover3d>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-secondary/20 flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-10 h-10 text-secondary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-secondary">12:00 AM</span>
                    <span className="text-xl font-semibold">Midnight Snacks</span>
                  </div>
                  <p className="text-foreground/70 text-sm">
                    Late night refreshments and beverages
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard glowColor="pink" hover3d>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-10 h-10 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-accent">2:00 AM</span>
                    <span className="text-xl font-semibold">Mentor Round 2</span>
                  </div>
                  <p className="text-foreground/70 text-sm">
                    Overnight mentor support for your team
                  </p>
                </div>
              </div>
            </GlassCard>

          </div>

          <ScrollAnimation direction="up">
            <div className="mt-12 max-w-4xl mx-auto">
              <GlassCard glowColor="cyan">
                <h3 className="text-xl font-bold mb-4 text-center">
                  📅 Day 2 - March 2, 2026
                </h3>
                <p className="text-foreground/70 text-sm text-center">
                  All Day 2 events listed below starting from 6:00 AM
                </p>
              </GlassCard>
            </div>
          </ScrollAnimation>

          <div className="max-w-4xl mx-auto space-y-6 mt-8">

            <GlassCard glowColor="magenta" hover3d>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-neon-magenta/20 flex items-center justify-center flex-shrink-0">
                  <Coffee className="w-10 h-10 text-neon-magenta" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-neon-magenta">6:00 AM</span>
                    <span className="text-xl font-semibold">Morning Tea & Snacks</span>
                  </div>
                  <p className="text-foreground/70 text-sm">
                    Fresh morning refreshments to start Day 2
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard glowColor="cyan" hover3d>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Utensils className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-primary">9:00 AM</span>
                    <span className="text-xl font-semibold">Breakfast</span>
                  </div>
                  <p className="text-foreground/70 text-sm">
                    Healthy breakfast to fuel your final sprint
                  </p>
                </div>
              </div>
            </GlassCard>



            <GlassCard glowColor="pink" hover3d>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center flex-shrink-0">
                  <Clock className="w-10 h-10 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-accent">9:30 AM</span>
                    <span className="text-xl font-semibold">Coding Ends - Submission Deadline</span>
                  </div>
                  <p className="text-foreground/70 text-sm">
                    Final submission and project freeze
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard glowColor="magenta" hover3d>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-neon-magenta/20 flex items-center justify-center flex-shrink-0">
                  <Users className="w-10 h-10 text-neon-magenta" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-neon-magenta">10:00 AM</span>
                    <span className="text-xl font-semibold">Presentations Begin</span>
                  </div>
                  <p className="text-foreground/70 text-sm">
                    Teams present their solutions to judges
                  </p>
                </div>
              </div>
            </GlassCard>

            <GlassCard glowColor="cyan" hover3d>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-primary/20 flex items-center justify-center flex-shrink-0">
                  <Award className="w-10 h-10 text-primary" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-primary">11:30 AM</span>
                    <span className="text-xl font-semibold">Judging & Results</span>
                  </div>
                  <p className="text-foreground/70 text-sm">
                    Final evaluation and winner announcement
                  </p>
                </div>
              </div>
            </GlassCard>



            <GlassCard glowColor="pink" hover3d>
              <div className="flex items-start gap-4">
                <div className="w-20 h-20 rounded-2xl bg-accent/20 flex items-center justify-center flex-shrink-0 animate-pulse-glow">
                  <Trophy className="w-10 h-10 text-accent" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-2xl font-bold text-accent">12:00 PM</span>
                    <span className="text-xl font-semibold">Prize Distribution & Closing</span>
                  </div>
                  <p className="text-foreground/70 text-sm">
                    Award ceremony and event conclusion
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
          <ScrollAnimation direction="up">
            <h2 className="text-4xl xl:text-6xl font-bold text-center mb-4">
              <span className="gradient-text">Judging Criteria</span>
            </h2>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={0.2}>
            <p className="text-center text-foreground/70 max-w-3xl mx-auto mb-16">
              Your projects will be evaluated based on these comprehensive parameters
            </p>
          </ScrollAnimation>

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
              <ScrollAnimation key={index} direction="up" delay={index * 0.1}>
                <GlassCard glowColor={criterion.color as any} hover3d>
                  <div className="text-center">
                    <criterion.icon className={`w-8 h-8 mx-auto mb-3 text-neon-${criterion.color}`} />
                    <h3 className="font-semibold">{criterion.title}</h3>
                  </div>
                </GlassCard>
              </ScrollAnimation>
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
          <ScrollAnimation direction="up">
            <h2 className="text-4xl xl:text-6xl font-bold text-center mb-4">
              <span className="gradient-text">Contact Us</span>
            </h2>
          </ScrollAnimation>
          <ScrollAnimation direction="up" delay={0.2}>
            <p className="text-center text-foreground/70 max-w-3xl mx-auto mb-16">
              Have questions? Reach out to our event coordinators
            </p>
          </ScrollAnimation>

          <h3 className="text-2xl font-semibold text-center mb-8">
            Principal of VSMSRKIT
          </h3>

          <div className="flex justify-center mb-12">
            <ScrollAnimation direction="up" delay={0.2}>
              <GlassCard glowColor="cyan" hover3d className="max-w-3xl w-full">
                <div className="text-center py-6">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Users className="w-10 h-10 text-amber-500" />
                  </div>
                  <h4 className="text-2xl font-bold mb-1">Dr. Umesh P. Patil</h4>
                  <p className="text-sm text-foreground/60 mb-3">Principal, VSMSRKIT Nipani</p>
                  <a href="tel:9880217636" className="text-amber-500 hover:text-amber-400 transition-colors text-base font-semibold">
                    9880217636
                  </a>
                </div>
              </GlassCard>
            </ScrollAnimation>
          </div>

          <h3 className="text-2xl font-semibold text-center mb-8">
            Heads of Departments
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            <ScrollAnimation direction="left" delay={0.3}>
              <GlassCard glowColor="purple" hover3d>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Users className="w-8 h-8 text-amber-500" />
                  </div>
                  <h4 className="text-lg font-bold">Prof. Anup Ganji</h4>
                  <p className="text-xs text-foreground/60 mb-2">Assistant Professor, HOD (AIML)</p>
                  <a href="tel:8971016801" className="text-amber-500 hover:text-amber-400 transition-colors text-sm">
                    8971016801
                  </a>
                </div>
              </GlassCard>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.4}>
              <GlassCard glowColor="cyan" hover3d>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Users className="w-8 h-8 text-amber-500" />
                  </div>
                  <h4 className="text-lg font-bold">Prof. Rahul Palakar</h4>
                  <p className="text-xs text-foreground/60 mb-2">Assistant Professor, HOD (CSE)</p>
                  <a href="tel:9739059248" className="text-amber-500 hover:text-amber-400 transition-colors text-sm">
                    9739059248
                  </a>
                </div>
              </GlassCard>
            </ScrollAnimation>

            <ScrollAnimation direction="right" delay={0.5}>
              <GlassCard glowColor="pink" hover3d>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Users className="w-8 h-8 text-amber-500" />
                  </div>
                  <h4 className="text-lg font-bold">Prof. Santosh Kolaki</h4>
                  <p className="text-xs text-foreground/60 mb-2">Asst. Professor & HOD (EC)</p>
                  <a href="tel:9611404048" className="text-amber-500 hover:text-amber-400 transition-colors text-sm">
                    9611404048
                  </a>
                </div>
              </GlassCard>
            </ScrollAnimation>
          </div>

          <h3 className="text-2xl font-semibold text-center mb-8">
            Faculty Coordinators
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto mb-12">
            <ScrollAnimation direction="up" delay={0.5}>
              <GlassCard glowColor="pink" hover3d>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Users className="w-8 h-8 text-amber-500" />
                  </div>
                  <h4 className="text-lg font-bold">Prof. Prabhu Kichade</h4>
                  <p className="text-xs text-foreground/60 mb-2">Assistant Professor</p>
                  <a href="tel:9880437187" className="text-amber-500 hover:text-amber-400 transition-colors text-sm">
                    9880437187
                  </a>
                </div>
              </GlassCard>
            </ScrollAnimation>

            <ScrollAnimation direction="up" delay={0.6}>
              <GlassCard glowColor="magenta" hover3d>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-amber-500/20 flex items-center justify-center">
                    <Users className="w-8 h-8 text-amber-500" />
                  </div>
                  <h4 className="text-lg font-bold">Prof. Prasanna Patil</h4>
                  <p className="text-xs text-foreground/60 mb-2">Assistant Professor</p>
                  <a href="tel:9743202717" className="text-amber-500 hover:text-amber-400 transition-colors text-sm">
                    9743202717
                  </a>
                </div>
              </GlassCard>
            </ScrollAnimation>
          </div>

          <ScrollAnimation direction="up">
            <h3 className="text-2xl font-semibold text-center mb-8">
              Student Coordinators
            </h3>
          </ScrollAnimation>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto mb-12">
            {[
              { name: 'Abdulwahab Mulla', phone: '7349758871', email: 'abdulwahabmulla6746@gmail.com' },
              { name: 'Sandesh Birannavar', phone: '7795031246', email: 'sandeshbirannavar@gmail.com' },
              { name: 'Rakshita Halluri', phone: '7204033630', email: 'rakshitahalluri@gmail.com' },
              { name: 'Sana Ravat', phone: '8095981415', email: 'sanaravat786@gmail.com' }
            ].map((coordinator, index) => (
              <ScrollAnimation key={index} direction="up" delay={index * 0.1}>
                <GlassCard glowColor={['cyan', 'purple', 'pink', 'magenta', 'cyan', 'purple'][index] as any} hover3d>
                  <div className="text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/20 flex items-center justify-center">
                      <Phone className="w-8 h-8 text-primary" />
                    </div>
                    <h3 className="font-bold mb-3">{coordinator.name}</h3>
                    <div className="space-y-2">
                      <a
                        href={`tel:${coordinator.phone}`}
                        className="flex items-center justify-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm"
                      >
                        <Phone className="w-4 h-4" />
                        {coordinator.phone}
                      </a>
                      <a
                        href={`mailto:${coordinator.email}`}
                        className="flex items-center justify-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm break-all"
                      >
                        <Mail className="w-4 h-4 flex-shrink-0" />
                        <span className="text-xs">{coordinator.email}</span>
                      </a>
                    </div>
                  </div>
                </GlassCard>
              </ScrollAnimation>
            ))}
          </div>

          <ScrollAnimation direction="up" delay={0.5}>
            <div className="text-center">
              <GlassCard glowColor="cyan" className="max-w-2xl mx-auto">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <MapPin className="w-6 h-6 text-primary" />
                  <h3 className="text-xl font-bold">Venue</h3>
                </div>
                <p className="text-foreground/70 mb-6">
                  VSM's Somashekhar R Kothiwale Institute of Technology, Nipani
                  <br />
                  <span className="text-sm">Nipani, Karnataka 591237</span>
                </p>
                <div className="w-full h-64 rounded-xl overflow-hidden border border-primary/30">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3830.739977386062!2d74.3902473751392!3d16.23426498446939!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc0803928555555%3A0x25f703415504748!2sVSM%20Institute%20of%20Technology%2C%20Nipani!5e0!3m2!1sen!2sin!4v1710000000000!5m2!1sen!2sin"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="VSMSRKIT Campus Map"
                  ></iframe>
                </div>
                <div className="mt-6">
                  <NeonButton
                    href="https://maps.app.goo.gl/H7rMfpTP65GyzWeP8"
                    variant="outline"
                    icon={<MapPin />}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Get Directions
                  </NeonButton>
                </div>
              </GlassCard>
            </div>
          </ScrollAnimation>
        </div>
      </section>

      <section id="register" className="relative py-24 px-4">
        <div className="container mx-auto">
          <ScrollAnimation direction="up">
            <GlassCard glowColor="purple" className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl xl:text-5xl font-bold mb-4">
                <span className="gradient-text">Ready to Innovate?</span>
              </h2>
              <p className="text-foreground/70 mb-8 text-lg">
                Join us for 24 hours of innovation, collaboration, and impact!
              </p>
              <button disabled className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-semibold text-lg bg-gray-600 text-gray-400 cursor-not-allowed opacity-60">
                <Zap className="text-xl" />
                Registration Closed
              </button>
              <p className="text-sm text-red-400 mt-6 font-semibold">
                Registration has been closed
              </p>
            </GlassCard>
          </ScrollAnimation>
        </div>
      </section>

      <footer className="relative py-12 px-4 border-t border-primary/20">
        <div className="container mx-auto">
          <div className="text-center space-y-4">
            <div className="flex flex-col items-center gap-2 mb-4">
              <img
                src="/vsm-logo.png.png"
                alt="VSM Logo"
                className="w-16 h-18 object-contain"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl font-bold gradient-text">HACKAURA 2026</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-6 mb-4">
              <div className="flex flex-col items-center">
                <p className="text-xs text-foreground/50 mb-2">In Collaboration With</p>
                <img
                  src="/savikar-logo.png.png"
                  alt="Savikar Logo"
                  className="h-20 object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </div>
              <div className="flex flex-col items-center">
                <p className="text-xs text-foreground/50 mb-2">Event Partner</p>
                <div className="flex flex-col items-center gap-1">
                  <p className="text-base font-semibold text-foreground">Smart Media Technology Group</p>
                  <p className="text-sm font-bold text-primary">Hemanth C S</p>
                </div>
              </div>
            </div>

            <p className="text-foreground/70">
              Organized by <span className="font-semibold text-primary">Vikram Sarabhai Tech Club</span>
            </p>
            <p className="text-sm text-foreground/60">
              VSM's Somashekhar R Kothiwale Institute of Technology, Nipani
            </p>

            <p className="text-sm text-foreground/50 pt-4">
              Designed & Developed by Vikram Sarabhai Tech Club © 2026. All Rights Reserved.
            </p>
          </div>
        </div>
      </footer>
    </div >
  );
}
