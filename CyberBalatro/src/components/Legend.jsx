import React from 'react';

// Mapping between poker concepts and cybersecurity concepts
const legendData = [
  {
    category: 'Attack Domains (Suits)',
    items: [
      { icon: '♦️', name: 'Social Engineering' },
      { icon: '♣️', name: 'Malware' },
      { icon: '♥️', name: 'Network Attack' },
      { icon: '♠️', name: 'Software Vulnerability' },
    ]
  },
  {
    category: 'Attack Tools (Face Cards)',
    items: [
      { icon: 'A', name: 'Zero-Day Exploit' },
      { icon: 'K', name: 'Ransomware' },
      { icon: 'Q', name: 'Phishing' },
      { icon: 'J', name: 'SQL Injection' },
    ]
  },
  {
    category: 'Attack Combinations (Hands)',
    items: [
      { icon: 'Flush', name: 'Social Engineering' },
      { icon: 'Straight', name: 'Cyber Kill Chain' },
      { icon: 'Straight Flush', name: '(APT)' },
    ]
  }
];

// Styles for the component
const legendStyles = {
  container: {
    padding: '10px 15px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
    marginTop: '20px',
  },
  categoryTitle: {
    margin: '10px 0 5px 0',
    fontSize: '16px',
    color: '#ffde59',
    borderBottom: '1px solid #555',
    paddingBottom: '5px',
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    fontSize: '13px',
  },
  listItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '3px 0',
  },
  icon: {
    width: '30px',
    textAlign: 'center',
    fontWeight: 'bold',
    marginRight: '10px',
  }
};

export default function Legend() {
  return (
    <div style={legendStyles.container}>
      {legendData.map(category => (
        <div key={category.category}>
          <h4 style={legendStyles.categoryTitle}>{category.category}</h4>
          <ul style={legendStyles.list}>
            {category.items.map(item => (
              <li key={item.name} style={legendStyles.listItem}>
                <span style={legendStyles.icon}>{item.icon}</span>
                <span>{item.name}</span>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
