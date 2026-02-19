import { useState } from 'react';
import { ParticleBackground } from '@/components/ui/particle-background';
import { GlassCard } from '@/components/ui/glass-card';
import { NeonButton } from '@/components/ui/neon-button';
import { Loader2, Cpu, Mail, Target, Code, CheckCircle2, Wrench, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import ky from 'ky';
import { Link } from 'react-router-dom';

import { GOOGLE_SCRIPT_API_URL } from '@/lib/config';
const DOMAIN = "Internet of Things";

const iotProblems = [
    {
        id: 'PS-1',
        title: 'Smart Water Management System',
        problem: 'Water wastage is a critical issue across colleges, hostels, and residential buildings. Overhead tanks frequently overflow because motors are left running unattended, and underground tank levels go unmonitored — leading to thousands of liters wasted daily. There is no affordable, real-time system available for small-scale buildings to track water levels and automate pump control.\n\nYour challenge is to design and build an IoT-based Smart Water Management System that uses sensors to continuously monitor the water level inside a tank, automatically switches the motor pump ON when the level drops below a set threshold and OFF when the tank is full, and displays live water level data on a web or mobile dashboard. The system should also send alert notifications (buzzer/LED/push notification) for overflow detection or critically low levels.\n\nThis solution has real-world impact — it can be deployed in hostels, apartments, and agricultural setups to save water and reduce electricity costs.',
        features: [
            'Ultrasonic sensor (HC-SR04) to measure the distance between sensor and water surface, calculating the water level percentage',
            'Automatic motor pump control via relay module — turns ON when water drops below 20% and OFF when it reaches 90%',
            'Real-time web dashboard showing live water level percentage with a visual gauge or progress bar',
            'Alert system with buzzer and LED indicators for overflow warning and critically low water levels',
            'Historical data logging — store water level readings with timestamps for usage analysis',
        ],
        components: 'Ultrasonic sensor (HC-SR04), Relay module (5V), ESP32/NodeMCU, Buzzer, LED indicators (Red/Green), Jumper wires, Breadboard, Small water pump (for demo)',
        bonus: 'Add mobile push notifications using Blynk or Firebase. Implement a water usage tracker showing daily/weekly consumption trends.',
    },
    {
        id: 'PS-2',
        title: 'Smart Agriculture Monitoring System',
        problem: 'India\'s small-scale and marginal farmers — who make up over 80% of the farming community — lack access to technology for real-time crop health monitoring. Decisions about when to irrigate, how much water is needed, and whether conditions are favorable for crop growth are often based on guesswork. This leads to over-irrigation (waterlogging), under-irrigation (crop damage), and overall poor yields.\n\nYour task is to build an IoT-based Smart Agriculture Monitoring System that uses multiple sensors to continuously track soil moisture levels, ambient temperature, humidity, and optionally light intensity. Based on sensor readings, the system should automatically trigger irrigation (water pump via relay) when soil moisture falls below a critical threshold. All data should be displayed on a real-time web dashboard with interactive charts and graphs.\n\nThe system should also have an alert mechanism that notifies the farmer when environmental conditions become extreme — such as very high temperature, very low humidity, or waterlogged soil.',
        features: [
            'Soil moisture sensor to detect real-time soil water content and determine if irrigation is needed',
            'DHT11/DHT22 sensor to monitor ambient temperature and humidity around the crop area',
            'Automatic irrigation — trigger water pump via relay when soil moisture drops below a configurable threshold (e.g., below 30%)',
            'Web dashboard with live sensor data visualization using line charts and graphs showing trends over time',
            'Alert system for extreme weather conditions — dashboard notifications and buzzer alarm for extreme heat, drought, or waterlogged conditions',
        ],
        components: 'Soil moisture sensor (capacitive recommended), DHT11/DHT22 sensor, Relay module (5V), Mini water pump or servo valve, ESP32/NodeMCU, Buzzer, LED indicators, Breadboard, Jumper wires',
        bonus: 'Add an LDR (Light Dependent Resistor) to monitor sunlight exposure. Implement a crop recommendation engine that suggests suitable crops based on current soil and weather conditions.',
    },
    {
        id: 'PS-3',
        title: 'Patient Health Monitoring & Emergency Alert System',
        problem: 'In rural India and resource-limited healthcare settings, continuous patient monitoring systems are either too expensive or entirely unavailable. Patients recovering from surgeries, elderly individuals living alone, and those with chronic conditions like heart disease often lack any kind of real-time health tracking. Delayed detection of abnormal vital signs — such as irregular heartbeat or sudden fever spikes — can lead to medical emergencies or even fatalities.\n\nYour challenge is to build a portable or wearable IoT-based Patient Health Monitoring System that continuously tracks the patient\'s heart rate (using a pulse sensor) and body temperature (using a temperature sensor). The data should be streamed in real-time to a web-based dashboard accessible by doctors or family members.\n\nIf any vital sign goes outside the normal range (e.g., heart rate above 120 bpm or below 50 bpm, temperature above 38.5 degrees C), the system must trigger an emergency alert — activating a buzzer, flashing an LED, and sending a notification to the dashboard. All readings should be logged with timestamps so doctors can review patient history.',
        features: [
            'Pulse/Heart rate sensor to continuously monitor heartbeats per minute (BPM) with real-time display',
            'Body temperature sensor (LM35 or DS18B20) for continuous fever and hypothermia detection',
            'Real-time web dashboard showing live heart rate and temperature with visual indicators (normal/warning/critical)',
            'Emergency alert system — buzzer sounds, red LED flashes, and dashboard notification when vitals cross predefined thresholds',
            'Data logging with timestamps — store every reading in a database or spreadsheet for doctor review and trend analysis',
        ],
        components: 'Pulse sensor (SEN-11574), Temperature sensor (LM35 or DS18B20), ESP32/NodeMCU, Buzzer (active), LEDs (Green/Red), OLED display (optional for bedside readings), Breadboard, Jumper wires',
        bonus: 'Add SpO2 (blood oxygen) monitoring using a MAX30100/MAX30102 sensor. Implement SMS alerts to emergency contacts using Twilio or a GSM module.',
    },
    {
        id: 'PS-4',
        title: 'Smart Home Energy Monitor & Optimizer',
        problem: 'Indian households pay an average electricity bill of Rs. 1,500 to 5,000 per month, but most families have no idea which appliances consume the most power or when they are wasting electricity. Fans, lights, chargers, and other devices are often left running even when rooms are unoccupied. Without visibility into consumption patterns, there is no way to make informed decisions about reducing energy usage.\n\nYour task is to design and build an IoT-based Smart Home Energy Monitor that measures the real-time power consumption of connected appliances using a current sensor (ACS712). The system should display per-appliance energy usage on a web dashboard with graphs showing hourly and daily trends. It should also calculate estimated electricity cost based on local tariff rates.\n\nFor optimization, the system should include a relay module that can automatically turn off appliances that have been idle for a configurable time period. Optionally, a PIR motion sensor can be added to implement motion-based lighting — lights turn on when someone enters the room and off when the room is empty.',
        features: [
            'ACS712 current sensor to measure real-time power consumption (watts) of connected appliances',
            'Real-time web dashboard showing per-appliance energy usage with hourly and daily consumption graphs',
            'Automatic idle appliance detection — if no significant current draw is detected for X minutes, the relay cuts off power',
            'Cost estimation — calculate daily, weekly, and monthly electricity cost based on local unit rate',
            'PIR motion sensor for motion-based lighting control — auto ON when room is occupied, auto OFF when empty (optional but recommended)',
        ],
        components: 'ACS712 current sensor (5A/20A), Relay module (single/dual channel), PIR motion sensor (HC-SR501), ESP32/NodeMCU, LED indicators, OLED display (optional), Breadboard, Jumper wires, AC bulb/fan for demo',
        bonus: 'Add a daily energy report emailed to the user. Implement a peak hours detector that warns when usage is high during expensive tariff windows.',
    },
    {
        id: 'PS-5',
        title: 'Smart Parking & Traffic Management System',
        problem: 'Finding a parking spot in colleges, malls, and urban areas is a daily struggle. Drivers spend an average of 15 to 20 minutes circling parking lots looking for an available space, wasting fuel, time, and causing unnecessary traffic congestion and emissions. Most parking lots have no system to indicate which spots are free and which are occupied — drivers have to physically drive through every lane to check.\n\nYour challenge is to build an IoT-based Smart Parking System that uses IR or ultrasonic sensors placed at each parking slot to detect whether the slot is occupied or vacant. This occupancy data should be displayed on a live web dashboard showing a visual parking map — green for available slots, red for occupied ones. The system should also include an entry/exit gate mechanism using a servo motor and an LCD or LED counter at the entrance showing the total number of available spots.\n\nThis is a highly practical project that can be scaled and deployed in real parking lots, college campuses, and commercial buildings with minimal hardware investment.',
        features: [
            'IR or ultrasonic sensors at each parking slot to detect vehicle presence (occupied or vacant)',
            'Live web dashboard displaying a real-time parking map — green (available) and red (occupied) indicators for each slot',
            'Entry/exit gate control using servo motor that lifts when a vehicle approaches and lowers after entry',
            'Available spot counter on LCD display at the parking entrance showing remaining spots (e.g., Available: 12/50)',
            'Data logging — track parking lot utilization over time, peak hours, and average occupancy rate',
        ],
        components: 'IR sensors (2-4 for demo slots), Servo motor (SG90 for gate), LCD display (16x2 I2C), ESP32/NodeMCU, LEDs (Red/Green per slot), Breadboard, Jumper wires, Cardboard or 3D printed parking model for demo',
        bonus: 'Add a reservation system via the web dashboard where users can reserve a slot in advance. Implement automatic billing based on parking duration.',
    },
    {
        id: 'PS-6',
        title: 'Industrial Safety & Environmental Monitoring System',
        problem: 'Industrial workplaces such as factories, chemical plants, laboratories, and even commercial kitchens are vulnerable to serious hazards including gas leaks (LPG, methane, carbon monoxide), fire outbreaks, and dangerously high temperatures. India witnesses thousands of industrial accidents annually, many of which could be prevented with early detection systems. However, existing industrial safety systems are prohibitively expensive for small factories and workshops.\n\nYour task is to build an affordable IoT-based Industrial Safety and Environmental Monitoring System that continuously monitors the environment for gas leaks (using MQ-2 or MQ-5 gas sensor), fire (using a flame sensor), and abnormal temperature or humidity (using DHT11). The system must implement a 3-level emergency response: Level 1 (Warning) — yellow LED and dashboard warning when gas concentration slightly increases. Level 2 (Alert) — red LED and buzzer alarm when gas crosses a dangerous threshold or flame is detected. Level 3 (Emergency) — activate exhaust fan or ventilation via relay and send emergency notification to dashboard.\n\nAll sensor readings should be logged with timestamps for regulatory compliance and safety audits. The web dashboard should show a zone-wise safety status overview with real-time data.',
        features: [
            'MQ-2/MQ-5 gas sensor for continuous monitoring of LPG, methane, smoke, and combustible gases with configurable threshold levels',
            'Flame sensor for real-time fire detection — triggers immediate Level 2 alert upon detection',
            'DHT11/DHT22 temperature and humidity sensor to detect overheating or abnormal environmental conditions',
            '3-level graduated alert system: Level 1 (Yellow LED warning), Level 2 (Buzzer + Red LED alarm), Level 3 (Relay activates exhaust fan + dashboard emergency alert)',
            'Automatic ventilation — exhaust fan or servo-controlled vent activated via relay when gas concentration exceeds safe limits',
            'Data logging with timestamps for every sensor reading — exportable for compliance reports and safety audits',
            'Live web dashboard showing zone-wise safety status with color-coded indicators (Green/Yellow/Red)',
        ],
        components: 'MQ-2 or MQ-5 gas sensor, Flame sensor (IR-based), DHT11/DHT22 sensor, Relay module (for fan/vent), Buzzer (active), LEDs (Green/Yellow/Red), ESP32/NodeMCU, Mini DC fan (for demo exhaust), Breadboard, Jumper wires',
        bonus: 'Add SMS/email emergency alerts to safety officers using Twilio or SMTP. Implement a Safety Score metric that rates workplace safety based on sensor history.',
    },
];

export default function IoT() {
    const [expandedPS, setExpandedPS] = useState<string | null>(null);
    const [showVerify, setShowVerify] = useState(false);
    const [step, setStep] = useState<'ticket' | 'otp' | 'problem'>('ticket');
    const [ticketId, setTicketId] = useState('');
    const [otp, setOtp] = useState('');
    const [_teamName, setTeamName] = useState('');
    const [leaderEmail, setLeaderEmail] = useState('');
    const [_assignedProblem, setAssignedProblem] = useState<any>(null);
    const [problem, setProblem] = useState<any>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTicketSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await ky.get(GOOGLE_SCRIPT_API_URL, {
                searchParams: { action: 'verifyDomainTicket', ticketId: ticketId.trim(), domain: DOMAIN },
                timeout: 30000
            }).json<any>();
            if (response.result === 'success') {
                setTeamName(response.teamName);
                setLeaderEmail(response.leaderEmail);
                setAssignedProblem(response.assignedProblem);
                await sendOTP();
            } else {
                setError(response.message || 'Verification failed');
            }
        } catch (err: any) {
            setError(err.message || 'Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const sendOTP = async () => {
        setLoading(true);
        try {
            const response = await ky.get(GOOGLE_SCRIPT_API_URL, {
                searchParams: { action: 'sendOTP', ticketId: ticketId.trim() },
                timeout: 30000
            }).json<any>();
            if (response.result === 'success') {
                setStep('otp');
            } else {
                setError(response.message || 'Failed to send OTP');
            }
        } catch (err) {
            setError('Failed to send OTP');
        } finally {
            setLoading(false);
        }
    };

    const handleOTPSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            const response = await ky.get(GOOGLE_SCRIPT_API_URL, {
                searchParams: { action: 'verifyOTP', ticketId: ticketId.trim(), otp: otp.trim() },
                timeout: 30000
            }).json<any>();
            if (response.result === 'success') {
                if (_assignedProblem) { await fetchAssignedProblem(); return; }
                try {
                    const assignResponse = await ky.get(GOOGLE_SCRIPT_API_URL, {
                        searchParams: { action: 'assignProblem', ticketId: ticketId.trim(), problemNumber: '1' },
                        timeout: 30000
                    }).json<any>();
                    if (assignResponse.result === 'success') { await fetchAssignedProblem(); }
                    else { setError(assignResponse.message || 'Failed to assign problem'); }
                } catch { await fetchAssignedProblem(); }
            } else {
                setError(response.message || 'Invalid OTP');
            }
        } catch { setError('OTP verification failed'); }
        finally { setLoading(false); }
    };

    const fetchAssignedProblem = async () => {
        setLoading(true);
        try {
            const response = await ky.get(GOOGLE_SCRIPT_API_URL, {
                searchParams: { action: 'getAssignedProblem', ticketId: ticketId.trim() },
                timeout: 30000
            }).json<any>();
            if (response.result === 'success') { setProblem(response.problem); setStep('problem'); }
            else { setError('Failed to fetch problem details'); }
        } catch { setError('Failed to load problem'); }
        finally { setLoading(false); }
    };

    const assignedPSDetails = problem ? iotProblems.find(p => p.id === `PS-${problem.number}`) : null;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-950 via-emerald-950 to-slate-950 relative overflow-hidden">
            <ParticleBackground />

            {/* Decorative */}
            <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-1/4 w-80 h-80 bg-green-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 container mx-auto px-4 py-16 md:py-20">

                {/* Header */}
                <div className="text-center mb-12">
                    <Link to="/" className="inline-flex items-center gap-1 text-slate-500 hover:text-slate-300 text-sm transition-colors mb-6">
                        <ArrowLeft className="w-3.5 h-3.5" />
                        Back to Home
                    </Link>
                    <div className="inline-flex items-center gap-3 mb-6 px-5 py-2 rounded-full border border-emerald-500/20 bg-emerald-500/5 mx-auto block w-fit">
                        <Cpu className="w-5 h-5 text-emerald-400" />
                        <span className="text-emerald-400 text-sm font-medium tracking-wide uppercase">Internet of Things</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-bold mb-4">
                        <span className="bg-gradient-to-r from-emerald-300 via-green-400 to-teal-300 bg-clip-text text-transparent">
                            IoT Problem Statements
                        </span>
                    </h1>
                    <p className="text-slate-400 text-lg max-w-lg mx-auto">
                        6 challenges across beginner to advanced levels. Click any problem to view details.
                    </p>
                </div>

                {/* Problem Statements Grid */}
                <div className="max-w-4xl mx-auto space-y-4 mb-16">
                    {iotProblems.map((ps, index) => {
                        const isExpanded = expandedPS === ps.id;
                        return (
                            <div
                                key={ps.id}
                                className="cursor-pointer"
                                onClick={() => setExpandedPS(isExpanded ? null : ps.id)}
                            >
                                <GlassCard className="p-0 overflow-hidden transition-all duration-300 hover:border-emerald-500/40">
                                    {/* Header row */}
                                    <div className="flex items-center justify-between p-5 md:p-6">
                                        <div className="flex items-center gap-4 flex-1 min-w-0">
                                            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                                <span className="text-emerald-400 font-bold text-sm">{index + 1}</span>
                                            </div>
                                            <div className="min-w-0">
                                                <span className="text-xs font-mono text-emerald-400/70 tracking-wider">{ps.id}</span>
                                                <h3 className="text-base md:text-lg font-semibold text-white truncate">{ps.title}</h3>
                                            </div>
                                        </div>
                                        <div className="flex-shrink-0 ml-3 text-slate-500">
                                            {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                                        </div>
                                    </div>

                                    {/* Expanded content */}
                                    {isExpanded && (
                                        <div className="border-t border-white/5 bg-black/20 p-5 md:p-6 space-y-5">
                                            {/* Problem */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Code className="w-4 h-4 text-emerald-400" />
                                                    <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Problem</h4>
                                                </div>
                                                <p className="text-slate-300 leading-relaxed text-sm whitespace-pre-line">{ps.problem}</p>
                                            </div>

                                            {/* Features */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                                                    <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Expected Features</h4>
                                                </div>
                                                <ul className="space-y-2">
                                                    {ps.features.map((f, i) => (
                                                        <li key={i} className="flex items-start gap-2.5 text-slate-300 text-sm">
                                                            <span className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-[10px] text-emerald-400 font-medium mt-0.5">
                                                                {i + 1}
                                                            </span>
                                                            <span>{f}</span>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Components */}
                                            <div>
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Wrench className="w-4 h-4 text-emerald-400" />
                                                    <h4 className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">Suggested Components</h4>
                                                </div>
                                                <div className="flex flex-wrap gap-1.5">
                                                    {ps.components.split(', ').map((c, i) => (
                                                        <span key={i} className="px-2.5 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/15 text-emerald-300 text-xs">
                                                            {c}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Bonus */}
                                            {ps.bonus && (
                                                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                                                    <h4 className="text-xs font-semibold text-amber-400 uppercase tracking-wider mb-1.5">Bonus Tip</h4>
                                                    <p className="text-slate-400 text-sm">{ps.bonus}</p>
                                                </div>
                                            )}
                                        </div>
                                    )}
                                </GlassCard>
                            </div>
                        );
                    })}
                </div>

                {/* Verify Your Ticket Section */}
                <div className="max-w-xl mx-auto">
                    {!showVerify && step === 'ticket' && (
                        <div className="text-center">
                            <p className="text-slate-500 text-sm mb-4">Already registered? Check your assigned problem statement.</p>
                            <NeonButton onClick={() => setShowVerify(true)} className="px-8 py-3">
                                Verify Your Ticket
                            </NeonButton>
                        </div>
                    )}

                    {showVerify && step === 'ticket' && (
                        <GlassCard className="p-8 md:p-10">
                            <div className="text-center mb-8">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <Cpu className="w-7 h-7 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">Verify Your Ticket</h2>
                                <p className="text-slate-400 text-sm">Enter your Hackaura ticket ID to view your assigned problem</p>
                            </div>
                            <form onSubmit={handleTicketSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Ticket ID</label>
                                    <input
                                        type="text"
                                        value={ticketId}
                                        onChange={(e) => setTicketId(e.target.value)}
                                        placeholder="e.g. HA26-001"
                                        className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-4 text-white text-lg focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 focus:outline-none transition-all placeholder:text-slate-600"
                                        required
                                    />
                                </div>
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                        <p className="text-red-400 text-sm">{error}</p>
                                    </div>
                                )}
                                <NeonButton type="submit" disabled={loading} className="w-full py-4">
                                    {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</span> : 'Verify Ticket'}
                                </NeonButton>
                            </form>
                            <div className="mt-5 text-center">
                                <button onClick={() => { setShowVerify(false); setError(''); }} className="text-slate-500 hover:text-slate-300 text-sm transition-colors">Cancel</button>
                            </div>
                        </GlassCard>
                    )}

                    {step === 'otp' && (
                        <GlassCard className="p-8 md:p-10">
                            <div className="text-center mb-8">
                                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                                    <Mail className="w-7 h-7 text-emerald-400" />
                                </div>
                                <h2 className="text-2xl font-bold text-white mb-2">OTP Verification</h2>
                                <p className="text-slate-400 text-sm">We've sent a 6-digit code to</p>
                                <p className="text-emerald-400 font-medium mt-1">{leaderEmail}</p>
                            </div>
                            <form onSubmit={handleOTPSubmit} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-medium text-slate-300 mb-2">Enter OTP</label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value)}
                                        placeholder="------"
                                        maxLength={6}
                                        className="w-full bg-slate-900/80 border border-slate-700 rounded-xl p-4 text-white text-2xl text-center tracking-[0.5em] focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/30 focus:outline-none transition-all placeholder:text-slate-700"
                                        required
                                    />
                                </div>
                                {error && (
                                    <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                                        <p className="text-red-400 text-sm">{error}</p>
                                    </div>
                                )}
                                <NeonButton type="submit" disabled={loading} className="w-full py-4">
                                    {loading ? <span className="flex items-center justify-center gap-2"><Loader2 className="w-5 h-5 animate-spin" /> Verifying...</span> : 'Verify OTP'}
                                </NeonButton>
                            </form>
                            <div className="mt-5 text-center">
                                <button onClick={() => { setStep('ticket'); setError(''); }} className="text-slate-500 hover:text-slate-300 text-sm transition-colors inline-flex items-center gap-1">
                                    <ArrowLeft className="w-3.5 h-3.5" /> Back
                                </button>
                            </div>
                        </GlassCard>
                    )}

                    {step === 'problem' && problem && (
                        <div className="max-w-3xl mx-auto">
                            <GlassCard className="p-0 overflow-hidden">
                                <div className="bg-gradient-to-r from-emerald-600 to-teal-600 p-6 md:p-8">
                                    <div className="flex items-start justify-between">
                                        <div>
                                            <span className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-medium mb-3 tracking-wide">
                                                {assignedPSDetails?.id || `Problem #${problem.number}`}
                                            </span>
                                            <h2 className="text-2xl md:text-3xl font-bold text-white">
                                                {assignedPSDetails?.title || problem.title}
                                            </h2>
                                        </div>
                                        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
                                            <Target className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    <p className="text-white/70 text-sm mt-2 uppercase tracking-wider">Your Assigned Problem — HACKAURA 2025</p>
                                </div>

                                <div className="p-6 md:p-8 space-y-6">
                                    <div>
                                        <div className="flex items-center gap-2 mb-3">
                                            <Code className="w-5 h-5 text-emerald-400" />
                                            <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Problem Statement</h3>
                                        </div>
                                        <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800">
                                            <p className="text-slate-300 leading-relaxed">{assignedPSDetails?.problem || problem.description}</p>
                                        </div>
                                    </div>

                                    {assignedPSDetails && (
                                        <>
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                                                    <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Expected Features</h3>
                                                </div>
                                                <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800">
                                                    <ul className="space-y-3">
                                                        {assignedPSDetails.features.map((f, i) => (
                                                            <li key={i} className="flex items-start gap-3 text-slate-300">
                                                                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-xs text-emerald-400 font-medium mt-0.5">{i + 1}</span>
                                                                <span>{f}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            </div>
                                            <div>
                                                <div className="flex items-center gap-2 mb-3">
                                                    <Wrench className="w-5 h-5 text-emerald-400" />
                                                    <h3 className="text-sm font-semibold text-emerald-400 uppercase tracking-wider">Suggested Components</h3>
                                                </div>
                                                <div className="bg-slate-900/60 rounded-xl p-5 border border-slate-800">
                                                    <div className="flex flex-wrap gap-2">
                                                        {assignedPSDetails.components.split(', ').map((c, i) => (
                                                            <span key={i} className="px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm">{c}</span>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </>
                                    )}

                                    <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5 text-center">
                                        <p className="text-emerald-300 font-medium">Good Luck!</p>
                                        <p className="text-slate-400 text-sm mt-1">This is your assigned problem statement. Build something amazing!</p>
                                    </div>
                                </div>
                            </GlassCard>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
