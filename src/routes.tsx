import Home from './pages/Home';
import Register from './pages/Register';
import RegistrationSuccess from './pages/RegistrationSuccess';
import TicketVerification from './pages/TicketVerification';
import PaymentScreenshots from './pages/admin/PaymentScreenshots';
import AdminScanner from './pages/admin/AdminScanner';
import AttendanceSheet from './pages/admin/AttendanceSheet';
import ParticipantsList from './pages/admin/ParticipantsList';
import ProjectSubmission from './pages/ProjectSubmission';
import GenAI from './pages/domains/GenAI';
import Cybersecurity from './pages/domains/Cybersecurity';
import FullStack from './pages/domains/FullStack';
import IoT from './pages/domains/IoT';
import Chatbot from './pages/Chatbot';
import SystemHealth from './pages/admin/SystemHealth';
import AdminLogin from './pages/AdminLogin';
import ProtectedRoute from '@/components/ProtectedRoute';
import type { ReactNode } from 'react';

interface RouteConfig {
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}

const routes: RouteConfig[] = [
  {
    name: 'Home',
    path: '/',
    element: <Home />
  },
  {
    name: 'Register',
    path: '/register',
    element: <Register />
  },
  {
    name: 'Success',
    path: '/registration-success',
    element: <RegistrationSuccess />,
    visible: false
  },
  {
    name: 'Verify Ticket',
    path: '/verify',
    element: <TicketVerification />
  },
  {
    name: 'Admin Login',
    path: '/admin/login',
    element: <AdminLogin />,
    visible: false
  },
  {
    name: 'Payment Screenshots',
    path: '/admin/payments',
    element: (
      <ProtectedRoute>
        <PaymentScreenshots />
      </ProtectedRoute>
    ),
    visible: false
  },
  {
    name: 'Admin Scanner',
    path: '/admin',
    element: (
      <ProtectedRoute>
        <AdminScanner />
      </ProtectedRoute>
    ),
    visible: false
  },
  {
    name: 'Print Attendance',
    path: '/admin/print',
    element: (
      <ProtectedRoute>
        <AttendanceSheet />
      </ProtectedRoute>
    ),
    visible: false
  },
  {
    name: 'Participants List',
    path: '/admin/participants',
    element: (
      <ProtectedRoute>
        <ParticipantsList />
      </ProtectedRoute>
    ),
    visible: false
  },
  {
    name: 'Submit Project',
    path: '/submit',
    element: <ProjectSubmission />,
    visible: false
  },
  {
    name: 'GenAI Problems',
    path: '/genai',
    element: <GenAI />,
    visible: false
  },
  {
    name: 'Cybersecurity Problems',
    path: '/cybersecurity',
    element: <Cybersecurity />,
    visible: false
  },
  {
    name: 'Full Stack Problems',
    path: '/fullstack',
    element: <FullStack />,
    visible: false
  },
  {
    name: 'IoT Problems',
    path: '/iot',
    element: <IoT />,
    visible: false
  },
  {
    name: 'AI Chatbot',
    path: '/chatbot',
    element: <Chatbot />,
    visible: true
  },
  {
    name: 'System Health',
    path: '/admin/health',
    element: (
      <ProtectedRoute>
        <SystemHealth />
      </ProtectedRoute>
    ),
    visible: false
  }
];

export default routes;