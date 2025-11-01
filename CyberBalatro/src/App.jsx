import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// 导入我们所有的页面组件
import MainMenu from './pages/MainMenu'; // <-- 新增
import GamePage from './pages/GamePage';
import './App.css';

function App() {
  return (
    <Router>
      {/* The App container div is no longer needed here, 
          as each page now controls its own full-screen layout. */}
      <Routes>
        {/* 【关键改动 1】: 将根路径 '/' 指向我们的新封面 */}
        <Route path="/" element={<MainMenu />} />
        
        {/* 【关键改动 2】: 将游戏页面移动到一个新的路径 '/game' */}
        <Route path="/game" element={<GamePage />} />
        
      </Routes>
    </Router>
  );
}

export default App;