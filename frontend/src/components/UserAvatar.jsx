import React from 'react';

// Pure, beautifully crafted SVGs of cartoon animal characters
const ANIMALS = [
  // 0. Fox
  {
    name: 'Fox',
    gradient: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
    svg: (color) => (
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
        <path d="M12 19.5L5.5 13H18.5L12 19.5Z" fill="#F0541E" />
        <path d="M12 19.5L7.5 15H16.5L12 19.5Z" fill="#FFFFFF" />
        <path d="M5.5 13L3.5 6.5L8.5 9.5L12 13H5.5Z" fill="#E64A19" />
        <path d="M18.5 13L20.5 6.5L15.5 9.5L12 13H18.5Z" fill="#E64A19" />
        <path d="M8.5 9.5L5.5 7.5L5.5 12L8.5 9.5Z" fill="#FFFFFF" />
        <path d="M15.5 9.5L18.5 7.5L18.5 12L15.5 9.5Z" fill="#FFFFFF" />
        <circle cx="8" cy="11.5" r="1.2" fill="#212121" />
        <circle cx="16" cy="11.5" r="1.2" fill="#212121" />
        <path d="M12 15L11 13.8H13L12 15Z" fill="#212121" />
        <ellipse cx="6" cy="12.5" rx="1" ry="0.5" fill="#FF8A80" opacity="0.6" />
        <ellipse cx="18" cy="12.5" rx="1" ry="0.5" fill="#FF8A80" opacity="0.6" />
      </svg>
    )
  },
  // 1. Panda
  {
    name: 'Panda',
    gradient: 'linear-gradient(135deg, #7F8C8D 0%, #95A5A6 100%)',
    svg: () => (
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
        <circle cx="12" cy="13" r="6.5" fill="#FFFFFF" />
        <path d="M6.5 7.5C6.5 6.12 7.62 5 9 5C10.38 5 11.5 6.12 11.5 7.5" stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M12.5 7.5C12.5 6.12 13.62 5 15 5C16.38 5 17.5 6.12 17.5 7.5" stroke="#2C3E50" strokeWidth="2.5" strokeLinecap="round" />
        <ellipse cx="9" cy="12.5" rx="1.8" ry="2.2" fill="#2C3E50" transform="rotate(-15 9 12.5)" />
        <ellipse cx="15" cy="12.5" rx="1.8" ry="2.2" fill="#2C3E50" transform="rotate(15 15 12.5)" />
        <circle cx="9.2" cy="12.2" r="0.6" fill="#FFFFFF" />
        <circle cx="14.8" cy="12.2" r="0.6" fill="#FFFFFF" />
        <ellipse cx="6.5" cy="14" rx="1" ry="0.5" fill="#FF8A80" opacity="0.5" />
        <ellipse cx="17.5" cy="14" rx="1" ry="0.5" fill="#FF8A80" opacity="0.5" />
        <path d="M12 15L10.8 13.8H13.2L12 15Z" fill="#2C3E50" />
        <path d="M10.5 16C11 16.5 12 16.5 12.5 16" stroke="#2C3E50" strokeWidth="0.8" strokeLinecap="round" />
      </svg>
    )
  },
  // 2. Bear
  {
    name: 'Bear',
    gradient: 'linear-gradient(135deg, #8D6E63 0%, #5D4037 100%)',
    svg: () => (
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
        <circle cx="6.5" cy="7.5" r="2.5" fill="#8D6E63" />
        <circle cx="17.5" cy="7.5" r="2.5" fill="#8D6E63" />
        <circle cx="6.5" cy="7.5" r="1.3" fill="#D7CCC8" />
        <circle cx="17.5" cy="7.5" r="1.3" fill="#D7CCC8" />
        <circle cx="12" cy="13.5" r="6.5" fill="#A1887F" />
        <ellipse cx="12" cy="15" rx="3.2" ry="2.2" fill="#D7CCC8" />
        <circle cx="9" cy="12.5" r="1" fill="#2E1C0C" />
        <circle cx="15" cy="12.5" r="1" fill="#2E1C0C" />
        <path d="M12 14.5L11 13.5H13L12 14.5Z" fill="#2E1C0C" />
        <path d="M10.5 15.5C11 16 12 16 12.5 15.5" stroke="#2E1C0C" strokeWidth="0.8" strokeLinecap="round" fill="none" />
      </svg>
    )
  },
  // 3. Cat
  {
    name: 'Cat',
    gradient: 'linear-gradient(135deg, #A855F7 0%, #6366F1 100%)',
    svg: () => (
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
        <path d="M5.5 14L3.5 6.5L9 10.5L15 10.5L20.5 6.5L18.5 14H5.5Z" fill="#7C3AED" />
        <circle cx="12" cy="14" r="6.5" fill="#8B5CF6" />
        <path d="M5 7L7 10L4.5 10.5L5 7Z" fill="#F472B6" />
        <path d="M19 7L17 10L19.5 10.5L19 7Z" fill="#F472B6" />
        <ellipse cx="8.8" cy="13" rx="1.8" ry="2.2" fill="#FBBF24" />
        <ellipse cx="15.2" cy="13" rx="1.8" ry="2.2" fill="#FBBF24" />
        <circle cx="8.8" cy="13" r="0.8" fill="#1E1B4B" />
        <circle cx="15.2" cy="13" r="0.8" fill="#1E1B4B" />
        <path d="M12 15L11 14H13L12 15Z" fill="#1E1B4B" />
        <path d="M10.5 16C11 16.5 12 16.5 12.5 16" stroke="#1E1B4B" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M4 14.5H7.5" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M20 14.5H16.5" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
      </svg>
    )
  },
  // 4. Bunny
  {
    name: 'Bunny',
    gradient: 'linear-gradient(135deg, #EC4899 0%, #F472B6 100%)',
    svg: () => (
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
        <rect x="5.5" y="3" width="3.5" height="9" rx="1.7" fill="#F9A8D4" />
        <rect x="15" y="3" width="3.5" height="9" rx="1.7" fill="#F9A8D4" />
        <rect x="6.5" y="4.5" width="1.5" height="6.5" rx="0.7" fill="#F472B6" />
        <rect x="16" y="4.5" width="1.5" height="6.5" rx="0.7" fill="#F472B6" />
        <circle cx="12" cy="14" r="6.5" fill="#FCE7F3" />
        <circle cx="9.2" cy="12.8" r="1" fill="#475569" />
        <circle cx="14.8" cy="12.8" r="1" fill="#475569" />
        <circle cx="9.5" cy="12.5" r="0.3" fill="#FFFFFF" />
        <circle cx="15.1" cy="12.5" r="0.3" fill="#FFFFFF" />
        <ellipse cx="6.5" cy="14.5" rx="1.2" ry="0.6" fill="#F472B6" opacity="0.6" />
        <ellipse cx="17.5" cy="14.5" rx="1.2" ry="0.6" fill="#F472B6" opacity="0.6" />
        <ellipse cx="12" cy="14.8" rx="1.2" ry="0.8" fill="#EC4899" />
        <path d="M10.8 15.8C11.2 16.2 12.8 16.2 13.2 15.8" stroke="#475569" strokeWidth="0.8" strokeLinecap="round" />
      </svg>
    )
  },
  // 5. Koala
  {
    name: 'Koala',
    gradient: 'linear-gradient(135deg, #94A3B8 0%, #475569 100%)',
    svg: () => (
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
        <circle cx="5" cy="8.5" r="3.2" fill="#64748B" />
        <circle cx="19" cy="8.5" r="3.2" fill="#64748B" />
        <circle cx="5" cy="8.5" r="1.8" fill="#E2E8F0" />
        <circle cx="19" cy="8.5" r="1.8" fill="#E2E8F0" />
        <circle cx="12" cy="13.5" r="6.5" fill="#94A3B8" />
        <circle cx="9.2" cy="12.2" r="1" fill="#1E293B" />
        <circle cx="14.8" cy="12.2" r="1" fill="#1E293B" />
        <circle cx="9.4" cy="12" r="0.3" fill="#FFFFFF" />
        <circle cx="15" cy="12" r="0.3" fill="#FFFFFF" />
        <ellipse cx="12" cy="14.2" rx="1.8" ry="2.6" fill="#475569" />
        <path d="M10 16.2C11 16.8 13 16.8 14 16.2" stroke="#1E293B" strokeWidth="0.8" strokeLinecap="round" />
      </svg>
    )
  },
  // 6. Lion
  {
    name: 'Lion',
    gradient: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    svg: () => (
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
        {/* Mane */}
        <circle cx="12" cy="13" r="8" fill="#B45309" />
        <circle cx="12" cy="13" r="7" fill="#D97706" />
        {/* Face */}
        <circle cx="12" cy="13.5" r="5.5" fill="#FBBF24" />
        <circle cx="7.8" cy="8.5" r="1.5" fill="#FBBF24" />
        <circle cx="16.2" cy="8.5" r="1.5" fill="#FBBF24" />
        <ellipse cx="12" cy="15.2" rx="2.5" ry="1.8" fill="#FEF3C7" />
        <circle cx="9.2" cy="12.2" r="0.9" fill="#451A03" />
        <circle cx="14.8" cy="12.2" r="0.9" fill="#451A03" />
        <circle cx="9.4" cy="12" r="0.3" fill="#FFFFFF" />
        <circle cx="15" cy="12" r="0.3" fill="#FFFFFF" />
        <path d="M12 14.8L11 13.8H13L12 14.8Z" fill="#451A03" />
        <path d="M10.8 15.8C11.2 16.2 12.8 16.2 13.2 15.8" stroke="#451A03" strokeWidth="0.8" strokeLinecap="round" />
      </svg>
    )
  },
  // 7. Owl
  {
    name: 'Owl',
    gradient: 'linear-gradient(135deg, #0EA5E9 0%, #0369A1 100%)',
    svg: () => (
      <svg viewBox="0 0 24 24" width="100%" height="100%" fill="none">
        <path d="M4 14.5C4 10.5 7.5 7.5 12 7.5C16.5 7.5 20 10.5 20 14.5C20 18.5 16.5 20.5 12 20.5C7.5 20.5 4 18.5 4 14.5Z" fill="#0284C7" />
        {/* Large Eyes */}
        <circle cx="8.5" cy="11.5" r="2.8" fill="#FFFFFF" />
        <circle cx="15.5" cy="11.5" r="2.8" fill="#FFFFFF" />
        <circle cx="8.5" cy="11.5" r="1.5" fill="#0F172A" />
        <circle cx="15.5" cy="11.5" r="1.5" fill="#0F172A" />
        <circle cx="8.8" cy="11.2" r="0.5" fill="#FFFFFF" />
        <circle cx="15.8" cy="11.2" r="0.5" fill="#FFFFFF" />
        {/* Beak */}
        <path d="M12 12.5L10.8 14H13.2L12 12.5Z" fill="#F59E0B" />
        {/* Tuft Ears */}
        <path d="M5.5 8L8.5 10L4.5 10.5L5.5 8Z" fill="#0369A1" />
        <path d="M18.5 8L15.5 10L19.5 10.5L18.5 8Z" fill="#0369A1" />
        {/* Chest Feathers */}
        <path d="M10 16.5C10.5 17 11.5 17 12 16.5" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M8.5 18C9.5 18.5 10.5 18.5 11.5 18" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
        <path d="M12.5 18C13.5 18.5 14.5 18.5 15.5 18" stroke="#FFFFFF" strokeWidth="0.8" strokeLinecap="round" />
      </svg>
    )
  }
];

const UserAvatar = ({ user, size = 32, style = {} }) => {
  if (!user || !user.name) {
    return (
      <div style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        backgroundColor: '#E2E8F0',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#475569',
        fontSize: `${size * 0.4}px`,
        fontWeight: 'bold',
        ...style
      }}>
        ?
      </div>
    );
  }

  // Consistent index calculation based on user.email or user.name or user._id
  const seedStr = user.email || user._id || user.name || '';
  let hash = 0;
  for (let i = 0; i < seedStr.length; i++) {
    hash = seedStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % ANIMALS.length;
  const animal = ANIMALS[index];

  return (
    <div 
      title={`${user.name} (${animal.name})`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: '50%',
        background: animal.gradient,
        padding: `${size * 0.1}px`, // Slight inset to let the gradient act as a frame
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)',
        cursor: 'pointer',
        transition: 'transform 0.2s',
        ...style
      }}
      onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.05)'}
      onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
    >
      <div style={{ width: '90%', height: '90%' }}>
        {animal.svg()}
      </div>
    </div>
  );
};

export default UserAvatar;
export { ANIMALS };
