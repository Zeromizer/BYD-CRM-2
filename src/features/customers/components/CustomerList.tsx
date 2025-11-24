import React, { useState, useMemo } from 'react';
import { useCustomers, useCustomerStats } from '../hooks/useCustomers';
import { Card, CardBody, Button, Input, LoadingSpinner } from '@/shared/components';
import type { Customer } from '../schemas/customer.schema';
import './CustomerList.css';

interface CustomerListProps {
  onSelectCustomer: (customer: Customer) => void;
  onCreateCustomer: () => void;
}

export const CustomerList: React.FC<CustomerListProps> = ({
  onSelectCustomer,
  onCreateCustomer,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [dealStatusFilter, setDealStatusFilter] = useState<'all' | 'open' | 'closed'>('all');

  const { data: customers = [], isLoading, error } = useCustomers();
  const { data: stats } = useCustomerStats();

  const filteredCustomers = useMemo(() => {
    let filtered = [...customers];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query) ||
          customer.phone.includes(query) ||
          customer.email?.toLowerCase().includes(query) ||
          customer.nric.toLowerCase().includes(query) ||
          customer.vsaNo?.toLowerCase().includes(query)
      );
    }

    // Apply deal status filter
    if (dealStatusFilter !== 'all') {
      filtered = filtered.filter((customer) =>
        dealStatusFilter === 'closed' ? customer.dealClosed : !customer.dealClosed
      );
    }

    // Sort by most recent first
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return filtered;
  }, [customers, searchQuery, dealStatusFilter]);

  if (isLoading) {
    return (
      <div className="customer-list__loading">
        <LoadingSpinner size="large" label="Loading customers..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-list__error">
        <p>Error loading customers. Please try again.</p>
        <Button onClick={() => window.location.reload()}>Reload</Button>
      </div>
    );
  }

  return (
    <div className="customer-list">
      {/* Stats Section */}
      {stats && (
        <div className="customer-list__stats">
          <Card className="stat-card">
            <CardBody>
              <div className="stat-card__value">{stats.total}</div>
              <div className="stat-card__label">Total Customers</div>
            </CardBody>
          </Card>
          <Card className="stat-card">
            <CardBody>
              <div className="stat-card__value">{stats.closed}</div>
              <div className="stat-card__label">Deals Closed</div>
            </CardBody>
          </Card>
          <Card className="stat-card">
            <CardBody>
              <div className="stat-card__value">{stats.open}</div>
              <div className="stat-card__label">Open Deals</div>
            </CardBody>
          </Card>
          <Card className="stat-card">
            <CardBody>
              <div className="stat-card__value">
                {stats.total > 0
                  ? Math.round((stats.closed / stats.total) * 100)
                  : 0}
                %
              </div>
              <div className="stat-card__label">Conversion Rate</div>
            </CardBody>
          </Card>
        </div>
      )}

      {/* Search and Filter Section */}
      <div className="customer-list__controls">
        <Input
          type="text"
          placeholder="Search by name, phone, email, NRIC, or VSA..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          fullWidth
          leftIcon={
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.35-4.35" />
            </svg>
          }
        />
        <div className="customer-list__filters">
          <Button
            variant={dealStatusFilter === 'all' ? 'primary' : 'ghost'}
            onClick={() => setDealStatusFilter('all')}
          >
            All ({customers.length})
          </Button>
          <Button
            variant={dealStatusFilter === 'open' ? 'primary' : 'ghost'}
            onClick={() => setDealStatusFilter('open')}
          >
            Open ({stats?.open || 0})
          </Button>
          <Button
            variant={dealStatusFilter === 'closed' ? 'primary' : 'ghost'}
            onClick={() => setDealStatusFilter('closed')}
          >
            Closed ({stats?.closed || 0})
          </Button>
        </div>
        <Button variant="primary" onClick={onCreateCustomer}>
          + New Customer
        </Button>
      </div>

      {/* Customer List */}
      {filteredCustomers.length === 0 ? (
        <div className="customer-list__empty">
          {searchQuery || dealStatusFilter !== 'all' ? (
            <>
              <p>No customers found matching your filters.</p>
              <Button
                variant="ghost"
                onClick={() => {
                  setSearchQuery('');
                  setDealStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            </>
          ) : (
            <>
              <p>No customers yet. Create your first customer to get started.</p>
              <Button variant="primary" onClick={onCreateCustomer}>
                + Create First Customer
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="customer-list__grid">
          {filteredCustomers.map((customer) => (
            <Card
              key={customer.id}
              hover
              onClick={() => onSelectCustomer(customer)}
              className="customer-card"
            >
              <CardBody>
                <div className="customer-card__header">
                  <h3 className="customer-card__name">{customer.name}</h3>
                  <span
                    className={`customer-card__badge ${
                      customer.dealClosed ? 'customer-card__badge--closed' : 'customer-card__badge--open'
                    }`}
                  >
                    {customer.dealClosed ? 'Closed' : 'Open'}
                  </span>
                </div>
                <div className="customer-card__details">
                  <div className="customer-card__detail">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                    <span>{customer.phone}</span>
                  </div>
                  {customer.email && (
                    <div className="customer-card__detail">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                        <polyline points="22,6 12,13 2,6" />
                      </svg>
                      <span>{customer.email}</span>
                    </div>
                  )}
                  <div className="customer-card__detail">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" />
                      <line x1="8" y1="2" x2="8" y2="6" />
                      <line x1="3" y1="10" x2="21" y2="10" />
                    </svg>
                    <span>Created {new Date(customer.createdAt).toLocaleDateString()}</span>
                  </div>
                </div>
                {customer.vsaNo && (
                  <div className="customer-card__vsa">
                    <strong>VSA:</strong> {customer.vsaNo}
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
