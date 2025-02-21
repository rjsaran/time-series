import React, { useEffect, useState } from 'react';
import { Table } from 'antd';
import { ColumnsType } from 'antd/es/table';
import moment from 'moment';

import { listTimeSeries, TimeSeriesDataRow } from '../services/time-series';
import { FiltersState } from './Actions';

const PAGE_SIZE = 5;

interface DataTableProps {
  filters: FiltersState;
  refreshKey: number;
}

const DataTable: React.FC<DataTableProps> = ({ filters, refreshKey }) => {
  const [data, setData] = useState<TimeSeriesDataRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [total, setTotal] = useState(0);

  const columns: ColumnsType<TimeSeriesDataRow> = [
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
      render: (val) => moment(val).format('YYYY-MM-DD HH:mm:ss'),
    },
    { title: 'Amount', dataIndex: 'amount', key: 'amount' },
    { title: 'Product', dataIndex: 'product', key: 'product' },
    { title: 'Category', dataIndex: 'category', key: 'category' },
  ];

  useEffect(() => {
    fetchData();
  }, [page, pageSize, refreshKey, filters]);

  const fetchData = async () => {
    setLoading(true);
    const { items, paging } = await listTimeSeries(
      page,
      pageSize,
      filters.from,
      filters.to
    );

    setData(items);
    setTotal(paging.total);
    setLoading(false);
  };

  return (
    <Table
      style={{ padding: '10px', width: '100%' }}
      columns={columns}
      dataSource={data.map((item) => ({
        ...item,
        key: item.id,
      }))}
      loading={loading}
      pagination={{
        current: page,
        pageSize,
        total,
        position: ['bottomCenter'],
        onChange: (newPage, newPageSize) => {
          setPage(newPage);
          setPageSize(newPageSize);
        },
      }}
    />
  );
};

export default DataTable;
