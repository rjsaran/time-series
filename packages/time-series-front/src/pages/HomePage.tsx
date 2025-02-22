import React, { useState } from 'react';
import { Typography } from 'antd';

import Actions, { FiltersState } from '../components/Actions';
import FileUploader from '../components/FileUploader';
import DataTable from '../components/DataTable';
import ChartGrid from '../components/ChartGrid';

const { Title } = Typography;

const HomePage: React.FC = () => {
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
    <>
      <Title level={2}>Time Series</Title>
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
    </>
  );
};

export default HomePage;
