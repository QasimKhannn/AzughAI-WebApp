import React from 'react';
import PageLayout from '@/layout/PageLayout';
import AccountSettings from '@/features/account/components/AccountSettings';

const Account: React.FC = () => {
  return (
    <PageLayout>
      <AccountSettings />
    </PageLayout>
  );
};

export default Account;
