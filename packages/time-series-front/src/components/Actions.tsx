import React, { useState } from 'react';
import { Button, DatePicker, Space, Row, Col, message } from 'antd';
import { FilterOutlined, ExportOutlined } from '@ant-design/icons';

import { exportFile } from '../services/time-series';

export interface FiltersState {
  from: string | null;
  to: string | null;
}

interface ActionsProps {
  onFilterChange: (from: string | null, to: string | null) => void;
}

const Actions: React.FC<ActionsProps> = ({ onFilterChange }) => {
  const [fromDate, setFromDate] = useState<string | null>(null);
  const [toDate, setToDate] = useState<string | null>(null);

  const handleApplyFilters = () => {
    onFilterChange(fromDate, toDate);
  };

  const handleExport = async () => {
    try {
      const blob = await exportFile();

      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'time-series-data.csv';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);

      message.success('Data exported successfully 🎉');
    } catch (error) {
      message.error('Failed to export CSV');
    }
  };

  return (
    <Row
      style={{
        padding: '10px',
        width: '100%',
        background: 'white',
      }}
      justify="space-between"
      align="middle"
    >
      {/* Export Button (Aligned to Right) */}
      <Col>
        <Button type="primary" icon={<ExportOutlined />} onClick={handleExport}>
          Export Cleaned Data
        </Button>
      </Col>

      {/* Date Filters */}
      <Col>
        <Space>
          <DatePicker
            placeholder="From Date"
            onChange={(_, dateString) =>
              setFromDate(
                typeof dateString === 'string' ? dateString : dateString[0]
              )
            }
          />
          <DatePicker
            placeholder="To Date"
            onChange={(_, dateString) =>
              setToDate(
                typeof dateString === 'string' ? dateString : dateString[0]
              )
            }
          />
          <Button
            type="primary"
            icon={<FilterOutlined />}
            onClick={handleApplyFilters}
          >
            Apply Filters
          </Button>
        </Space>
      </Col>
    </Row>
  );
};

export default Actions;
