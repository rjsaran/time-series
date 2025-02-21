import React from 'react';
import { Row, Col } from 'antd';
import Chart from './Chart';
import { FiltersState } from './Actions';

interface ChartGridProps {
  filters: FiltersState;
}

const chartConfigs = [
  { title: 'Daily Revenue', interval: 'daily', agg: 'sum' },
  { title: 'Daily Count', interval: 'daily', agg: 'count' },
  { title: 'Weekly Revenue', interval: 'weekly', agg: 'sum' },
  { title: 'Weekly Count', interval: 'weekly', agg: 'count' },
  { title: 'Monthly Revenue', interval: 'monthly', agg: 'sum' },
  { title: 'Monthly Count', interval: 'monthly', agg: 'count' },
];

const ChartGrid: React.FC<ChartGridProps> = ({ filters }) => {
  return (
    <div style={{ padding: '20px' }}>
      <Row gutter={[16, 16]}>
        {chartConfigs.map(({ title, interval, agg }) => (
          <Col key={title} xs={24} sm={24} md={12}>
            <Chart
              title={title}
              interval={interval}
              agg={agg}
              filters={filters}
            />
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default ChartGrid;
