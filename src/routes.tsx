import Home from './pages/Home';
import Register from './pages/Register';
import RegistrationSuccess from './pages/RegistrationSuccess';
import TicketVerification from './pages/TicketVerification';
import AdminScanner from './pages/admin/AdminScanner';
import AttendanceSheet from './pages/admin/AttendanceSheet';
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
    element: <TicketVerification />,
    visible: false
  },
  {
    name: 'Admin Scanner',
    path: '/admin',
    element: <AdminScanner />,
    visible: false
  },
  {
    name: 'Print Attendance',
    path: '/admin/print',
    element: <AttendanceSheet />,
    visible: false
  }
];

export default routes;