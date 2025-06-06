// Property Create/Edit Wizard (Google Places, LocalStorage, Modular Components)
import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import PropertyAddressStep from '@/components/property/form/PropertyAddressStep';
import PropertyCategoryStep from '@/components/property/form/PropertyCategoryStep';
import PropertyDetailsStep from '@/components/property/form/PropertyDetailsStep';
import PropertyFeaturesStep from '@/components/property/form/PropertyFeaturesStep';
import PropertyStructureStep from '@/components/property/form/PropertyStructureStep';
import PropertySubmitStep from '@/components/property/form/PropertySubmitStep';
import PropertyPreviewMediaStep from '@/components/property/form/PropertyPreviewMediaStep';

// Config: Enable localStorage draft saving in dev only
const ENABLE_DRAFT_STORAGE = process.env.NODE_ENV !== 'production';
const DRAFT_KEY = 'property-wizard-draft';

const steps = [
  { label: 'Address', component: PropertyAddressStep },
  { label: 'Category', component: PropertyCategoryStep },
  { label: 'Details', component: PropertyDetailsStep },
  { label: 'Features', component: PropertyFeaturesStep },
  { label: 'Structure & Price', component: PropertyStructureStep },
  { label: 'Submit', component: PropertySubmitStep },
  { label: 'Preview & Media', component: PropertyPreviewMediaStep },
];

export default function PropertiesCreateWizard(props: any) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<any>(() => {
    if (ENABLE_DRAFT_STORAGE) {
      try {
        const draft = localStorage.getItem(DRAFT_KEY);
        if (draft) return JSON.parse(draft);
      } catch {}
    }
    return {};
  });
  const [errors, setErrors] = useState<any>({});
  const [processing, setProcessing] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Add local state for dynamic attributes (key-value pairs) for the wizard, similar to create form
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>(() => []);

  // Ensure features is always an array to avoid uncontrolled input warnings
  useEffect(() => {
    if (!Array.isArray(formData.features)) {
      setFormData((d: any) => ({ ...d, features: [] }));
    }
  }, [formData.features]);

  // Keep formData.dynamic_attributes in sync with attributes
  useEffect(() => {
    if (typeof formData === 'object' && formData) {
      const dynamic = attributes.reduce((acc, { key, value }) => {
        if (key) acc[key] = value;
        return acc;
      }, {} as Record<string, string>);
      setFormData((d: any) => ({ ...d, dynamic_attributes: dynamic }));
    }
  }, [attributes]);

  // Initialize attributes from formData.dynamic_attributes on mount or step change
  useEffect(() => {
    if (formData && formData.dynamic_attributes && Array.isArray(attributes) && Object.keys(formData.dynamic_attributes).length > 0) {
      // Only update if attributes is empty (first load)
      if (attributes.length === 0) {
        setAttributes(Object.entries(formData.dynamic_attributes).map(([key, value]) => ({ key, value: String(value) })));
      }
    }
  }, [step]);

  // Save draft to localStorage (dev only)
  useEffect(() => {
    if (ENABLE_DRAFT_STORAGE) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
    }
  }, [formData]);

  // Clear draft on submit success
  function clearDraft() {
    if (ENABLE_DRAFT_STORAGE) localStorage.removeItem(DRAFT_KEY);
  }

  // Step navigation
  function nextStep() { setStep(s => Math.min(steps.length - 1, s + 1)); }
  function prevStep() { setStep(s => Math.max(0, s - 1)); }

  // Step validation (implement per step in each component)
  function validateCurrentStep(): boolean {
    // Each step component should expose a validate method or return errors
    // For now, always true
    return true;
  }

  // Submission handler
  async function handleSubmit() {
    setProcessing(true);
    setSuccessMessage(null);
    setErrors({});
    try {
      // Prepare submission object for backend validation
      const submission = { ...formData };
      if (formData.address) {
        submission.country_id = formData.address.country_id || '';
        submission.state_id = formData.address.state_id || '';
        submission.suburb_id = formData.address.suburb_id || '';
        submission.postcode = formData.address.postcode || '';
      }
      // Ensure price is an object, not a string
      if (typeof formData.price === 'string') {
        try {
          submission.price = JSON.parse(formData.price);
        } catch {
          submission.price = {};
        }
      }
      await new Promise<void>((resolve, reject) => {
        router.post('/properties', submission, {
          onSuccess: (page) => {
            setSuccessMessage('Property created successfully!');
            clearDraft();
            // Debug: log the response page object
            // eslint-disable-next-line no-console
            console.log('Inertia onSuccess page:', page);
            resolve();
          },
          onError: (errors) => {
            setErrors(errors || {});
            setSuccessMessage(null);
            setProcessing(false);
            // Debug: log errors
            // eslint-disable-next-line no-console
            console.error('Inertia onError:', errors);
            reject(errors);
          },
          onFinish: (visit) => {
            // Debug: log the visit object
            // eslint-disable-next-line no-console
            console.log('Inertia onFinish:', visit);
          },
        });
      });
    } catch (e: any) {
      // errors handled in onError above
    } finally {
      setProcessing(false);
    }
  }

  const CurrentStep = steps[step].component;

  // Prepare props for each step
  const stepProps: any = {
    data: formData,
    setData: (key: string, value: any) => setFormData((d: any) => ({ ...d, [key]: value })),
    errors,
    setErrors,
    processing,
    nextStep,
    prevStep,
    handleSubmit,
    categoryGroups: props.categoryGroups,
    featureGroups: props.featureGroups,
    attributes,
    setAttributes,
    ...props,
  };

  return (
    <AppLayout breadcrumbs={[]}> 
      <Head title="Create Property (Wizard)" />
      <div className="mb-6">
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <div key={s.label} className={`px-3 py-1 rounded-full ${i === step ? 'bg-blue-600 text-white' : 'bg-zinc-200 text-zinc-700'}`}>
              {s.label}
            </div>
          ))}
        </div>
      </div>
      <CurrentStep {...stepProps} />
      {/* Show pretty JSON payload on Submit step */}
      {step === steps.findIndex(s => s.label === 'Submit') && (
        <div className="my-6 p-4 bg-zinc-100 dark:bg-zinc-800 rounded border border-zinc-300 dark:border-zinc-700">
          <div className="font-semibold mb-2 text-zinc-700 dark:text-zinc-200">Submission Payload Preview</div>
          <pre className="text-xs whitespace-pre-wrap break-all text-zinc-800 dark:text-zinc-100" style={{ maxHeight: 400, overflow: 'auto' }}>
            {JSON.stringify(formData, null, 2)}
          </pre>
        </div>
      )}
      <div className="flex justify-between mt-8">
        <Button type="button" onClick={prevStep} disabled={step === 0}>Back</Button>
        {step < steps.length - 1 ? (
          <Button type="button" onClick={() => { if (validateCurrentStep()) nextStep(); }}>
            Next
          </Button>
        ) : (
          <Button type="button" onClick={handleSubmit} disabled={processing}>Submit</Button>
        )}
      </div>
      {successMessage && (
        <div className="my-4 p-3 rounded bg-green-100 text-green-800 border border-green-300">
          {successMessage}
        </div>
      )}
    </AppLayout>
  );
}
