// 📁 src/layouts/PublicLayout.jsx
import { Outlet } from "react-router-dom";

const PublicLayout = () => {
  return (
    <div className="container-fluid p-0 m-0">
      <Outlet />
    </div>
  );
};

export default PublicLayout;
