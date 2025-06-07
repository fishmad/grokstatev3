import React from 'react';
import { Home, Building2, Warehouse, Tractor, Landmark, Mountain, TentTree } from "lucide-react";

export default function WizardStep1Category({ data, setData, categoryGroups, selectedTopLevelCategory: propSelectedTopLevelCategory, setSelectedTopLevelCategory: propSetSelectedTopLevelCategory, errors, nextStep, prevStep }: any) {
  // Provide local state fallback if not passed from parent
  const [localSelectedTopLevelCategory, localSetSelectedTopLevelCategory] = React.useState<any>(null);
  const selectedTopLevelCategory = propSelectedTopLevelCategory ?? localSelectedTopLevelCategory;
  const setSelectedTopLevelCategory = propSetSelectedTopLevelCategory ?? localSetSelectedTopLevelCategory;

  const mainCategoryGroup = Array.isArray(categoryGroups) && categoryGroups.length > 0 ? categoryGroups[0] : null;
  const topLevelCategories = mainCategoryGroup && mainCategoryGroup.categories ? mainCategoryGroup.categories : [];
  const selectedCategoryObj = topLevelCategories.find((cat: any) => cat.id === selectedTopLevelCategory);
  const childCategories = selectedCategoryObj?.children || [];

  // Auto-select top-level category if a child category is already selected
  React.useEffect(() => {
    if (!selectedTopLevelCategory && Array.isArray(data.categories) && data.categories.length > 0) {
      // Find which top-level category owns the first selected child
      for (const topCat of topLevelCategories) {
        if (topCat.children && topCat.children.some((child: any) => data.categories.includes(child.id))) {
          setSelectedTopLevelCategory(topCat.id);
          break;
        }
      }
    }
  }, [selectedTopLevelCategory, data.categories, topLevelCategories, setSelectedTopLevelCategory]);

  return (
    <div>

      {/* <div className="flex justify-between mt-0">
        <Button type="button" onClick={prevStep}>Back</Button>
        <Button type="button" onClick={nextStep}>Next</Button>
      </div> */}

      <h2 className="text-3xl font-bold pt-4 pb-2 text-gray-900 dark:text-gray-100">Category Choice</h2>

      <div className="space-y-2">
        <div className="font-semibold mb-5">Step 1: Select a top-level category</div>
        <div className="flex flex-wrap gap-4">
          {topLevelCategories.map((cat: any) => {
            // Map category name to icon
            let Icon = Home;
            if (cat.name === 'Commercial') Icon = Building2;
            else if (cat.name === 'Land') Icon = Mountain;
            else if (cat.name === 'Rural') Icon = Warehouse;
            else if (cat.name === 'Business') Icon = Landmark;
            else if (cat.name === 'Holiday') Icon = TentTree;
            // You can swap icons as desired
            return (
              <label
                key={cat.id}
                className={`cursor-pointer flex flex-col items-center justify-center w-36 h-36 rounded-xl border-2 transition text-center select-none shadow-sm
                  ${selectedTopLevelCategory === cat.id
                    ? 'border-orange-600 bg-blue-50 shadow-lg'
                    : 'border-zinc-300 bg-white hover:border-orange-600 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:border-white'}
                `}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') setSelectedTopLevelCategory(cat.id);
                }}
              >
                <input
                  type="radio"
                  name="topLevelCategory"
                  value={cat.id}
                  checked={selectedTopLevelCategory === cat.id}
                  onChange={() => {
                    setSelectedTopLevelCategory(cat.id);
                    setData('categories', []);
                  }}
                  className="sr-only"
                />
                <span className="mb-2 text-4xl text-orange-600">
                  <Icon size={48} />
                </span>
                <span className={`font-semibold text-lg ${selectedTopLevelCategory === cat.id ? 'text-zinc-900 dark:text-black' : 'text-zinc-900 dark:text-zinc-100'}`}>{cat.name}</span>
              </label>
            );
          })}
        </div>
      </div>
      {selectedTopLevelCategory && childCategories.length > 0 && (
        <div className="mt-4">
          <div className="font-semibold mb-1">Step 2: Select subcategories</div>
          <div className="flex flex-wrap gap-3">
            {childCategories.map((child: any) => (
              <label
                key={child.id}
                className={`cursor-pointer flex flex-col items-center justify-center w-28 h-28 rounded-lg border-2 transition text-center select-none shadow-sm
                  ${data.categories.includes(child.id)
                    ? 'border-orange-600 bg-blue-50 shadow-lg'
                    : 'border-zinc-300 bg-white hover:border-orange-600 dark:bg-zinc-900 dark:border-zinc-700 dark:hover:border-white'}
                `}
                tabIndex={0}
                onKeyDown={e => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    if (!data.categories.includes(child.id)) {
                      setData('categories', [...data.categories, child.id]);
                    } else {
                      setData('categories', data.categories.filter((id: string) => id !== child.id));
                    }
                  }
                }}
              >
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
                  className="sr-only"
                />
                <span className={`font-semibold text-base ${data.categories.includes(child.id) ? 'text-zinc-900 dark:text-white' : 'text-zinc-900 dark:text-zinc-100'}`}>{child.name}</span>
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
    </div>
  );
}
