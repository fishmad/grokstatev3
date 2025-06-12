// Property Create/Edit Wizard (Google Places, LocalStorage, Modular Components)
import React, { useState, useEffect } from 'react';
import { Head, router } from '@inertiajs/react';
import AppLayout from '@/layouts/app-layout';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Progress } from "@/components/ui/progress"

import WizardStep1Category from '@/components/property/form/wizard-step-1-category';
import WizardStep2Listing from '@/components/property/form/wizard-step-2-listing-type';
import WizardStep3Price from '@/components/property/form/wizard-step-3-price';
import WizardStep4Address from '@/components/property/form/wizard-step-4-address';
import WizardStep5Details from '@/components/property/form/wizard-step-5-details';
import WizardStep6Features from '@/components/property/form/wizard-step-6-features';
import WizardStep7MediaUpload from '@/components/property/form/wizard-step-7-media-upload';
import WizardStep8PreviewSubmit from '@/components/property/form/wizard-step-8-preview-submit';

import PropertiesCreateMedia from '@/pages/properties/properties-create-media';
import { AlertDialog, AlertDialogTrigger, AlertDialogContent, AlertDialogHeader, AlertDialogTitle, AlertDialogDescription, AlertDialogFooter, AlertDialogAction, AlertDialogCancel } from "@/components/ui/alert-dialog";

// Config: Enable localStorage draft saving via env variable (default true for user-friendliness)
const ENABLE_DRAFT_STORAGE = import.meta.env.VITE_ENABLE_DRAFT_STORAGE !== 'false';
const DRAFT_KEY = 'property-wizard-draft';

const steps = [
  { label: 'Category', component: WizardStep1Category },
  { label: 'Listing', component: WizardStep2Listing },
  { label: 'Price', component: WizardStep3Price },
  { label: 'Address', component: WizardStep4Address },
  { label: 'Details', component: WizardStep5Details },
  { label: 'Features', component: WizardStep6Features },
  { label: 'Photos', component: WizardStep7MediaUpload },
  { label: 'Preview', component: WizardStep8PreviewSubmit },
];

export default function PropertiesCreateWizard(props: any) {
  // Step 1: Category
  const [category, setCategory] = useState("");
  // Step 4: Address
  const [address, setAddress] = useState("");
  // Property ID (after draft creation)
  const [propertyId, setPropertyId] = useState<string|null>(null);
  // Start at step 0 (Address)
  const [step, setStep] = useState(0);
  const totalSteps = 8;
  // Add state for form data and errors
  const [formData, setFormData] = useState<any>({
    address: {},
    category: '',
    // Add other fields as needed for later steps
  });
  const [errors, setErrors] = useState<any>({});
  const [processing, setProcessing] = useState(false);
  const [attributes, setAttributes] = useState<{ key: string; value: string }[]>([]);

  // Progress bar
  const ProgressBar = () => (
    <div className="mb-4 mt-10">
      <Progress value={((step + 1) / totalSteps) * 100} className="h-2 mt-3" />
      <div className="flex items-center justify-between mt-6">
        <Button type="button" onClick={prevStep} disabled={step === 0}>Back</Button>
        <div className="flex-1 text-center font-medium text-gray-700 dark:text-gray-200">
          Step {step + 1} of {totalSteps}
        </div>
        {step === totalSteps - 1 ? (
          <Button type="button" onClick={handleSubmit} disabled={processing}>
            {processing ? "Submitting..." : "Submit Listing"}
          </Button>
        ) : (
          <Button type="button" onClick={nextStep}>Next</Button>
        )}
      </div>
    </div>
  );

  // Save draft to localStorage (only if not empty)
  useEffect(() => {
    if (
      ENABLE_DRAFT_STORAGE &&
      ((formData.address && Object.keys(formData.address).length > 0) || formData.category)
    ) {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(formData));
      // Also update backend draft if propertyId exists and not yet published
      if (propertyId && formData.status !== 'active') {
        fetch(`/properties/${propertyId}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-CSRF-TOKEN': getCsrfToken(),
            'X-Requested-With': 'XMLHttpRequest',
          },
          body: JSON.stringify({ ...formData, status: 'draft' }),
        });
      }
    } // Do not clear the draft here if the form is empty; only clear on reset/submit
  }, [formData, propertyId]);

  // Save propertyId to localStorage when set
  useEffect(() => {
    if (propertyId && ENABLE_DRAFT_STORAGE) {
      localStorage.setItem('property-wizard-draft-id', propertyId);
    }
  }, [propertyId]);

  // Clear draft on submit success
  function clearDraft() {
    if (ENABLE_DRAFT_STORAGE) localStorage.removeItem(DRAFT_KEY);
  }

  // Add state for showing the alert dialog and its type
  const [showDraftDialog, setShowDraftDialog] = useState<null | 'backend-fail' | 'local-draft'>(null);

  // On mount, check for saved draft propertyId and fetch draft if present
  useEffect(() => {
    if (ENABLE_DRAFT_STORAGE) {
      const savedId = localStorage.getItem('property-wizard-draft-id');
      if (savedId && !propertyId) {
        fetch(`/properties/${savedId}/edit`, { headers: { 'X-Requested-With': 'XMLHttpRequest' } })
          .then(res => {
            if (!res.ok) throw new Error('Failed to fetch backend draft');
            return res.json();
          })
          .then((data) => {
            // You may need to adjust this depending on your backend's response shape
            // Normalize address fields for Google Maps compatibility
            const normalized = { ...data.property };
            if (normalized.address) {
              normalized.address.latitude = normalized.address.latitude !== undefined ? Number(normalized.address.latitude) : null;
              normalized.address.longitude = normalized.address.longitude !== undefined ? Number(normalized.address.longitude) : null;
              // Some APIs use 'longitude', some 'lng' -- ensure both are set
              if (normalized.address.longitude === null && normalized.address.longitude !== undefined) {
                normalized.address.longitude = Number(normalized.address.longitude);
              }
              if (normalized.address.latitude !== undefined) {
                normalized.address.latitude = normalized.address.latitude;
              }
              normalized.address.formatted_address = normalized.address.formatted_address || '';
            }
            setFormData(normalized);
            setPropertyId(savedId);
            // Restore to correct step based on draft completeness
            // If on refresh, try to restore to the last completed step
            let restoredStep = 0;
            if (normalized.address && normalized.category && normalized.title && normalized.price) {
              restoredStep = 5; // Preview
            } else if (normalized.address && normalized.category && normalized.title) {
              restoredStep = 4; // Media
            } else if (normalized.address && normalized.category) {
              restoredStep = 3; // Features
            } else if (normalized.address) {
              restoredStep = 2; // Details/Structure/Price
            }
            setStep(restoredStep);
          })
          .catch(() => {
            setShowDraftDialog('backend-fail');
          });
      } else if (!savedId) {
        // No backend draft, try to restore from localStorage draft
        const localDraft = localStorage.getItem(DRAFT_KEY);
        if (localDraft) {
          setShowDraftDialog('local-draft');
          try {
            const parsed = JSON.parse(localDraft);
            setFormData(parsed);
            // Optionally, restore to the furthest step completed in the local draft
            let restoredStep = 0;
            if (parsed.address && parsed.category && parsed.title && parsed.price) {
              restoredStep = 5;
            } else if (parsed.address && parsed.category && parsed.title) {
              restoredStep = 4;
            } else if (parsed.address && parsed.category) {
              restoredStep = 3;
            } else if (parsed.address) {
              restoredStep = 2;
            }
            setStep(restoredStep);
          } catch (e) {
            // If parsing fails, clear the draft
            localStorage.removeItem(DRAFT_KEY);
          }
        }
      }
    }
  }, []);

  // Add a reset/clear draft function for the user to start fresh
  function resetWizard() {
    setFormData({ address: {}, category: '' });
    setPropertyId(null);
    setStep(0);
    if (ENABLE_DRAFT_STORAGE) {
      localStorage.removeItem(DRAFT_KEY);
      localStorage.removeItem('property-wizard-draft-id');
    }
  }

  // Handler to resume draft from toast
  function handleResumeDraft() {
    const localDraft = localStorage.getItem(DRAFT_KEY);
    if (localDraft) {
      try {
        const parsed = JSON.parse(localDraft);
        setFormData(parsed);
        // Resume at first incomplete step (same logic as restore)
        let restoredStep = 0;
        if (!parsed.address || Object.keys(parsed.address).length === 0) {
          restoredStep = 0;
        } else if (!parsed.category) {
          restoredStep = 1;
        } else if (!parsed.title) {
          restoredStep = 2;
        } else if (!parsed.features) {
          restoredStep = 3;
        } else if (!parsed.media) {
          restoredStep = 4;
        } else if (!parsed.price) {
          restoredStep = 2;
        } else {
          restoredStep = 5;
        }
        setStep(restoredStep);
      } catch (e) {
        localStorage.removeItem(DRAFT_KEY);
      }
    }
  }

  // Clear draft on unmount or when navigating away
  useEffect(() => {
    return () => {
      if (ENABLE_DRAFT_STORAGE) {
        localStorage.removeItem(DRAFT_KEY);
        localStorage.removeItem('property-wizard-draft-id');
      }
    };
  }, []);

  // Step navigation
  function nextStep() {
    // If moving from Features to Media Upload, ensure propertyId exists
    if (step === 5 && !propertyId) {
      handleDetailsNext();
      return;
    }
    // Prevent advancing to Media Upload, Preview, or Submit without propertyId
    if ((step === 6 || step === 7) && !propertyId) {
      alert('Please complete all steps up to Features to create a draft property before continuing.');
      setStep(5); // Go back to Features
      return;
    }
    setStep(s => Math.min(steps.length - 1, s + 1));
  }
  function prevStep() { setStep(s => Math.max(0, s - 1)); }

  // Step validation (implement per step in each component)
  function validateCurrentStep(): boolean {
    // Each step component should expose a validate method or return errors
    // For now, always true
    return true;
  }

  // Update address/category handlers to update formData
  const handleAddressChange = (val: any) => {
    setFormData((prev: any) => ({ ...prev, address: val }));
  };
  const handleCategoryChange = (val: any) => {
    setFormData((prev: any) => ({ ...prev, category: val }));
  };

  // Create draft property after Details/Structure/Price step
  const handleDetailsNext = async () => {
    setProcessing(true);
    setErrors({});
    try {
      const response = await fetch("/properties", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRF-TOKEN": getCsrfToken(),
          "X-Requested-With": "XMLHttpRequest"
        },
        body: JSON.stringify({ ...formData, status: "draft" })
      });
      if (!response.ok) {
        const errData = await response.json();
        setErrors(errData.errors || {});
        alert(`Error creating draft property: ${JSON.stringify(errData, null, 2)}`);
        return;
      }
      const data = await response.json();
      setPropertyId(data.id);
      setStep(6); // Advance to Media Upload step
    } catch (err: any) {
      alert(err.message || 'Error creating draft property');
    } finally {
      setProcessing(false);
    }
  };

  // Ensure propertyId is set if resuming from draft
  useEffect(() => {
    if (!propertyId && formData && formData.id) {
      setPropertyId(formData.id);
    }
  }, [formData, propertyId]);

  // Update handleSubmit to use the new /properties/{id}/publish endpoint for publishing with validation.
  const handleSubmit = async () => {
    if (!propertyId) return alert('No property ID. Please complete previous steps.');
    setProcessing(true);
    setErrors({});
    try {
      // Prepare submission data
      const submission = {
        ...formData,
        features: Array.isArray(formData.features) ? formData.features : [],
        categories: Array.isArray(formData.categories) ? formData.categories : [],
      };
      // PUT to /properties/{id}/publish for explicit publish
      const response = await fetch(`/properties/${propertyId}/publish`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': getCsrfToken(), // Ensure CSRF token is sent
          'X-Requested-With': 'XMLHttpRequest'
        },
        body: JSON.stringify(submission),
      });
      const contentType = response.headers.get('content-type');
      if (!response.ok) {
        let errData;
        if (contentType && contentType.includes('application/json')) {
          errData = await response.json();
        } else {
          errData = { message: await response.text() };
        }
        setErrors(errData.errors || {});
        alert(`Error publishing property: ${JSON.stringify(errData, null, 2)}`);
        throw new Error('Failed to publish property');
      }
      clearDraft();
      window.location.href = `/properties/${propertyId}`;
    } catch (err: any) {
      alert(err.message || 'Error publishing property');
    } finally {
      setProcessing(false);
    }
  };

  const CurrentStep = steps[step].component;

  // Prepare props for each step
  // Pass propertyId to steps that need it (e.g., media upload, preview, submit)
  const stepProps: any = {
    data: formData,
    setData: (key: string, value: any) => setFormData((d: any) => ({ ...d, [key]: value })),
    errors,
    setErrors,
    processing,
    nextStep,
    prevStep,
    handleSubmit,
    propertyId,
    categoryGroups: props.categoryGroups,
    featureGroups: props.featureGroups,
    propertyTypes: props.propertyTypes,
    listingMethods: props.listingMethods,
    listingStatuses: props.listingStatuses,
    attributes,
    setAttributes,
    handleAddressChange,
    handleCategoryChange,
    ...props,
  };

  // Breadcrumbs using step labels
  const breadcrumbs = [
    { title: 'Dashboard', href: '/dashboard' },
    { title: 'Property', href: '/properties' },
    { title: 'Wizard', href: '/properties/create' },
    { title: steps[step].label, href: '#' },
  ];

  const addressStepIndex = steps.findIndex(s => s.component === WizardStep4Address);

  // Debug JSON viewer for wizard state
  function WizardDebugJson({ data }: { data: any }) {
    return (
      <div className="mt-8 p-4 bg-zinc-100 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-xs overflow-x-auto">
        <div className="font-bold mb-2 text-zinc-700 dark:text-zinc-200">Live Wizard Data</div>
        <pre className="whitespace-pre-wrap break-all text-zinc-800 dark:text-zinc-100">{JSON.stringify(data, null, 2)}</pre>
      </div>
    );
  }

  // Utility to get CSRF token from meta tag
  function getCsrfToken() {
    const meta = document.querySelector('meta[name="csrf-token"]');
    return meta ? meta.getAttribute('content') || '' : '';
  }

  // Handler for backend draft fetch fail dialog actions
  function handleDraftDialogAction(action: 'retry' | 'local' | 'reset') {
    if (action === 'retry') {
      window.location.reload();
    } else if (action === 'local') {
      const localDraft = localStorage.getItem(DRAFT_KEY);
      if (localDraft) {
        try {
          const parsed = JSON.parse(localDraft);
          setFormData(parsed);
          setPropertyId(null);
          setStep(0); // or use your restore logic
        } catch {}
      }
    } else if (action === 'reset') {
      localStorage.removeItem('property-wizard-draft-id');
      localStorage.removeItem(DRAFT_KEY);
      setFormData({ address: {}, category: '' });
      setPropertyId(null);
      setStep(0);
    }
    setShowDraftDialog(null);
  }

  // Show Resume Draft notification if a draft exists in localStorage and no backend draft is present
  useEffect(() => {
    if (ENABLE_DRAFT_STORAGE) {
      const savedId = localStorage.getItem('property-wizard-draft-id');
      const localDraft = localStorage.getItem(DRAFT_KEY);
      if (!savedId && localDraft && !propertyId) {
        setShowDraftDialog('local-draft');
      }
    }
  }, [propertyId]);

  return (
    <AppLayout breadcrumbs={breadcrumbs}>
      <Head title="Property Wizard" />

      <div className="w-full max-w-full px-2 sm:px-4 md:px-8 py-8">
        
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Listings Wizard</h1>
        </div>

        <Tabs value={steps[step].label.toLowerCase().replace(/\s+/g, '-')} className="w-full max-w-full">
          <TabsList className="mb-0 flex gap-2 bg-zinc-100 dark:bg-zinc-800  p-1 w-full">
            {steps.map((s, i) => (
              <TabsTrigger
                key={s.label}
                value={s.label.toLowerCase().replace(/\s+/g, '-')}
                onClick={() => {
                  setStep(i);
                }}
                className={`flex-1 w-full ${step === i ? 'bg-white dark:bg-zinc-900 shadow' : ''}`}
                style={{ minWidth: 0 }}
              >
                {s.label}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* <Progress value={((step + 1) / totalSteps) * 100} className="h-2 pt-0 mt-0" /> */}

          {steps.map((s, i) => (
            <TabsContent
              key={s.label}
              value={s.label.toLowerCase().replace(/\s+/g, '-')}
              className={`w-full bg-white dark:bg-zinc-900 rounded-lg shadow p-6 space-y-8 border border-zinc-200 dark:border-zinc-800 ${step === i ? 'block' : 'hidden'}`}
            >
              {s.label === 'Media Upload' && propertyId ? (
                <PropertiesCreateMedia propertyId={Number(propertyId)} nextStep={nextStep} prevStep={prevStep} />
              ) : s.component === WizardStep4Address
                ? React.createElement(s.component, { ...stepProps, active: step === addressStepIndex })
                : React.createElement(s.component, stepProps)}
              {/* Add debug JSON viewer at the bottom of each step */}
              {/* <WizardDebugJson data={formData} /> */}
            </TabsContent>
          ))}
        </Tabs>
        <ProgressBar />
        {/* <Progress value={((step + 1) / totalSteps) * 100} className="h-2 mt-3" /> */}
        <WizardDebugJson data={formData} />
      </div>
      
      <AlertDialog open={showDraftDialog === 'backend-fail'} onOpenChange={open => !open && setShowDraftDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Could not load your saved draft from the server.</AlertDialogTitle>
            <AlertDialogDescription>
              You can retry, use your local browser draft, or reset the wizard.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => handleDraftDialogAction('retry')}>Retry</AlertDialogAction>
            <AlertDialogAction onClick={() => handleDraftDialogAction('local')}>Use Local Draft</AlertDialogAction>
            <AlertDialogCancel onClick={() => handleDraftDialogAction('reset')}>Reset</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <AlertDialog open={showDraftDialog === 'local-draft'} onOpenChange={open => !open && setShowDraftDialog(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Resume your unsaved draft?</AlertDialogTitle>
            <AlertDialogDescription>
              You have an unsaved draft in your browser. Would you like to resume where you left off, or reset the wizard?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => { handleResumeDraft(); setShowDraftDialog(null); }}>Resume Draft</AlertDialogAction>
            <AlertDialogCancel onClick={() => { resetWizard(); setShowDraftDialog(null); }}>Reset Wizard</AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AppLayout>
  );
}
