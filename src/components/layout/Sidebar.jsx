import { Layout, Menu } from 'antd';
import { useLocation, useNavigate } from 'react-router-dom';
import { getMenuItemsForRole  } from '../../data/menuConfig.jsx';
import { useAuth } from '../../contexts/AuthContext';

const { Sider } = Layout;

const Sidebar = ({ collapsed }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // Get current page from pathname
  const currentPage = location.pathname.slice(1) || 'dashboard';

  const handleMenuClick = (e) => {
    navigate(`/${e.key}`);
  };

  const menuItems = getMenuItemsForRole(user.role_type);

  return (
    <Sider 
      width={280}
      theme="light"
      className="qfc-sidebar"
      collapsible
      collapsed={collapsed}
      collapsedWidth={80}
    >
      <Menu
        theme="light"
        selectedKeys={[currentPage]}
        mode="inline"
        items={menuItems}
        className="qfc-menu"
        onClick={handleMenuClick}
      />
    </Sider>
  );
};

export default Sidebar;
