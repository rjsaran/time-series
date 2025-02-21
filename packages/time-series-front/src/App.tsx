import React, { useState } from 'react';
import { Layout, Typography } from 'antd';

import FileUploader from './components/FileUploader';
import DataTable from './components/DataTable';
import ChartGrid from './components/ChartGrid';
import Actions, { FiltersState } from './components/Actions';

const { Content } = Layout;
const { Title } = Typography;

const App: React.FC = () => {
  const [refreshKey, setRefreshKey] = useState(0);
  const [filters, setFilters] = useState<FiltersState>({
    from: null,
    to: null,
  });

  // Function to trigger a refresh
  const refreshData = () => {
    setRefreshKey((prevKey: number) => prevKey + 1);
  };

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
        <Title level={2}>Time Series App</Title>
        <FileUploader onUploadSuccess={refreshData} />
        <Actions
          onFilterChange={(from, to) => {
            setFilters({
              ...filters,
              from,
              to,
            });
          }}
        />

        <DataTable refreshKey={refreshKey} filters={filters} />
        <ChartGrid key={refreshKey} filters={filters} />
      </Content>
    </Layout>
  );
};

export default App;
