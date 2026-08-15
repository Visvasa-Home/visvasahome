import React from 'react';
import * as Dialog from '@radix-ui/react-dialog';
import { X } from 'lucide-react';

export interface Subcategory {
  name: string;
  slug: string;
  icon: React.ElementType;
  timeEstimate?: string;
  isNew?: boolean;
}

export interface CategoryGroup {
  title: string;
  items: Subcategory[];
}

export interface SubcategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  groups: CategoryGroup[];
  onSelectSubcategory: (slug: string) => void;
}

export function SubcategoryModal({ isOpen, onClose, title, groups, onSelectSubcategory }: SubcategoryModalProps) {
  return (
    <Dialog.Root open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] transition-opacity" />
        <Dialog.Content className="fixed left-[50%] top-[50%] max-h-[85vh] w-[90vw] max-w-[600px] translate-x-[-50%] translate-y-[-50%] rounded-[20px] bg-white p-6 shadow-2xl focus:outline-none z-[100] overflow-y-auto">
          
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-2xl font-black text-gray-900 m-0">
              {title}
            </Dialog.Title>
            <Dialog.Close className="rounded-full p-1.5 hover:bg-gray-100 transition-colors bg-gray-50 text-gray-700">
              <X className="h-5 w-5" />
            </Dialog.Close>
          </div>

          <div className="space-y-8">
            {groups.map((group, gIndex) => (
              <div key={gIndex}>
                <h3 className="text-base font-bold text-gray-800 mb-4">{group.title}</h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                  {group.items.map((sub, sIndex) => {
                    const Icon = sub.icon;
                    return (
                      <button
                        key={sIndex}
                        onClick={() => {
                          onSelectSubcategory(sub.slug);
                          onClose();
                        }}
                        className="flex flex-col items-center p-3 rounded-2xl hover:bg-gray-50 border border-transparent hover:border-gray-200 transition-all group"
                      >
                        <div className="bg-[#f5f5f5] w-16 h-16 rounded-xl flex flex-col items-center justify-center mb-2 relative group-hover:scale-105 transition-transform">
                          <Icon className="w-8 h-8 text-gray-700 stroke-[1.5]" />
                          {sub.timeEstimate && (
                            <div className="absolute -bottom-2 bg-white px-2 py-0.5 rounded-full border border-gray-200 text-[9px] font-bold text-blue-600 shadow-sm whitespace-nowrap">
                              {sub.timeEstimate}
                            </div>
                          )}
                          {sub.isNew && (
                            <div className="absolute -top-2 right-[-10px] bg-blue-500 text-white px-1.5 py-0.5 rounded text-[8px] font-black uppercase shadow-sm">
                              NEW
                            </div>
                          )}
                        </div>
                        <span className="text-xs font-semibold text-gray-800 text-center leading-tight">
                          {sub.name}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
