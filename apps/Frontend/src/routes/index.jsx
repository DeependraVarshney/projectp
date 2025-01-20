import { Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import AuthLayout from '../components/layout/AuthLayout';
import CompanyLayout from '../components/layout/company/CompanyLayout';
import routes from './routes';
import Error404 from '../pages/Error404';
import Settings from '../pages/admin/Settings';
import LandingPage from '../pages/Landing/LandingPage';
// import StudentDashboard from '../components/student/StudentDashboard';
import StudentRegistration from '../components/student/StudentRegistration';
import StudentDashboard from "../components/student/StudentDashboard";
import ProfileEdit from "../components/student/sections/Profile/ProfileEdit/ProfileEdit";
import ApplicationsSection from "../components/student/sections/Applications/ApplicationSection";
import ResumeBuilder from "../components/student/sections/resume/ResumeBuilder";
import ProfileSection from "../components/student/sections/Profile/ProfileSection";
import JobSection from "../components/student/sections/jobs/JobSection";
import NotificationsSection from "../components/student/sections/NotificationSection";

// Main Layout
const Loading = () => (
  <Box
    sx={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
    }}
  >
    <CircularProgress />
  </Box>
);

const AppRoutes = () => {
  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        {/* Auth Routes */}
        <Route path="/auth" element={<AuthLayout />}>
          {routes
            .find((r) => r.path === '/auth')
            ?.children.map((route) => {
              // Handle nested routes
              if (route.children) {
                return (
                  <Route key={route.path} path={route.path}>
                    {route.children.map((childRoute) => (
                      <Route
                        key={childRoute.path}
                        path={childRoute.path}
                        element={<childRoute.element />}
                      />
                    ))}
                  </Route>
                );
              }
              return (
                <Route
                  key={route.path}
                  path={route.path}
                  element={<route.element />}
                />
              );
            })}
        </Route>

        {/* Admin Routes */}
        <Route path="/admin" element={<MainLayout />}>
          {routes
            .find((r) => r.path === '/admin')
            ?.children.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.element />}
              />
            ))}
          <Route path="settings" element={<Settings />} />
        </Route>
        {/* Company Routes */}
        <Route path="/company" element={<CompanyLayout />}>
          {routes
            .find((r) => r.path === '/company')
            ?.children.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.element />}
              />
            ))}
        </Route>
        {/* Student Routes */}
        <Route path="/student/:id/*" element={<StudentDashboard />}>
          <Route index element={<ProfileSection />} />
          <Route path="profile" element={<ProfileSection />} />
          <Route path="profile/edit" element={<ProfileEdit />} />
          <Route path="applications" element={<ApplicationsSection />} />
          <Route path="resume" element={<ResumeBuilder />} />
          <Route path="jobs" element={<JobSection />} />
          <Route path="notifications" element={<NotificationsSection />} />
        </Route>
         
        <Route path="/student/complete-profile" element={< StudentRegistration/>}/>
        {/* Root Redirect */}
        {/* <Route path="/" element={<Navigate to="/admin/dashboard" replace />} /> */}
        <Route path="/" element={<LandingPage/>} />

        {/* 404 Route */}
        <Route path="*" element={<Error404 />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;