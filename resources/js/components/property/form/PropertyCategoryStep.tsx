import React from 'react';
import { Button } from '@/components/ui/button';

export default function PropertyCategoryStep({ data, setData, categoryGroups, selectedTopLevelCategory: propSelectedTopLevelCategory, setSelectedTopLevelCategory: propSetSelectedTopLevelCategory, errors, nextStep, prevStep }: any) {
  // Provide local state fallback if not passed from parent
  const [localSelectedTopLevelCategory, localSetSelectedTopLevelCategory] = React.useState<any>(null);
  const selectedTopLevelCategory = propSelectedTopLevelCategory ?? localSelectedTopLevelCategory;
  const setSelectedTopLevelCategory = propSetSelectedTopLevelCategory ?? localSetSelectedTopLevelCategory;

  const mainCategoryGroup = Array.isArray(categoryGroups) && categoryGroups.length > 0 ? categoryGroups[0] : null;
  const topLevelCategories = mainCategoryGroup && mainCategoryGroup.categories ? mainCategoryGroup.categories : [];
  const selectedCategoryObj = topLevelCategories.find((cat: any) => cat.id === selectedTopLevelCategory);
  const childCategories = selectedCategoryObj?.children || [];

  return (
    <div>
      <h2 className="text-lg font-bold mb-2">Category</h2>
      <div className="space-y-2">
        <div className="font-semibold mb-1">Step 1: Select a top-level category</div>
        <div className="flex flex-wrap gap-4">
          {topLevelCategories.map((cat: any) => (
            <label key={cat.id} className="flex items-center gap-2">
              <input
                type="radio"
                name="topLevelCategory"
                value={cat.id}
                checked={selectedTopLevelCategory === cat.id}
                onChange={() => {
                  setSelectedTopLevelCategory(cat.id);
                  setData('categories', []);
                }}
                className="accent-blue-600 w-4 h-4 rounded"
              />
              {cat.name}
            </label>
          ))}
        </div>
      </div>
      {selectedTopLevelCategory && childCategories.length > 0 && (
        <div className="mt-4">
          <div className="font-semibold mb-1">Step 2: Select subcategories</div>
          <div className="flex flex-wrap gap-4">
            {childCategories.map((child: any) => (
              <label key={child.id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="childCategory"
                  value={child.id}
                  checked={data.categories.includes(child.id)}
                  onChange={e => {
                    if (e.target.checked) {
                      setData('categories', [...data.categories, child.id]);
                    } else {
                      setData('categories', data.categories.filter((id: string) => id !== child.id));
                    }
                  }}
                  className="accent-blue-600 w-4 h-4 rounded"
                />
                {child.name}
              </label>
            ))}
          </div>
        </div>
      )}
      {selectedTopLevelCategory && childCategories.length === 0 && (
        <div className="mt-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="categoryFinal"
              value={selectedTopLevelCategory}
              checked={data.categories[0] === selectedTopLevelCategory}
              onChange={() => setData('categories', [selectedTopLevelCategory])}
              className="accent-blue-600 w-4 h-4 rounded"
            />
            <span>Use {selectedCategoryObj?.name}</span>
          </label>
        </div>
      )}
      <div className="flex justify-between mt-6">
        <Button type="button" onClick={prevStep}>Back</Button>
        <Button type="button" onClick={nextStep}>Next</Button>
      </div>
    </div>
  );
}
