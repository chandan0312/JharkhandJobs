import { Link } from 'react-router-dom';
import { MapPin, DollarSign, Clock, ChevronRight } from 'lucide-react';

const JobCard = ({ job }) => {
  const {
    _id,
    title,
    company,
    companyInitial = 'JO',
    companyColor = '#1B8C0A',
    location,
    type,
    salary,
    postedDate,
  } = job;

  // Calculate days ago format
  const getDaysAgo = (dateString) => {
    const today = new Date();
    const posted = new Date(dateString);
    const diffTime = Math.abs(today - posted);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) return 'Today';
    if (diffDays === 2) return '1d ago';
    if (diffDays <= 7) return `${diffDays - 1}d ago`;
    return '1w ago';
  };

  // Select badge class dynamically
  const getTypeBadgeClass = (jobType) => {
    switch (jobType) {
      case 'Full Time':
        return 'badge-primary';
      case 'Part Time':
        return 'badge-blue';
      case 'Contract':
        return 'badge-orange';
      case 'Internship':
        return 'badge-red';
      default:
        return 'badge-primary';
    }
  };

  return (
    <Link to={`/jobs/${_id}`} className="card card-sm animate-scale-in" style={{ display: 'block', textDecoration: 'none', marginBottom: '16px' }}>
      <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
        
        {/* Company Avatar with dynamic color */}
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '50%',
          backgroundColor: companyColor,
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontWeight: '700',
          fontSize: '16px',
          flexShrink: 0
        }}>
          {companyInitial}
        </div>

        {/* Job Details Area */}
        <div style={{ flex: 1, minWidth: '200px' }}>
          <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1A1A2E', marginBottom: '4px' }}>
            {title}
          </h3>
          <p style={{ fontSize: '13px', color: '#374151', fontWeight: '500', marginBottom: '6px' }}>
            {company}
          </p>
          
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Location */}
            <span style={{ fontSize: '12px', color: '#6B7280', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <MapPin size={14} style={{ color: '#9CA3AF' }} />
              {location}
            </span>
            {/* Salary */}
            <span style={{ fontSize: '12px', color: '#6B7280', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ fontWeight: '600', color: '#1B8C0A' }}>{salary?.currency || '₹'}{salary?.min}-{salary?.max} {salary?.period || 'LPA'}</span>
            </span>
          </div>
        </div>

        {/* Badges & Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginLeft: 'auto', flexWrap: 'wrap' }}>
          <span className={`badge ${getTypeBadgeClass(type)}`}>
            {type}
          </span>
          <span style={{ fontSize: '12px', color: '#9CA3AF', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
            <Clock size={12} />
            {getDaysAgo(postedDate)}
          </span>
          <ChevronRight size={18} style={{ color: '#1B8C0A' }} />
        </div>

      </div>
    </Link>
  );
};

export default JobCard;
