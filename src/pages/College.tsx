import { ArrowLeft, MapPin, Phone, Mail, Calendar, Users, BookOpen, Award, Building2, GraduationCap, Globe, Target, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ParticleBackground } from '@/components/ui/particle-background';
import { GlassCard } from '@/components/ui/glass-card';
import { NeonButton } from '@/components/ui/neon-button';
import { ScrollAnimation } from '@/components/ui/scroll-animation';

const GOVERNING_COUNCIL = [
    { name: 'Shri Chandrakanth S. Kothiwale', role: 'Chairman', org: 'VSM, Nipani' },
    { name: 'Shri R. Y. Patil', role: 'Vice Chairman', org: 'VSM, Nipani' },
    { name: 'Shri B. R. Patil', role: 'President', org: 'VSM, Nipani' },
    { name: 'Shri S. M. Khaded', role: 'Secretary', org: 'VSM, Nipani' },
];

const DEPARTMENTS_BE = [
    { name: 'Computer Science & Engineering', code: 'CSE' },
    { name: 'Artificial Intelligence & Machine Learning', code: 'AIML' },
    { name: 'Mechanical Engineering', code: 'ME' },
    { name: 'Civil Engineering', code: 'CE' },
    { name: 'Electronics & Communication', code: 'ECE' },
];

const DEPARTMENTS_DIPLOMA = [
    { name: 'Computer Science & Engineering', code: 'CSE' },
    { name: 'Mechanical Engineering', code: 'ME' },
    { name: 'Civil Engineering', code: 'CE' },
    { name: 'Electronics & Communication', code: 'ECE' },
];

const DEPARTMENTS_PG = [
    { name: 'Master of Business Administration', code: 'MBA' },
    { name: 'Master of Computer Applications', code: 'MCA' },
];

const QUICK_FACTS = [
    { icon: Calendar, label: 'Established', value: '2010', color: 'cyan' },
    { icon: Building2, label: 'Campus Area', value: '13.38 Acres', color: 'purple' },
    { icon: GraduationCap, label: 'Programs', value: 'BE, Diploma, MBA, MCA', color: 'pink' },
    { icon: Award, label: 'Accreditation', value: 'AICTE Approved', color: 'magenta' },
];

export default function College() {
    return (
        <div className="min-h-screen gradient-bg text-foreground overflow-x-hidden">
            <ParticleBackground />

            {/* Back Button */}
            <div className="fixed top-6 left-6 z-50">
                <Link to="/">
                    <NeonButton variant="secondary" className="!p-2">
                        <ArrowLeft className="w-5 h-5" />
                    </NeonButton>
                </Link>
            </div>

            {/* Hero Section with College Image */}
            <section className="relative pt-24 pb-16 px-4">
                <div className="container mx-auto max-w-6xl">

                    {/* College Banner Image */}
                    <ScrollAnimation direction="down">
                        <div className="relative rounded-3xl overflow-hidden mb-12 border border-primary/20">
                            <img
                                src="https://www.vsmsrkit.edu.in/images/slider/vsmsrkit-building-infrastructure-slider.jpg"
                                alt="VSMSRKIT Campus Building"
                                className="w-full h-[250px] md:h-[400px] object-cover"
                                onError={(e) => {
                                    e.currentTarget.src = 'https://www.vsmsrkit.edu.in/images/slider/facility-slider-010825.jpg';
                                    e.currentTarget.onerror = () => {
                                        e.currentTarget.style.display = 'none';
                                    };
                                }}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-10">
                                <div className="flex items-center gap-4 mb-3">
                                    <img
                                        src="https://www.vsmsrkit.edu.in/uploads/1602993450.png"
                                        alt="VSMSRKIT Logo"
                                        className="h-14 md:h-20 w-auto object-contain drop-shadow-glow bg-white/90 rounded-lg p-1"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                    <div>
                                        <p className="text-xs md:text-sm uppercase tracking-widest text-primary/80 font-semibold">Vidya Samvardhak Mandal's</p>
                                        <h1 className="text-2xl md:text-4xl font-bold">
                                            <span className="gradient-text">Somashekhar R. Kothiwale</span>
                                        </h1>
                                        <h2 className="text-lg md:text-2xl font-semibold text-foreground/90">Institute of Technology, Nipani</h2>
                                    </div>
                                </div>
                                <div className="flex flex-wrap gap-2 mt-3">
                                    <span className="text-xs bg-primary/20 border border-primary/30 rounded-full px-3 py-1 text-primary font-medium">AICTE Approved</span>
                                    <span className="text-xs bg-secondary/20 border border-secondary/30 rounded-full px-3 py-1 text-secondary font-medium">VTU Affiliated</span>
                                    <span className="text-xs bg-accent/20 border border-accent/30 rounded-full px-3 py-1 text-accent font-medium">ISO 9001:2015</span>
                                    <span className="text-xs bg-neon-magenta/20 border border-neon-magenta/30 rounded-full px-3 py-1 text-neon-magenta font-medium">CET Code: E207</span>
                                </div>
                            </div>
                        </div>
                    </ScrollAnimation>

                    {/* Quick Facts */}
                    <ScrollAnimation direction="up" delay={0.2}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
                            {QUICK_FACTS.map((fact, idx) => (
                                <GlassCard key={idx} glowColor={fact.color as any} className="text-center py-6">
                                    <div className="flex justify-center mb-2">
                                        <fact.icon className={`w-6 h-6 text-neon-${fact.color} animate-pulse`} />
                                    </div>
                                    <h4 className="text-xl md:text-2xl font-bold text-white mb-1">{fact.value}</h4>
                                    <p className={`text-xs uppercase tracking-wider text-neon-${fact.color}/80`}>{fact.label}</p>
                                </GlassCard>
                            ))}
                        </div>
                    </ScrollAnimation>
                </div>
            </section>

            {/* About the Institute */}
            <section className="relative py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <ScrollAnimation direction="up">
                        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
                            <span className="gradient-text">About the Institute</span>
                        </h2>
                    </ScrollAnimation>

                    <ScrollAnimation direction="up" delay={0.2}>
                        <GlassCard glowColor="cyan" className="max-w-4xl mx-auto mb-12">
                            <p className="text-foreground/80 leading-relaxed mb-4">
                                VSM Institute of Technology, Nipani was established in the year <strong className="text-primary">2010</strong>. The institute offers multi-discipline Undergraduate programmes in the First shift and Diploma in the Second shift in the Engineering field. It is approved by the <strong className="text-primary">All India Council of Technical Education (AICTE), New Delhi</strong> and affiliated to <strong className="text-secondary">Visvesvaraya Technological University, Belagavi</strong>.
                            </p>
                            <p className="text-foreground/80 leading-relaxed mb-4">
                                The Diploma Courses are affiliated to the Directorate of Technical Education, Bangalore. The institute is situated on a well-laid-out <strong className="text-accent">13.38-acre campus</strong> on the outskirts of Nipani town, Belagavi district, on Jatrat road.
                            </p>
                            <p className="text-foreground/80 leading-relaxed">
                                It offers a thorough living and learning experience through spacious classrooms, state-of-the-art air-conditioned computer labs, learned staff, a voluminous library, separate hostels for girls and boys, hygienic canteens, and banking facilities. The institute was awarded <strong className="text-neon-yellow">"Best Performing College of the Year 2015-16"</strong> by KSCST, Government of Karnataka.
                            </p>
                        </GlassCard>
                    </ScrollAnimation>

                    {/* Vision & Mission */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto mb-12">
                        <ScrollAnimation direction="left" delay={0.3}>
                            <GlassCard glowColor="purple" hover3d className="h-full">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-secondary/20 flex items-center justify-center">
                                        <Eye className="w-8 h-8 text-secondary" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-secondary">Our Vision</h3>
                                    <p className="text-foreground/70 italic text-lg">
                                        "Empowering the rural youth through technical education"
                                    </p>
                                </div>
                            </GlassCard>
                        </ScrollAnimation>

                        <ScrollAnimation direction="right" delay={0.4}>
                            <GlassCard glowColor="pink" hover3d className="h-full">
                                <div className="text-center">
                                    <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center">
                                        <Target className="w-8 h-8 text-accent" />
                                    </div>
                                    <h3 className="text-xl font-bold mb-3 text-accent">Our Mission</h3>
                                    <p className="text-foreground/70 italic">
                                        "To provide relevant education and training in an environment that inspires success and promotes self-reliance for students and fosters economic development for the region."
                                    </p>
                                </div>
                            </GlassCard>
                        </ScrollAnimation>
                    </div>
                </div>
            </section>

            {/* About VSM */}
            <section className="relative py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <ScrollAnimation direction="up">
                        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
                            <span className="gradient-text">Vidya Samvardhak Mandal</span>
                        </h2>
                        <p className="text-center text-foreground/60 mb-12">The parent organization behind VSMSRKIT</p>
                    </ScrollAnimation>

                    <ScrollAnimation direction="up" delay={0.2}>
                        <GlassCard glowColor="magenta" className="max-w-4xl mx-auto mb-12">
                            <p className="text-foreground/80 leading-relaxed mb-4">
                                <strong className="text-neon-magenta">Vidya Samvardhak Mandal (VSM)</strong>, founded in <strong className="text-primary">1960</strong> by a group of visionaries and philanthropists — Shri R.S. Kothiwale, Dr. S.S. Panade, Shri G.I. Bagewadi, Shri M.L. Khaded, Shri D.C. Ligade, Shri B.M. Nesti, Shri Paragouda Patil, Shri G.S. Kurbetti, Shri R.S. Kalyanshetti, and Shri R.B. Jadhav of Nipani, Karnataka — has been striving hard since its inception to create a blooming academic garden for the people in and around Nipani.
                            </p>
                            <p className="text-foreground/80 leading-relaxed mb-4">
                                The Mandal first established a primary school in <strong>1963</strong>, followed by a mid-high school in <strong>1966</strong> and a separate Girls High School. Over the decades, it expanded to include a Junior College (1984), T.C.H College (1986), Kannada & Marathi Convent (1993), BBA (1996), BCA (2000), B.Ed (2004), and B.P.Ed (2006).
                            </p>
                            <p className="text-foreground/80 leading-relaxed">
                                With a vision to empower youth through technical education, <strong className="text-primary">VSMIT was started in 2010</strong> in a sprawling campus amidst lush greenery, offering BE programs in its first shift and Diploma programs in its second shift.
                            </p>
                        </GlassCard>
                    </ScrollAnimation>
                </div>
            </section>

            {/* Governing Council */}
            <section className="relative py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <ScrollAnimation direction="up">
                        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
                            <span className="gradient-text">Leadership</span>
                        </h2>
                        <p className="text-center text-foreground/60 mb-12">Guiding VSMSRKIT towards excellence</p>
                    </ScrollAnimation>

                    {/* Chairman */}
                    <ScrollAnimation direction="up" delay={0.2}>
                        <div className="flex justify-center mb-10">
                            <GlassCard glowColor="cyan" hover3d className="max-w-3xl w-full">
                                <div className="text-center py-4">
                                    <img
                                        src="https://www.vsmsrkit.edu.in/images/chairman.jpg"
                                        alt="Shri Chandrakanth S. Kothiwale"
                                        className="w-28 h-28 mx-auto mb-4 rounded-full object-cover border-3 border-neon-yellow/40 shadow-lg"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                    <h3 className="text-2xl font-bold text-white mb-1">Shri Chandrakanth S. Kothiwale</h3>
                                    <p className="text-neon-yellow font-semibold uppercase tracking-wider text-sm mb-4">Chairman, VSM Nipani</p>
                                    <p className="text-foreground/70 text-sm max-w-xl mx-auto leading-relaxed">
                                        "VSMSRKIT was established in 2010 with the aim to impart quality education to the rural youth and to the border area students of Karnataka and Maharashtra states. The institute is located on National Highway No. 4, 70 km from Belagavi and 35 km from Kolhapur."
                                    </p>
                                </div>
                            </GlassCard>
                        </div>
                    </ScrollAnimation>

                    {/* Principal */}
                    <ScrollAnimation direction="up" delay={0.3}>
                        <div className="flex justify-center mb-10">
                            <GlassCard glowColor="purple" hover3d className="max-w-3xl w-full">
                                <div className="text-center py-4">
                                    <img
                                        src="https://www.vsmsrkit.edu.in/images/principal-dr-u-p-patil.jpg"
                                        alt="Dr. Umesh P. Patil"
                                        className="w-28 h-28 mx-auto mb-4 rounded-full object-cover border-3 border-amber-500/40 shadow-lg"
                                        onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                    <h3 className="text-2xl font-bold text-white mb-1">Dr. Umesh P. Patil</h3>
                                    <p className="text-amber-500 font-semibold uppercase tracking-wider text-sm mb-4">Principal & Director</p>
                                    <p className="text-foreground/70 text-sm max-w-xl mx-auto leading-relaxed">
                                        "It is my great pleasure to welcome you to VSM's Somashekhar R. Kothiwale Institute Of Technology run by Vidya Samvardhak Mandal. Today, the role of an Institute is not only to pursue academic excellence but also to motivate and empower students."
                                    </p>
                                    <a href="tel:9880217636" className="inline-flex items-center gap-2 mt-4 text-primary hover:text-primary/80 transition-colors text-sm font-medium">
                                        <Phone className="w-4 h-4" /> 9880217636
                                    </a>
                                </div>
                            </GlassCard>
                        </div>
                    </ScrollAnimation>

                    {/* Other Council Members */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
                        {GOVERNING_COUNCIL.map((member, idx) => (
                            <ScrollAnimation key={idx} direction="up" delay={idx * 0.1}>
                                <GlassCard glowColor={['cyan', 'purple', 'pink', 'magenta'][idx % 4] as any} hover3d>
                                    <div className="text-center py-2">
                                        <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                                            <Users className="w-6 h-6 text-primary" />
                                        </div>
                                        <h4 className="text-sm font-bold text-white mb-1">{member.name}</h4>
                                        <p className="text-xs text-primary/80 font-semibold uppercase tracking-wider">{member.role}</p>
                                        <p className="text-xs text-foreground/50 mt-1">{member.org}</p>
                                    </div>
                                </GlassCard>
                            </ScrollAnimation>
                        ))}
                    </div>
                </div>
            </section>

            {/* Departments */}
            <section className="relative py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <ScrollAnimation direction="up">
                        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
                            <span className="gradient-text">Departments</span>
                        </h2>
                        <p className="text-center text-foreground/60 mb-12">Academic programs offered at VSMSRKIT</p>
                    </ScrollAnimation>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* BE Departments */}
                        <ScrollAnimation direction="left" delay={0.2}>
                            <GlassCard glowColor="cyan" hover3d className="h-full">
                                <div className="text-center mb-4">
                                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-primary/20 flex items-center justify-center">
                                        <BookOpen className="w-7 h-7 text-primary" />
                                    </div>
                                    <h3 className="text-lg font-bold text-primary">B.E. (Undergraduate)</h3>
                                    <p className="text-xs text-foreground/50">CET Code: E207</p>
                                </div>
                                <div className="space-y-2">
                                    {DEPARTMENTS_BE.map((dept, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-foreground/70 p-2 rounded-lg bg-primary/5 border border-primary/10">
                                            <span className="text-primary font-bold text-xs w-12 flex-shrink-0">{dept.code}</span>
                                            <span>{dept.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </ScrollAnimation>

                        {/* Diploma Departments */}
                        <ScrollAnimation direction="up" delay={0.3}>
                            <GlassCard glowColor="purple" hover3d className="h-full">
                                <div className="text-center mb-4">
                                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-secondary/20 flex items-center justify-center">
                                        <BookOpen className="w-7 h-7 text-secondary" />
                                    </div>
                                    <h3 className="text-lg font-bold text-secondary">Diploma</h3>
                                    <p className="text-xs text-foreground/50">Inst Code: 567</p>
                                </div>
                                <div className="space-y-2">
                                    {DEPARTMENTS_DIPLOMA.map((dept, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-foreground/70 p-2 rounded-lg bg-secondary/5 border border-secondary/10">
                                            <span className="text-secondary font-bold text-xs w-12 flex-shrink-0">{dept.code}</span>
                                            <span>{dept.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </ScrollAnimation>

                        {/* PG Departments */}
                        <ScrollAnimation direction="right" delay={0.4}>
                            <GlassCard glowColor="pink" hover3d className="h-full">
                                <div className="text-center mb-4">
                                    <div className="w-14 h-14 mx-auto mb-3 rounded-full bg-accent/20 flex items-center justify-center">
                                        <GraduationCap className="w-7 h-7 text-accent" />
                                    </div>
                                    <h3 className="text-lg font-bold text-accent">Post Graduation</h3>
                                    <p className="text-xs text-foreground/50">Master's Programs</p>
                                </div>
                                <div className="space-y-2">
                                    {DEPARTMENTS_PG.map((dept, idx) => (
                                        <div key={idx} className="flex items-center gap-2 text-sm text-foreground/70 p-2 rounded-lg bg-accent/5 border border-accent/10">
                                            <span className="text-accent font-bold text-xs w-12 flex-shrink-0">{dept.code}</span>
                                            <span>{dept.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </GlassCard>
                        </ScrollAnimation>
                    </div>
                </div>
            </section>

            {/* How to Reach */}
            <section className="relative py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <ScrollAnimation direction="up">
                        <h2 className="text-3xl md:text-5xl font-bold text-center mb-4">
                            <span className="gradient-text">How to Reach</span>
                        </h2>
                        <p className="text-center text-foreground/60 mb-12">Finding your way to VSMSRKIT</p>
                    </ScrollAnimation>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-10">
                        <ScrollAnimation direction="left" delay={0.2}>
                            <GlassCard glowColor="cyan" hover3d>
                                <div className="text-center">
                                    <div className="text-3xl mb-3">✈️</div>
                                    <h4 className="font-bold text-sm mb-1">Nearest Airport</h4>
                                    <p className="text-foreground/70 text-sm">Kolhapur Airport, Maharashtra</p>
                                    <p className="text-primary text-xs font-semibold mt-1">36 km away</p>
                                </div>
                            </GlassCard>
                        </ScrollAnimation>

                        <ScrollAnimation direction="up" delay={0.3}>
                            <GlassCard glowColor="purple" hover3d>
                                <div className="text-center">
                                    <div className="text-3xl mb-3">🚌</div>
                                    <h4 className="font-bold text-sm mb-1">Nearest Bus Station</h4>
                                    <p className="text-foreground/70 text-sm">Nipani Bus Stand, Karnataka</p>
                                    <p className="text-secondary text-xs font-semibold mt-1">4 km away</p>
                                </div>
                            </GlassCard>
                        </ScrollAnimation>

                        <ScrollAnimation direction="right" delay={0.4}>
                            <GlassCard glowColor="pink" hover3d>
                                <div className="text-center">
                                    <div className="text-3xl mb-3">🚂</div>
                                    <h4 className="font-bold text-sm mb-1">Nearest Railway Station</h4>
                                    <p className="text-foreground/70 text-sm">Kolhapur Railway Station, Maharashtra</p>
                                    <p className="text-accent text-xs font-semibold mt-1">42 km away</p>
                                </div>
                            </GlassCard>
                        </ScrollAnimation>
                    </div>

                    {/* Map & Contact */}
                    <ScrollAnimation direction="up" delay={0.5}>
                        <GlassCard glowColor="cyan" className="max-w-4xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                        <MapPin className="w-5 h-5 text-primary" /> Campus Address
                                    </h3>
                                    <p className="text-foreground/70 text-sm mb-6 leading-relaxed">
                                        Basava Vidya Nagar, Shripewadi Road, Nipani<br />
                                        Tal: Chikodi, Dist: Belagavi<br />
                                        State: Karnataka, India
                                    </p>
                                    <div className="space-y-3">
                                        <a href="tel:08338221391" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm">
                                            <Phone className="w-4 h-4" /> (08338) 221391
                                        </a>
                                        <a href="tel:9880217636" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm">
                                            <Phone className="w-4 h-4" /> 9880217636
                                        </a>
                                        <a href="mailto:principalvsmit@gmail.com" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm">
                                            <Mail className="w-4 h-4" /> principalvsmit@gmail.com
                                        </a>
                                        <a href="https://www.vsmsrkit.edu.in" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-primary hover:text-primary/80 transition-colors text-sm">
                                            <Globe className="w-4 h-4" /> www.vsmsrkit.edu.in
                                        </a>
                                    </div>
                                </div>
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
                            </div>
                        </GlassCard>
                    </ScrollAnimation>
                </div>
            </section>

            {/* Back to Hackaura CTA */}
            <section className="relative py-16 px-4">
                <div className="container mx-auto max-w-6xl">
                    <ScrollAnimation direction="up">
                        <GlassCard glowColor="purple" className="max-w-3xl mx-auto text-center">
                            <h2 className="text-2xl md:text-4xl font-bold mb-4">
                                <span className="gradient-text">HACKAURA 2026</span>
                            </h2>
                            <p className="text-foreground/70 mb-6">
                                Proudly organized by Vikram Sarabhai Tech Club at VSMSRKIT
                            </p>
                            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                                <Link to="/">
                                    <NeonButton variant="primary" className="min-w-[200px]">
                                        ← Back to Hackaura
                                    </NeonButton>
                                </Link>
                                <Link to="/register">
                                    <NeonButton variant="secondary" className="min-w-[200px]">
                                        Register Now
                                    </NeonButton>
                                </Link>
                            </div>
                        </GlassCard>
                    </ScrollAnimation>
                </div>
            </section>

            {/* Footer */}
            <footer className="relative py-8 px-4 border-t border-primary/20">
                <div className="container mx-auto text-center">
                    <p className="text-sm text-foreground/50 mb-2">
                        © 2026 VSM's Somashekhar R. Kothiwale Institute of Technology, Nipani. All Rights Reserved.
                    </p>
                    <div className="text-sm text-foreground/40 mt-3 pt-3 border-t border-primary/10 max-w-sm mx-auto space-y-1">
                        <p>Website Developed by Mudassir Alladatkhan and team</p>
                        <p>All rights are reserved by Vikram Sarabhai Tech Club.</p>
                    </div>
                </div>
            </footer>
        </div>
    );
}
