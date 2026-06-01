import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function RoleRedirect() {
  const navigate = useNavigate();
  const { department } = useSelector(state => state.auth);

  useEffect(() => {
    // No token or department means not logged in yet
    if (!department?.role) return;
    if (department.role === 'superadmin') {
      navigate('/superadmin/dashboard', { replace: true });
    } else if (department.role === 'admin' || department.role === 'department') {
      navigate('/dashboard', { replace: true });
    }
  }, [department, navigate]);

  return null;
}
