import React from 'react';
import { Button } from '@/components/ui/button';

export default function WizardStep6Features({ data, setData, featureGroups, attributes, setAttributes, errors, nextStep, prevStep }: any) {
  // Ensure features is always an array for controlled input
  const features = Array.isArray(data.features) ? data.features : [];
  // Ensure attributes is always an array for controlled input
  const safeAttributes = Array.isArray(attributes) ? attributes : [];
  return (
    <div>
      <h2 className="text-3xl font-bold pt-4 pb-6 text-gray-900 dark:text-gray-100">Features & Dynamic Attributes</h2> 
      <div className="space-y-2">
        <label className="block text-sm font-medium">Features</label>
        <div className="space-y-4">
          {featureGroups && featureGroups.map((group: any) => (
            <div key={group.id}>
              <div className="font-semibold mb-1">{group.name}</div>
              <div className="grid grid-cols-2 gap-2">
                {group.features.map((f: any) => (
                  <label key={f.id} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      value={f.id}
                      checked={features.includes(f.id)}
                      onChange={e => {
                        if (e.target.checked) {
                          setData('features', [...features, f.id]);
                        } else {
                          setData('features', features.filter((id: string) => id !== f.id));
                        }
                      }}
                      className="accent-blue-600 w-4 h-4 rounded"
                    />
                    <span>{f.name}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      {/* Dynamic Attributes (JSON) */}
      <div className="space-y-2 mt-6">
        <label className="block text-sm font-medium">Dynamic Attributes (JSON)</label>
        <div className="space-y-2">
          {safeAttributes.map((attr: any, idx: number) => (
            <div key={idx} className="flex gap-2 items-center">
              <input type="text" placeholder="Attribute Name" value={attr.key || ''} onChange={e => { const newAttrs = [...safeAttributes]; newAttrs[idx].key = e.target.value; setAttributes(newAttrs); }} className="w-1/2 input input-bordered" />
              <input type="text" placeholder="Value" value={attr.value || ''} onChange={e => { const newAttrs = [...safeAttributes]; newAttrs[idx].value = e.target.value; setAttributes(newAttrs); }} className="w-1/2 input input-bordered" />
              <Button type="button" variant="ghost" onClick={() => setAttributes(safeAttributes.filter((_: any, i: number) => i !== idx))}>Remove</Button>
            </div>
          ))}
          <Button type="button" variant="outline" onClick={() => setAttributes([...safeAttributes, { key: '', value: '' }])}>Add Attribute</Button>
        </div>
        <p className="text-xs text-zinc-500">Add custom key-value pairs for this property. These will be stored as JSON.</p>
      </div>
    </div>
  );
}
