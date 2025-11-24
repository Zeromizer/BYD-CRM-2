import React, { useState, useMemo } from 'react';
import { useCustomers } from '../hooks/useCustomers';
import { Button, LoadingSpinner } from '@/shared/components';
import type { Customer } from '../schemas/customer.schema';
import './CustomerList.css';

interface CustomerListProps {
  onSelectCustomer: (customer: Customer) => void;
  onCreateCustomer: () => void;
  selectedCustomerId?: string;
}

// Helper function to get initials from name
const getInitials = (name: string): string => {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();
};

// Helper function to get avatar color based on name
const getAvatarColor = (name: string): string => {
  const colors = [
    '#00BCD4', // Cyan
    '#E91E63', // Pink
    '#9C27B0', // Purple
    '#673AB7', // Deep Purple
    '#3F51B5', // Indigo
    '#2196F3', // Blue
    '#00BCD4', // Cyan (repeated for more variety)
    '#009688', // Teal
  ];
  const index = name.charCodeAt(0) % colors.length;
  return colors[index];
};

export const CustomerList: React.FC<CustomerListProps> = ({
  onSelectCustomer,
  onCreateCustomer,
  selectedCustomerId,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const { data: customers = [], isLoading, error } = useCustomers();

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
          customer.nric.toLowerCase().includes(query)
      );
    }

    // Sort by most recent first
    filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return filtered;
  }, [customers, searchQuery]);

  if (isLoading) {
    return (
      <div className="customer-list">
        <div className="customer-list__loading">
          <LoadingSpinner size="medium" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="customer-list">
        <div className="customer-list__empty">
          <p>Error loading customers</p>
          <Button size="small" onClick={() => window.location.reload()}>
            Reload
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="customer-list">
      {/* Header */}
      <div className="customer-list__header">
        <h2 className="customer-list__title">Customer List</h2>
        <Button variant="primary" size="small" onClick={onCreateCustomer}>
          + Add Customer
        </Button>
      </div>

      {/* Search */}
      <div className="customer-list__search">
        <input
          type="text"
          className="customer-list__search-input"
          placeholder="Search customers..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Customer Items */}
      <div className="customer-list__items">
        {filteredCustomers.length === 0 ? (
          <div className="customer-list__empty">
            {searchQuery ? (
              <>
                <p className="customer-list__empty-text">No customers found</p>
                <Button size="small" variant="ghost" onClick={() => setSearchQuery('')}>
                  Clear Search
                </Button>
              </>
            ) : (
              <>
                <svg
                  className="customer-list__empty-icon"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <p className="customer-list__empty-text">No customers yet</p>
                <Button size="small" variant="primary" onClick={onCreateCustomer}>
                  Create First Customer
                </Button>
              </>
            )}
          </div>
        ) : (
          filteredCustomers.map((customer) => (
            <div
              key={customer.id}
              className={`customer-list__item ${
                selectedCustomerId === customer.id ? 'customer-list__item--active' : ''
              }`}
              onClick={() => onSelectCustomer(customer)}
            >
              <div
                className="customer-list__item-avatar avatar"
                style={{ backgroundColor: getAvatarColor(customer.name) }}
              >
                {getInitials(customer.name)}
              </div>
              <div className="customer-list__item-info">
                <div className="customer-list__item-name">{customer.name}</div>
                <div className="customer-list__item-phone">{customer.phone}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
