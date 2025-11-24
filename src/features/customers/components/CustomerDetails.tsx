import React, { useState } from 'react';
import { useCustomer, useDeleteCustomer, useUpdateChecklistItem } from '../hooks/useCustomers';
import { Button, Card, CardHeader, CardBody, LoadingSpinner, Modal } from '@/shared/components';
import type { Customer } from '../schemas/customer.schema';
import './CustomerDetails.css';

interface CustomerDetailsProps {
  customerId: string;
  onEdit: (customer: Customer) => void;
  onBack: () => void;
  onDeleted: () => void;
}

export const CustomerDetails: React.FC<CustomerDetailsProps> = ({
  customerId,
  onEdit,
  onBack,
  onDeleted,
}) => {
  const { data: customer, isLoading, error } = useCustomer(customerId);
  const deleteCustomer = useDeleteCustomer();
  const updateChecklistItem = useUpdateChecklistItem();

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleDelete = async () => {
    try {
      await deleteCustomer.mutateAsync(customerId);
      setShowDeleteModal(false);
      onDeleted();
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  const handleChecklistToggle = async (key: string, value: boolean) => {
    if (!customer) return;

    try {
      await updateChecklistItem.mutateAsync({
        customerId,
        key,
        value,
      });
    } catch (error) {
      console.error('Failed to update checklist:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="customer-details__loading">
        <LoadingSpinner size="large" label="Loading customer details..." />
      </div>
    );
  }

  if (error || !customer) {
    return (
      <div className="customer-details__error">
        <p>Error loading customer details. Please try again.</p>
        <Button onClick={onBack}>Go Back</Button>
      </div>
    );
  }

  return (
    <div className="customer-details">
      <div className="customer-details__header">
        <Button variant="ghost" onClick={onBack} className="customer-details__back">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
          Back
        </Button>
        <div className="customer-details__actions">
          <Button variant="secondary" onClick={() => onEdit(customer)}>
            Edit Customer
          </Button>
          <Button variant="danger" onClick={() => setShowDeleteModal(true)}>
            Delete
          </Button>
        </div>
      </div>

      <div className="customer-details__content">
        <Card>
          <CardHeader>
            <div className="customer-details__title-section">
              <h1 className="customer-details__name">{customer.name}</h1>
              <span
                className={`customer-details__badge ${
                  customer.dealClosed
                    ? 'customer-details__badge--closed'
                    : 'customer-details__badge--open'
                }`}
              >
                {customer.dealClosed ? 'Deal Closed' : 'Deal Open'}
              </span>
            </div>
          </CardHeader>
          <CardBody>
            <div className="customer-details__grid">
              {/* Personal Information */}
              <div className="customer-details__section">
                <h3 className="customer-details__section-title">Personal Information</h3>
                <div className="customer-details__fields">
                  <div className="customer-details__field">
                    <span className="customer-details__field-label">Phone</span>
                    <span className="customer-details__field-value">
                      <a href={`tel:${customer.phone}`}>{customer.phone}</a>
                    </span>
                  </div>
                  {customer.email && (
                    <div className="customer-details__field">
                      <span className="customer-details__field-label">Email</span>
                      <span className="customer-details__field-value">
                        <a href={`mailto:${customer.email}`}>{customer.email}</a>
                      </span>
                    </div>
                  )}
                  <div className="customer-details__field">
                    <span className="customer-details__field-label">NRIC</span>
                    <span className="customer-details__field-value">{customer.nric}</span>
                  </div>
                  <div className="customer-details__field">
                    <span className="customer-details__field-label">Date of Birth</span>
                    <span className="customer-details__field-value">
                      {new Date(customer.dob).toLocaleDateString()}
                    </span>
                  </div>
                  {customer.occupation && (
                    <div className="customer-details__field">
                      <span className="customer-details__field-label">Occupation</span>
                      <span className="customer-details__field-value">{customer.occupation}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Address */}
              <div className="customer-details__section">
                <h3 className="customer-details__section-title">Address</h3>
                <div className="customer-details__fields">
                  <div className="customer-details__field">
                    <span className="customer-details__field-value">
                      {customer.address}
                      {customer.addressContinue && (
                        <>
                          <br />
                          {customer.addressContinue}
                        </>
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Sales Information */}
              <div className="customer-details__section">
                <h3 className="customer-details__section-title">Sales Information</h3>
                <div className="customer-details__fields">
                  <div className="customer-details__field">
                    <span className="customer-details__field-label">Sales Consultant</span>
                    <span className="customer-details__field-value">{customer.salesConsultant}</span>
                  </div>
                  {customer.vsaNo && (
                    <div className="customer-details__field">
                      <span className="customer-details__field-label">VSA Number</span>
                      <span className="customer-details__field-value">{customer.vsaNo}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Checklist */}
              <div className="customer-details__section customer-details__section--full">
                <h3 className="customer-details__section-title">Checklist</h3>
                <div className="customer-details__checklist">
                  {Object.entries(customer.checklist).map(([key, value]) => (
                    <label key={key} className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={value}
                        onChange={(e) => handleChecklistToggle(key, e.target.checked)}
                      />
                      <span>{formatChecklistLabel(key)}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Notes */}
              {customer.notes && (
                <div className="customer-details__section customer-details__section--full">
                  <h3 className="customer-details__section-title">Notes</h3>
                  <div className="customer-details__notes">{customer.notes}</div>
                </div>
              )}

              {/* Google Drive */}
              {customer.driveFolderLink && (
                <div className="customer-details__section customer-details__section--full">
                  <h3 className="customer-details__section-title">Google Drive</h3>
                  <div className="customer-details__fields">
                    <div className="customer-details__field">
                      <span className="customer-details__field-label">Folder</span>
                      <span className="customer-details__field-value">
                        <a href={customer.driveFolderLink} target="_blank" rel="noopener noreferrer">
                          Open in Google Drive
                        </a>
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Metadata */}
              <div className="customer-details__section customer-details__section--full">
                <h3 className="customer-details__section-title">Record Information</h3>
                <div className="customer-details__fields">
                  <div className="customer-details__field">
                    <span className="customer-details__field-label">Created</span>
                    <span className="customer-details__field-value">
                      {new Date(customer.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <div className="customer-details__field">
                    <span className="customer-details__field-label">Last Updated</span>
                    <span className="customer-details__field-value">
                      {new Date(customer.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Customer"
        size="small"
      >
        <div className="customer-details__delete-modal">
          <p>
            Are you sure you want to delete <strong>{customer.name}</strong>? This action cannot be
            undone.
          </p>
          <div className="customer-details__delete-actions">
            <Button variant="ghost" onClick={() => setShowDeleteModal(false)}>
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDelete}
              loading={deleteCustomer.isPending}
            >
              Delete Customer
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

function formatChecklistLabel(key: string): string {
  const labels: Record<string, string> = {
    nricCollected: 'NRIC Collected',
    testDriveCompleted: 'Test Drive Completed',
    vsaSigned: 'VSA Signed',
    tradeInDocuments: 'Trade-In Documents Received',
    paymentReceived: 'Payment Received',
  };
  return labels[key] || key;
}
