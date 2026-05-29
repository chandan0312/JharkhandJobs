import { useState } from 'react';
import { Search, MapPin, Briefcase } from 'lucide-react';

const SearchBar = ({ onSearch, initialQuery = '', initialLocation = 'All Locations', initialCategory = 'All Categories' }) => {
  const [search, setSearch] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState(initialCategory);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearch) {
      onSearch({ search, location, category });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar animate-slide-up" style={{ width: '100%' }}>
      {/* Title/Skills Field */}
      <div className="search-field">
        <Search size={18} />
        <input
          type="text"
          placeholder="Job title, skills or company..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Location Select Field */}
      <div className="search-field">
        <MapPin size={18} />
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="All Locations">All Locations</option>
          <option value="Jharkhand">Jharkhand (All)</option>
          <option value="Ranchi">Ranchi</option>
          <option value="Jamshedpur">Jamshedpur</option>
          <option value="Dhanbad">Dhanbad</option>
          <option value="Bokaro">Bokaro</option>
        </select>
      </div>

      {/* Category Select Field */}
      <div className="search-field">
        <Briefcase size={18} />
        <select value={category} onChange={(e) => setCategory(e.target.value)}>
          <option value="All Categories">All Categories</option>
          <option value="Private Jobs">Private Jobs</option>
          <option value="Govt Jobs">Govt Jobs (Sarkari)</option>
        </select>
      </div>

      {/* Search Button */}
      <button type="submit" className="btn-search">
        Search Jobs
      </button>
    </form>
  );
};

export default SearchBar;
