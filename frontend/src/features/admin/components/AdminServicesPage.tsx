import { useState, useMemo } from 'react';
import { ArrowLeft, Plus, Edit, Trash, Package, Search, Filter, X, Check, DollarSign } from 'lucide-react';
import { Button } from '@shared/ui/button';
import { Card } from '@shared/ui/card';
import { Badge } from '@shared/ui/badge';
import { Input } from '@shared/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@shared/ui/select';

interface AdminServicesPageProps {
  onBack: () => void;
}

const DEFAULT_CATEGORIES = [
  { name: 'Plumbing', slug: 'plumbing-services', emoji: '🚰', commissionRate: 15 },
  { name: 'Electrical', slug: 'electrical-services', emoji: '⚡', commissionRate: 15 },
  { name: 'AC Service & Repair', slug: 'ac-services', emoji: '❄️', commissionRate: 15 },
  { name: 'Home Cleaning', slug: 'cleaning-services', emoji: '🧹', commissionRate: 12 },
  { name: 'Pest Control', slug: 'pest-control', emoji: '🐜', commissionRate: 15 },
  { name: 'Painting', slug: 'painting-services', emoji: '🎨', commissionRate: 18 },
  { name: 'Carpentry', slug: 'carpentry-services', emoji: '🪚', commissionRate: 15 },
  { name: 'Appliance Repair', slug: 'appliance-repair', emoji: '🔌', commissionRate: 15 },
  { name: 'Renovations & Masonry', slug: 'renovations', emoji: '🧱', commissionRate: 20 }
];

import { allServices, saveServicesToStorage, ServiceItem } from '@catalog/data/servicesData';

export function AdminServicesPage({ onBack }: AdminServicesPageProps) {
  const [catalogList, setCatalogList] = useState<ServiceItem[]>(() => allServices);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'services' | 'categories'>('services');

  // Categories Database State (persistent in localStorage)
  const [categoriesList, setCategoriesList] = useState<Array<{ name: string; slug: string; emoji: string; commissionRate: number }>>(() => {
    const saved = localStorage.getItem('visvasahome_service_categories');
    return saved ? JSON.parse(saved) : DEFAULT_CATEGORIES;
  });

  // Category Form State
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any | null>(null);
  const [catName, setCatName] = useState('');
  const [catEmoji, setCatEmoji] = useState('🛠️');
  const [catCommission, setCatCommission] = useState(15);

  // Service Form states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);
  const [formName, setFormName] = useState('');
  const [formCategory, setFormCategory] = useState(categoriesList[0]?.name || 'Plumbing');
  const [formSubcategory, setFormSubcategory] = useState('General');
  const [formDescription, setFormDescription] = useState('');
  const [formPrice, setFormPrice] = useState('299');
  const [formDuration, setFormDuration] = useState('45 min');
  const [formWarranty, setFormWarranty] = useState('30 days');
  const [formPopular, setFormPopular] = useState(false);
  const [formPricingModel, setFormPricingModel] = useState<'fixed' | 'hourly' | 'quote'>('fixed');

  // Filtered services list
  const filteredServices = useMemo(() => {
    let list = catalogList;
    if (selectedCategory !== 'All') {
      list = list.filter(s => s.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(s =>
        s.name.toLowerCase().includes(q) ||
        s.id.toLowerCase().includes(q) ||
        s.subcategory.toLowerCase().includes(q)
      );
    }
    return list;
  }, [catalogList, searchQuery, selectedCategory]);

  const visibleServices = useMemo(() => {
    return filteredServices.slice(0, 100);
  }, [filteredServices]);

  // Service CRUD handlers
  const openAddModal = () => {
    setEditingService(null);
    setFormName('');
    setFormCategory(categoriesList[0]?.name || 'Plumbing');
    setFormSubcategory('General');
    setFormDescription('');
    setFormPrice('299');
    setFormDuration('45 min');
    setFormWarranty('30 days');
    setFormPopular(false);
    setFormPricingModel('fixed');
    setIsModalOpen(true);
  };

  const openEditModal = (service: ServiceItem) => {
    setEditingService(service);
    setFormName(service.name);
    setFormCategory(service.category);
    setFormSubcategory(service.subcategory);
    setFormDescription(service.description || '');
    setFormPrice(service.price.toString());
    setFormDuration(service.duration);
    setFormWarranty(service.warranty);
    setFormPopular(service.popular);
    setFormPricingModel((service as any).pricingModel || 'fixed');
    setIsModalOpen(true);
  };

  const handleSaveService = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) return;

    const matchedCat = categoriesList.find(c => c.name === formCategory) || categoriesList[0];
    const priceNum = parseInt(formPrice) || 299;

    let updatedList: ServiceItem[];

    if (editingService) {
      updatedList = catalogList.map(s => {
        if (s.id === editingService.id) {
          return {
            ...s,
            name: formName,
            category: formCategory,
            subcategory: formSubcategory,
            description: formDescription,
            price: priceNum,
            duration: formDuration,
            warranty: formWarranty,
            popular: formPopular,
            pricingModel: formPricingModel,
            slug: matchedCat.slug,
            emoji: matchedCat.emoji
          } as ServiceItem;
        }
        return s;
      });
    } else {
      const newId = `${matchedCat.slug.replace('-services', '').replace('-repair', '')}_custom_${Date.now()}`;
      const newService: ServiceItem = {
        id: newId,
        name: formName,
        category: formCategory,
        subcategory: formSubcategory,
        description: formDescription,
        price: priceNum,
        duration: formDuration,
        warranty: formWarranty,
        popular: formPopular,
        slug: matchedCat.slug,
        emoji: matchedCat.emoji,
        rating: 4.8,
        reviews: 12
      };
      (newService as any).pricingModel = formPricingModel;
      updatedList = [newService, ...catalogList];
    }

    saveServicesToStorage(updatedList);
    setCatalogList(updatedList);
    setIsModalOpen(false);
  };

  const handleDeleteService = (id: string) => {
    if (confirm('Are you sure you want to delete this service?')) {
      const updatedList = catalogList.filter(s => s.id !== id);
      saveServicesToStorage(updatedList);
      setCatalogList(updatedList);
    }
  };

  // Category CRUD Handlers
  const handleOpenAddCategory = () => {
    setEditingCategory(null);
    setCatName('');
    setCatEmoji('🛠️');
    setCatCommission(15);
    setIsCategoryModalOpen(true);
  };

  const handleOpenEditCategory = (category: any) => {
    setEditingCategory(category);
    setCatName(category.name);
    setCatEmoji(category.emoji);
    setCatCommission(category.commissionRate || 15);
    setIsCategoryModalOpen(true);
  };

  const handleSaveCategory = (e: React.FormEvent) => {
    e.preventDefault();
    if (!catName.trim()) return;

    let updatedCats: any[];
    const slug = catName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '') + '-services';

    if (editingCategory) {
      updatedCats = categoriesList.map(c =>
        c.name === editingCategory.name ? { ...c, name: catName, emoji: catEmoji, commissionRate: catCommission } : c
      );
    } else {
      updatedCats = [...categoriesList, { name: catName, slug, emoji: catEmoji, commissionRate: catCommission }];
    }

    localStorage.setItem('visvasahome_service_categories', JSON.stringify(updatedCats));
    setCategoriesList(updatedCats);
    setIsCategoryModalOpen(false);
  };

  const handleDeleteCategory = (name: string) => {
    if (confirm(`Are you sure you want to delete category "${name}"? This will not delete services under it, but they will be uncategorized.`)) {
      const updated = categoriesList.filter(c => c.name !== name);
      localStorage.setItem('visvasahome_service_categories', JSON.stringify(updated));
      setCategoriesList(updated);
    }
  };

  const getPricingModelBadge = (model?: 'fixed' | 'hourly' | 'quote') => {
    switch (model) {
      case 'hourly':
        return <Badge className="bg-amber-50 text-amber-700 border-amber-200">Hourly Rate</Badge>;
      case 'quote':
        return <Badge className="bg-purple-50 text-purple-700 border-purple-200">Custom Quote</Badge>;
      case 'fixed':
      default:
        return <Badge className="bg-blue-50 text-blue-700 border-blue-250">Fixed Rate</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex-1">
      {/* Header bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 sticky top-0 z-10">
        <div className="flex items-center gap-4 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
            <p className="text-sm text-gray-500">Configure catalog services, set pricing models, and manage dynamic categories</p>
          </div>
          <Button
            onClick={activeTab === 'services' ? openAddModal : handleOpenAddCategory}
            className="bg-[#2563EB] hover:bg-blue-700 text-white flex items-center gap-1.5 shadow-sm"
          >
            <Plus className="w-4 h-4" /> {activeTab === 'services' ? 'Add Service' : 'Add Category'}
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 border-b border-gray-200 mb-4">
          <button
            onClick={() => setActiveTab('services')}
            className={`pb-2.5 font-semibold text-sm transition-all ${
              activeTab === 'services' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Catalog Services
          </button>
          <button
            onClick={() => setActiveTab('categories')}
            className={`pb-2.5 font-semibold text-sm transition-all ${
              activeTab === 'categories' ? 'border-b-2 border-blue-600 text-blue-600' : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            Service Categories
          </button>
        </div>

        {activeTab === 'services' && (
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search catalog services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48 bg-white">
                <Filter className="w-4 h-4 mr-2 text-gray-400" />
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All">All Categories</SelectItem>
                {categoriesList.map(cat => (
                  <SelectItem key={cat.slug} value={cat.name}>{cat.name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="p-6">
        {activeTab === 'services' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleServices.map(service => (
              <Card key={service.id} className="p-5 border border-gray-200 bg-white hover:shadow-md transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <span className="text-xl mb-1 block">{service.emoji}</span>
                    <h3 className="font-bold text-gray-900 text-base leading-tight mb-1">{service.name}</h3>
                    <p className="text-[10px] text-gray-400">ID: {service.id}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-extrabold text-[#2563EB]">
                      {(service as any).pricingModel === 'quote' ? 'Quote Base' : `₹${service.price}`}
                    </p>
                    <p className="text-[10px] text-gray-500 mt-0.5">{service.duration}</p>
                  </div>
                </div>

                <p className="text-xs text-gray-650 mb-3 min-h-[36px] line-clamp-2">{service.description}</p>

                <div className="flex flex-wrap gap-1.5 mb-4">
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 text-[10px]">
                    Cat: {service.category}
                  </Badge>
                  <Badge variant="outline" className="bg-gray-50 text-gray-700 text-[10px]">
                    Subcat: {service.subcategory}
                  </Badge>
                  {getPricingModelBadge((service as any).pricingModel)}
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 pt-3">
                  <span className="text-[10px] text-gray-400">Warranty: <strong>{service.warranty}</strong></span>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => openEditModal(service)} className="h-8 text-xs px-2.5">
                      <Edit className="w-3.5 h-3.5 mr-1" /> Edit
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => handleDeleteService(service.id)} className="h-8 text-xs bg-red-650 hover:bg-red-700 text-white px-2.5">
                      <Trash className="w-3.5 h-3.5 mr-1" /> Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        ) : (
          /* Categories editor list */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {categoriesList.map(cat => (
              <Card key={cat.slug} className="p-4 border border-gray-200 bg-white flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-3xl p-2 bg-gray-50 rounded-xl border border-gray-100">{cat.emoji}</span>
                  <div>
                    <h3 className="font-bold text-gray-900 text-base">{cat.name}</h3>
                    <p className="text-[10px] text-gray-400">Slug: {cat.slug}</p>
                    <Badge className="bg-blue-50 text-blue-700 border-blue-200 mt-1 text-[10px] py-0">
                       platform cut: {cat.commissionRate}%
                    </Badge>
                  </div>
                </div>
                <div className="flex gap-1">
                  <Button size="sm" variant="outline" onClick={() => handleOpenEditCategory(cat)} className="h-8 w-8 p-0">
                    <Edit className="w-3.5 h-3.5" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteCategory(cat.name)} className="h-8 w-8 p-0 text-red-600 hover:bg-red-50 border-red-200">
                    <Trash className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Service Add/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-lg p-6 bg-white shadow-2xl relative border border-gray-200 rounded-2xl">
            <button onClick={() => setIsModalOpen(false)} className="absolute right-4 top-4 p-1 rounded-lg hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <h3 className="text-xl font-bold text-gray-900 mb-4">{editingService ? 'Edit Catalog Service' : 'Add New Service'}</h3>
            <form onSubmit={handleSaveService} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Service Name</label>
                  <Input type="text" value={formName} onChange={e => setFormName(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Pricing Model</label>
                  <select
                    value={formPricingModel}
                    onChange={e => setFormPricingModel(e.target.value as any)}
                    className="w-full text-sm border border-gray-200 rounded-lg p-2.5 bg-white outline-none"
                  >
                    <option value="fixed">Fixed Rate Card</option>
                    <option value="hourly">Hourly Billing Rate</option>
                    <option value="quote">Custom Quote Inspection</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Category</label>
                  <select
                    value={formCategory}
                    onChange={e => setFormCategory(e.target.value)}
                    className="w-full text-sm border border-gray-200 rounded-lg p-2.5 bg-white outline-none"
                  >
                    {categoriesList.map(cat => (
                      <option key={cat.slug} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Subcategory</label>
                  <Input type="text" value={formSubcategory} onChange={e => setFormSubcategory(e.target.value)} required />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Service Description</label>
                <textarea
                  value={formDescription}
                  onChange={e => setFormDescription(e.target.value)}
                  rows={2}
                  className="w-full text-sm border border-gray-200 rounded-lg p-2 outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Base Price (₹)</label>
                  <Input
                    type="number"
                    value={formPrice}
                    onChange={e => setFormPrice(e.target.value)}
                    disabled={formPricingModel === 'quote'}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Service Duration</label>
                  <Input type="text" value={formDuration} onChange={e => setFormDuration(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Warranty Term</label>
                  <Input type="text" value={formWarranty} onChange={e => setFormWarranty(e.target.value)} required />
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="formPopular"
                  checked={formPopular}
                  onChange={e => setFormPopular(e.target.checked)}
                  className="h-4 w-4 text-blue-600 accent-blue-600"
                />
                <label htmlFor="formPopular" className="text-xs font-semibold text-gray-700">Display as popular trending badge</label>
              </div>

              <Button type="submit" className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold">
                Save Catalog Item
              </Button>
            </form>
          </Card>
        </div>
      )}

      {/* Category Add/Edit Modal */}
      {isCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-sm p-6 bg-white shadow-2xl relative border border-gray-200 rounded-2xl">
            <button onClick={() => setIsCategoryModalOpen(false)} className="absolute right-4 top-4 p-1 rounded-lg hover:bg-gray-100">
              <X className="w-5 h-5 text-gray-500" />
            </button>
            <h3 className="text-lg font-bold text-gray-900 mb-4">{editingCategory ? 'Edit Category' : 'Add New Category'}</h3>
            <form onSubmit={handleSaveCategory} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 mb-1">Category Name</label>
                <Input type="text" value={catName} onChange={e => setCatName(e.target.value)} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Emoji / Icon Badge</label>
                  <Input type="text" value={catEmoji} onChange={e => setCatEmoji(e.target.value)} required />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 mb-1">Commission Rate (%)</label>
                  <Input type="number" min="5" max="30" value={catCommission} onChange={e => setCatCommission(Number(e.target.value))} required />
                </div>
              </div>
              <Button type="submit" className="w-full bg-[#2563EB] hover:bg-blue-700 text-white font-semibold">
                Save Category
              </Button>
            </form>
          </Card>
        </div>
      )}
    </div>
  );
}
