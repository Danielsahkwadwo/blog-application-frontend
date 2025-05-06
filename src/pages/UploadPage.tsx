import React from 'react';
import { Layout } from '../components/layout/Layout';
import { UploadForm } from '../components/photos/UploadForm';

export const UploadPage: React.FC = () => {
  return (
    <Layout>
      <UploadForm />
    </Layout>
  );
};