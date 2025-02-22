import React from 'react';
import { Layout } from 'antd';

import HomePage from './pages/HomePage';

const { Content } = Layout;

const App: React.FC = () => {
  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Content
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '20px',
        }}
      >
        <HomePage />
      </Content>
    </Layout>
  );
};

export default App;
