import { FaUserGraduate, FaChalkboardTeacher, FaCalendarAlt } from "react-icons/fa";

const AdminDashboard = () => {
  const cards = [
    {
      title: "Total Students",
      count: 120,
      icon: <FaUserGraduate size={28} className="text-white" />,
      bgColor: "bg-primary",
    },
    {
      title: "Total Teachers",
      count: 15,
      icon: <FaChalkboardTeacher size={28} className="text-white" />,
      bgColor: "bg-success",
    },
    {
      title: "Upcoming Exams",
      count: 3,
      icon: <FaCalendarAlt size={28} className="text-white" />,
      bgColor: "bg-warning",
    },
  ];

  return (
    <div className="container py-4">
      <h2 className="fw-bold mb-4">Dashboard</h2>

      <div className="row g-4">
        {cards.map((card, index) => (
          <div className="col-md-4" key={index}>
            <div className={`card shadow-sm text-white ${card.bgColor}`}>
              <div className="card-body d-flex align-items-center">
                <div className="me-3">{card.icon}</div>
                <div>
                  <h6 className="mb-1">{card.title}</h6>
                  <h3 className="mb-0">{card.count}</h3>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
