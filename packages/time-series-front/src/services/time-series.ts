import axios from 'axios';

const API_HOST =
  import.meta.env.VITE_BACKEND_API_HOST || 'http://localhost:4004';

export interface TimeSeriesDataRow {
  id: string;
  date: string;
  product: string;
  amount: number;
  category: string;
}

export interface TimeSeriesMetric {
  interval: string;
}

interface Paging {
  total: number;
  page: number;
  limit: number;
}

interface ListTimeSeriesResponse {
  paging: Paging;
  items: TimeSeriesDataRow[];
}

export interface GetTimeSeriesMetricsPayload {
  filter: {
    from: string | null;
    to: string | null;
  };
  group: {
    by: {
      interval: string;
    };
    computes: { type: string; path: string; as?: string }[];
  };
}

interface GetTimeSeriesMetricsResponse {
  items: TimeSeriesMetric[];
}

export const uploadFile = async (formData: FormData) => {
  await axios.post(`${API_HOST}/api/v1/time-series/upload/csv`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
};

export const exportFile = async () => {
  const { data } = await axios.get(`${API_HOST}/api/v1/time-series/export/csv`);

  return new Blob([data], { type: 'text/csv;charset=utf-8' });
};

export const listTimeSeries = async (
  page: number,
  pageSize: number,
  fromDate: string | null,
  toDate: string | null
) => {
  const params: Record<string, string | number> = { page, limit: pageSize };

  if (fromDate) params.from = fromDate;
  if (toDate) params.to = toDate;

  const { data } = await axios.get<ListTimeSeriesResponse>(
    `${API_HOST}/api/v1/time-series`,
    { params }
  );

  return data;
};

export const getTimeSeriesMetrics = async (
  payload: GetTimeSeriesMetricsPayload
) => {
  const { data } = await axios.post<GetTimeSeriesMetricsResponse>(
    `${API_HOST}/api/v1/time-series/metrics`,
    payload
  );

  return data.items;
};
