import React, { useState } from 'react';
import { useCreateCustomer, useUpdateCustomer } from '../hooks/useCustomers';
import { Button, Input, Textarea } from '@/shared/components';
import type { Customer } from '../schemas/customer.schema';
import './CustomerForm.css';

interface CustomerFormProps {
  customer?: Customer;
  mode: 'create' | 'edit';
  onSuccess: () => void;
  onCancel: () => void;
}

interface FormErrors {
  [key: string]: string;
}

export const CustomerForm: React.FC<CustomerFormProps> = ({
  customer,
  mode,
  onSuccess,
  onCancel,
}) => {
  const createCustomer = useCreateCustomer();
  const updateCustomer = useUpdateCustomer();

  const [formData, setFormData] = useState({
    name: customer?.name || '',
    phone: customer?.phone || '',
    email: customer?.email || '',
    nric: customer?.nric || '',
    dob: customer?.dob || '',
    occupation: customer?.occupation || '',
    address: customer?.address || '',
    addressContinue: customer?.addressContinue || '',
    salesConsultant: customer?.salesConsultant || '',
    vsaNo: customer?.vsaNo || '',
    dealClosed: customer?.dealClosed || false,
    notes: customer?.notes || '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [showChecklist, setShowChecklist] = useState(false);
  const [checklist, setChecklist] = useState<Record<string, boolean>>(
    customer?.checklist || {
      nricCollected: false,
      testDriveCompleted: false,
      vsaSigned: false,
      tradeInDocuments: false,
      paymentReceived: false,
    }
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));

    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleChecklistChange = (key: string, checked: boolean) => {
    setChecklist((prev) => ({
      ...prev,
      [key]: checked,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      if (mode === 'create') {
        await createCustomer.mutateAsync({
          ...formData,
          checklist,
        });
      } else if (customer) {
        await updateCustomer.mutateAsync({
          customerId: customer.id,
          data: formData,
        });
      }

      onSuccess();
    } catch (error) {
      console.error('Failed to save customer:', error);
      setErrors({ submit: 'Failed to save customer. Please try again.' });
    }
  };

  const isLoading = createCustomer.isPending || updateCustomer.isPending;

  return (
    <form onSubmit={handleSubmit} className="customer-form">
      <div className="customer-form__section">
        <h3 className="customer-form__section-title">Personal Information</h3>
        <div className="customer-form__grid">
          <Input
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={errors.name}
            required
            fullWidth
            disabled={isLoading}
          />
          <Input
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            error={errors.phone}
            required
            fullWidth
            disabled={isLoading}
          />
          <Input
            label="Email Address"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={errors.email}
            fullWidth
            disabled={isLoading}
          />
          <Input
            label="NRIC"
            name="nric"
            value={formData.nric}
            onChange={handleChange}
            error={errors.nric}
            helperText="Format: S1234567A"
            required
            fullWidth
            disabled={isLoading}
          />
          <Input
            label="Date of Birth"
            name="dob"
            type="date"
            value={formData.dob}
            onChange={handleChange}
            error={errors.dob}
            required
            fullWidth
            disabled={isLoading}
          />
          <Input
            label="Occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            error={errors.occupation}
            fullWidth
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="customer-form__section">
        <h3 className="customer-form__section-title">Address</h3>
        <div className="customer-form__grid">
          <Input
            label="Address Line 1"
            name="address"
            value={formData.address}
            onChange={handleChange}
            error={errors.address}
            required
            fullWidth
            disabled={isLoading}
          />
          <Input
            label="Address Line 2"
            name="addressContinue"
            value={formData.addressContinue}
            onChange={handleChange}
            error={errors.addressContinue}
            fullWidth
            disabled={isLoading}
          />
        </div>
      </div>

      <div className="customer-form__section">
        <h3 className="customer-form__section-title">Sales Information</h3>
        <div className="customer-form__grid">
          <Input
            label="Sales Consultant"
            name="salesConsultant"
            value={formData.salesConsultant}
            onChange={handleChange}
            error={errors.salesConsultant}
            required
            fullWidth
            disabled={isLoading}
          />
          <Input
            label="VSA Number"
            name="vsaNo"
            value={formData.vsaNo}
            onChange={handleChange}
            error={errors.vsaNo}
            helperText="Vehicle Sales Agreement number"
            fullWidth
            disabled={isLoading}
          />
          <div className="customer-form__checkbox">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="dealClosed"
                checked={formData.dealClosed}
                onChange={handleChange}
                disabled={isLoading}
              />
              <span>Deal Closed</span>
            </label>
          </div>
        </div>
      </div>

      <div className="customer-form__section">
        <div className="customer-form__section-header">
          <h3 className="customer-form__section-title">Checklist</h3>
          <Button
            type="button"
            variant="ghost"
            size="small"
            onClick={() => setShowChecklist(!showChecklist)}
          >
            {showChecklist ? 'Hide' : 'Show'}
          </Button>
        </div>
        {showChecklist && (
          <div className="customer-form__checklist">
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={checklist.nricCollected}
                onChange={(e) => handleChecklistChange('nricCollected', e.target.checked)}
                disabled={isLoading}
              />
              <span>NRIC Collected</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={checklist.testDriveCompleted}
                onChange={(e) => handleChecklistChange('testDriveCompleted', e.target.checked)}
                disabled={isLoading}
              />
              <span>Test Drive Completed</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={checklist.vsaSigned}
                onChange={(e) => handleChecklistChange('vsaSigned', e.target.checked)}
                disabled={isLoading}
              />
              <span>VSA Signed</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={checklist.tradeInDocuments}
                onChange={(e) => handleChecklistChange('tradeInDocuments', e.target.checked)}
                disabled={isLoading}
              />
              <span>Trade-In Documents Received</span>
            </label>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={checklist.paymentReceived}
                onChange={(e) => handleChecklistChange('paymentReceived', e.target.checked)}
                disabled={isLoading}
              />
              <span>Payment Received</span>
            </label>
          </div>
        )}
      </div>

      <div className="customer-form__section">
        <Textarea
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          error={errors.notes}
          rows={4}
          fullWidth
          disabled={isLoading}
        />
      </div>

      {errors.submit && (
        <div className="customer-form__error">
          {errors.submit}
        </div>
      )}

      <div className="customer-form__actions">
        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" loading={isLoading}>
          {mode === 'create' ? 'Create Customer' : 'Save Changes'}
        </Button>
      </div>
    </form>
  );
};
