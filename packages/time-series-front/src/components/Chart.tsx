import React, { useEffect, useState } from 'react';
import { Card, Spin, Alert } from 'antd';
import { Column } from '@ant-design/plots';

import {
  getTimeSeriesMetrics,
  GetTimeSeriesMetricsPayload,
  TimeSeriesMetric,
} from '../services/time-series';
import { FiltersState } from './Actions';

interface ChartProps {
  filters: FiltersState;
  title: string;
  interval: string;
  agg: string;
}

const MAX_DATA_POINTS = 20;

const Chart: React.FC<ChartProps> = ({ filters, title, interval, agg }) => {
  const [data, setData] = useState<TimeSeriesMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const payload: GetTimeSeriesMetricsPayload = {
        filter: {
          from: filters.from,
          to: filters.to,
        },
        group: {
          by: { interval },
          computes: [{ type: agg, path: 'amount', as: 'value' }],
        },
      };

      const items = await getTimeSeriesMetrics(payload);

      setData(items.slice(0, MAX_DATA_POINTS) || []);
    } catch (err) {
      setError('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [interval, agg, title, filters]);

  return (
    <Card title={title} style={{ width: '100%' }}>
      {loading ? (
        <Spin
          size="large"
          style={{
            display: 'block',
            textAlign: 'center',
            margin: '50px 0',
          }}
        />
      ) : error ? (
        <Alert message={error} type="error" showIcon />
      ) : (
        <Column
          {...{
            data,
            xField: 'interval',
            yField: 'value',
            animation: {
              appear: { animation: 'path-in', duration: 5000 },
            },
          }}
        />
      )}
    </Card>
  );
};

export default Chart;
