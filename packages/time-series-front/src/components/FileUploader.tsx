import React, { useState } from 'react';
import { Upload, message } from 'antd';
import { InboxOutlined } from '@ant-design/icons';

import { uploadFile } from '../services/time-series';

const { Dragger } = Upload;

interface FileUploaderProps {
  onUploadSuccess: () => void;
}

const FileUploader: React.FC<FileUploaderProps> = ({ onUploadSuccess }) => {
  const [uploading, setUploading] = useState(false);

  const props = {
    beforeUpload: (file: File) => {
      if (!file.name.endsWith('.csv')) {
        message.error('Invalid file format. Please upload a CSV file.');

        return Upload.LIST_IGNORE;
      }

      return true;
    },
    customRequest: async ({ file, onSuccess, onError }: any) => {
      setUploading(true);
      try {
        const formData = new FormData();
        formData.append('file', file);
        await uploadFile(formData);
        message.success('File uploaded successfully 🎉');
        onSuccess();
        onUploadSuccess();
      } catch (error) {
        message.error('File upload failed. Please try again.');
        onError();
      } finally {
        setUploading(false);
      }
    },
    showUploadList: false,
  };

  return (
    <Dragger {...props} disabled={uploading}>
      <p className="ant-upload-drag-icon">
        <InboxOutlined />
      </p>
      <p className="ant-upload-text">Click or drag a CSV file to upload</p>
      {/* <p className="ant-upload-hint">Only CSV files are supported.</p> */}
    </Dragger>
  );
};

export default FileUploader;
