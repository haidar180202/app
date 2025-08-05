
const styles = `
  .app {
    background-color: #f8f9fa;
    min-height: 100vh;
  }

  .logo-circle {
    width: 32px;
    height: 32px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    font-size: 18px;
  }

  .user-avatar {
    width: 32px;
    height: 32px;
    font-size: 14px;
    font-weight: bold;
  }

  .status-card {
    transition: all 0.3s ease;
    cursor: pointer;
  }

  .status-card:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1) !important;
  }

  .task-item {
    transition: all 0.3s ease;
    border: 1px solid transparent;
  }

  .task-item:hover {
    border-color: #dee2e6;
    background-color: #fff !important;
  }

  .project-card {
    transition: all 0.3s ease;
  }

  .project-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15) !important;
  }

  .card-img-container::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0) 100%);
    pointer-events: none;
  }

  .circular-progress {
    position: relative;
  }

  .navbar-brand:hover {
    color: #fff !important;
  }

  .btn {
    transition: all 0.3s ease;
  }

  .btn:hover {
    transform: translateY(-1px);
  }

  @media (max-width: 768px) {
    .status-card {
      margin-bottom: 1rem;
    }
    
    .col-lg-4 {
      margin-bottom: 1rem;
    }
  }
`;

// Inject styles
const styleSheet = document.createElement("style");
styleSheet.innerText = styles;
document.head.appendChild(styleSheet);

interface StatusItem {
  id: number;
  title: string;
  count: number;
  color: string;
}

interface TaskItem {
  id: number;
  title: string;
  description: string;
  priority: 'High' | 'Medium' | 'Low';
  status: 'Pending' | 'In Progress' | 'Completed';
}

interface ProjectCard {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
  color: string;
}

export default function Dashboard() {

  const statusItems: StatusItem[] = [
    { id: 1, title: 'Accounting Depart', count: 30, color: '#FF6B6B' },
    { id: 2, title: 'Absent List', count: 12, color: '#4ECDC4' },
    { id: 3, title: 'Server', count: 88, color: '#45B7D1' },
    { id: 4, title: 'Data Center', count: 156, color: '#96CEB4' },
    { id: 5, title: 'Job Order', count: 23, color: '#FFEAA7' },
    { id: 6, title: 'EFU (IDB)', count: 45, color: '#DDA0DD' },
    { id: 7, title: 'CSV Complaint Manager', count: 67, color: '#98D8C8' },
    { id: 8, title: 'KI Staffing', count: 89, color: '#A29BFE' },
    { id: 9, title: 'Unit Supervisor Health Workload', count: 34, color: '#FD79A8' }
  ];

  // Dummy data untuk tasks
  const tasks: TaskItem[] = [
    { id: 1, title: 'Update Business Rules', description: 'Review and update current business rules', priority: 'High', status: 'In Progress' },
    { id: 2, title: 'System Maintenance', description: 'Scheduled system maintenance', priority: 'Medium', status: 'Pending' },
    { id: 3, title: 'Data Backup', description: 'Weekly data backup process', priority: 'High', status: 'Completed' },
    { id: 4, title: 'User Training', description: 'Conduct user training session', priority: 'Low', status: 'Pending' }
  ];

  // Dummy data untuk project cards
  const projectCards: ProjectCard[] = [
    {
      id: 1,
      title: 'Dashboard Analytics',
      description: 'Comprehensive analytics dashboard for business intelligence',
      image: '/api/placeholder/300/200',
      category: 'Analytics',
      color: '#667eea'
    },
    {
      id: 2,
      title: 'Mobile Application',
      description: 'Cross-platform mobile app development',
      image: '/api/placeholder/300/200',
      category: 'Development',
      color: '#764ba2'
    },
    {
      id: 3,
      title: 'HELPDESK TEKNOLOGI INFORMASI',
      description: 'IT support and helpdesk management system',
      image: '/api/placeholder/300/200',
      category: 'IT Support',
      color: '#f093fb'
    },
    {
      id: 4,
      title: 'Data Management',
      description: 'Efficient data management and processing',
      image: '/api/placeholder/300/200',
      category: 'Database',
      color: '#4facfe'
    }
  ];

  const getPriorityBadgeClass = (priority: string) => {
    switch (priority) {
      case 'High': return 'bg-outline-danger';
      case 'Medium': return 'bg-outline-warning';
      case 'Low': return 'bg-outline-success';
      default: return 'bg-outline-secondary';
    }
  };

  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-outline-success';
      case 'In Progress': return 'bg-outline-info';
      case 'Pending': return 'bg-outline-warning';
      default: return 'bg-outline-secondary';
    }
  };

  return (
    <div className="row">
      {/* Header */}
     

      <div className="container-fluid py-4">
        {/* Status Grid */}
        <div className="row mb-4">
          {statusItems.map((item) => (
            <div key={item.id} className="col-lg-4 col-md-6 mb-3">
              <div className="status-card h-100 p-3 rounded-3 shadow-sm border-0" 
                   style={{ backgroundColor: item.color + '20', borderLeft: `4px solid ${item.color}` }}>
                <div className="d-flex justify-content-between align-items-center">
                  <div>
                    <h6 className="mb-1 fw-semibold text-dark">{item.title}</h6>
                    <small className="text-muted">Active items</small>
                  </div>
                  <div className="status-count">
                    <span className="h4 fw-bold" style={{ color: item.color }}>{item.count}</span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="row">
          {/* Task Management Section */}
          <div className="col-lg-4 mb-4 bg-outline-primary">
            <div className="card h-100 shadow-md border-0">
              <div className="card-header border-0 pb-0">
                <h5 className="card-title mb-0 fw-bold">Task Management</h5>
                <small className="text-muted">Recent tasks and updates</small>
              </div>
              <div className="card-body">
                {tasks.map((task) => (
                  <div key={task.id} className="task-item p-3 mb-3 rounded">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <h6 className="mb-1 fw-semibold">{task.title}</h6>
                      <span className={`badge ${getPriorityBadgeClass(task.priority)} rounded-pill`}>
                        {task.priority}
                      </span>
                    </div>
                    <p className="text-muted small mb-2">{task.description}</p>
                    <span className={`badge ${getStatusBadgeClass(task.status)} rounded-pill`}>
                      {task.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Statistics Chart Placeholder */}
          <div className="col-lg-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-header border-0 pb-0">
                <h5 className="card-title mb-0 fw-bold">Statistics Overview</h5>
                <small className="text-muted">Monthly performance metrics</small>
              </div>
              <div className="card-body d-flex align-items-center justify-content-center">
                <div className="text-center">
                  <div className="progress-circle mb-3" style={{ width: '120px', height: '120px', margin: '0 auto' }}>
                    <div className="circular-progress position-relative d-flex align-items-center justify-content-center"
                         style={{ 
                           width: '120px', 
                           height: '120px', 
                           borderRadius: '50%',
                           background: `conic-gradient(#007bff 0deg 180deg, #e9ecef 180deg 360deg)`
                         }}>
                      <div className="rounded-circle d-flex align-items-center justify-content-center"
                           style={{ width: '80px', height: '80px' }}>
                        <span className="h4 fw-bold text-primary">75%</span>
                      </div>
                    </div>
                  </div>
                  <h6 className="mb-1">Completion Rate</h6>
                  <small className="text-muted">This month</small>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="col-lg-4 mb-4">
            <div className="card h-100 shadow-sm border-0">
              <div className="card-header border-0 pb-0">
                <h5 className="card-title mb-0 fw-bold">Quick Actions</h5>
                <small className="text-muted">Frequently used functions</small>
              </div>
              <div className="card-body">
                <div className="d-grid gap-2">
                  <button className="btn btn-outline-primary btn-sm">Generate Report</button>
                  <button className="btn btn-outline-success btn-sm">Create New Task</button>
                  <button className="btn btn-outline-info btn-sm">System Settings</button>
                  <button className="btn btn-outline-warning btn-sm">User Management</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Project Cards */}
        <div className="row mb-4">
          {projectCards.map((card) => (
            <div key={card.id} className="col-lg-6 col-xl-3 mb-4">
              <div className="card h-100 shadow-sm border-0 project-card">
                <div className="card-img-container position-relative overflow-hidden rounded-top"
                     style={{ height: '150px', background: `linear-gradient(135deg, ${card.color}, ${card.color}80)` }}>
                  <div className="d-flex align-items-center justify-content-center h-100 text-white">
                    <i className="bi bi-laptop fs-1"></i>
                  </div>
                  <div className="position-absolute top-0 end-0 m-2">
                    <span className="badge text-dark rounded-pill">{card.category}</span>
                  </div>
                </div>
                <div className="card-body">
                  <h6 className="card-title fw-bold mb-2">{card.title}</h6>
                  <p className="card-text text-muted small">{card.description}</p>
                  <button className="btn btn-sm btn-outline-primary">View Details</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

}
