export const getDashboardPath = (userRole) => {
  switch (userRole) {
    case 'student':
      return '/student/dashboard';
    case 'company':
      return '/company/dashboard';
    case 'admin':
      return '/admin/dashboard';
    default:
      return '/';
  }
}; 