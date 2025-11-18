import React from 'react';
// 导入我们刚刚导出的 HAND_TYPES
import { HAND_TYPES } from '../logic/gameLogic.js';

// 将对象转换为数组，方便我们用 .map() 来渲染
const rules = Object.values(HAND_TYPES);

const ruleStyles = {
  container: {
    padding: '10px 15px',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: '8px',
  },
  title: {
    margin: '0 0 10px 0',
    fontSize: '18px',
    color: '#ffde59',
    textAlign: 'center',
  },
  list: {
    listStyle: 'none',
    margin: 0,
    padding: 0,
    fontSize: '14px',
  },
  listItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '4px 0',
    borderBottom: '1px solid #444',
  },
  handName: {
    fontWeight: 'bold',
  },
};

export default function HandRules() {
  return (
    <div style={ruleStyles.container}>
      <h3 style={ruleStyles.title}>Scoring Rules</h3>
      <ul style={ruleStyles.list}>
        {rules.map(rule => (
          <li key={rule.name} style={ruleStyles.listItem}>
            <span style={ruleStyles.handName}>{rule.name}</span>
            <span>{rule.baseChips} Chips x {rule.baseMult} Mult</span>
          </li>
        ))}
      </ul>
    </div>
  );
}