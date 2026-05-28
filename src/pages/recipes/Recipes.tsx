import { useState, useEffect } from "react";
import MainLayout from "@/layouts/MainLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Plus, 
  Minus,
  FlaskConical, 
  Timer, 
  Box, 
  ChevronRight,
  Info,
  Search,
  Settings2,
  Loader2,
  Trash2
} from "lucide-react";
import { 
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
import { ConfirmModal } from "@/components/ui/ConfirmModal";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { coreApi } from "@/lib/api";
import { useToast } from "@/contexts/ToastContext";
import { getApiErrorMessage } from "@/lib/apiError";
import { showToast, TOAST } from "@/lib/toastMessages";

interface IRecipeItem {
  inventoryName: string;
  inventoryId: number;
  quantity: number;
}

interface IRecipe {
  id: number;
  name: string;
  productName: string;
  description: string;
  items: IRecipeItem[];
  estimatedProductTime: number;
}

interface IInventoryItem {
  id: number;
  name: string;
  type: "RAW" | "FINISHED" | "WASTE";
}

export default function Recipes() {
  const { success, error: toastError, warning } = useToast();
  const [recipes, setRecipes] = useState<IRecipe[]>([]);
  const [inventory, setInventory] = useState<IInventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRecipe, setSelectedRecipe] = useState<IRecipe | null>(null);
  
  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isArchiveConfirmOpen, setIsArchiveConfirmOpen] = useState(false);
  const [recipeToArchive, setRecipeToArchive] = useState<number | null>(null);

  // Form states (Create/Edit)
  const [formData, setFormData] = useState({
    name: "",
    productId: "",
    description: "",
    estimatedProductionTime: "",
    items: [] as { inventoryId: string, quantity: string }[]
  });

  const fetchRecipes = async () => {
    try {
      setLoading(true);
      const response = await coreApi.get("/recipes");
      setRecipes(response.data);
      if (response.data.length > 0 && !selectedRecipe) {
        setSelectedRecipe(response.data[0]);
      }
    } catch (error) {
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchInventory = async () => {
    try {
      const response = await coreApi.get("/inventory");
      setInventory(response.data);
    } catch (error) {
      console.error("Error fetching inventory:", error);
    }
  };

  useEffect(() => {
    fetchRecipes();
    fetchInventory();
  }, []);

  const handleCreateRecipe = async () => {
    const cycleTime = parseInt(formData.estimatedProductionTime);
    if (!formData.name || !formData.productId || isNaN(cycleTime) || cycleTime <= 0 || formData.items.length === 0) {
      showToast(warning, TOAST.recipes.createMissing);
      return;
    }

    if (formData.items.some(item => !item.inventoryId || parseFloat(item.quantity) <= 0)) {
      showToast(warning, TOAST.recipes.ingredientsInvalid);
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name,
        description: formData.description,
        productId: parseInt(formData.productId),
        estimatedProductionTime: cycleTime,
        items: formData.items.map(item => ({
          inventoryId: parseInt(item.inventoryId),
          quantity: parseFloat(item.quantity)
        }))
      };

      await coreApi.post("/recipes", payload);
      showToast(success, TOAST.recipes.created);
      setIsCreateOpen(false);
      resetForm();
      fetchRecipes();
    } catch (error: any) {
      console.error("Error creating recipe:", error);
      toastError(TOAST.recipes.createFailed.title, getApiErrorMessage(error, TOAST.common.requestFailed.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateRecipe = async () => {
    if (!selectedRecipe) return;
    
    const cycleTime = parseInt(formData.estimatedProductionTime);
    if (cycleTime <= 0 || formData.items.some(item => parseFloat(item.quantity) <= 0)) {
      showToast(warning, TOAST.recipes.updateInvalid);
      return;
    }
    
    try {
      setSubmitting(true);
      const payload = {
        name: formData.name,
        description: formData.description,
        productId: parseInt(formData.productId),
        estimatedProductionTime: cycleTime,
        items: formData.items.map(item => ({
          inventoryId: parseInt(item.inventoryId),
          quantity: parseFloat(item.quantity)
        }))
      };

      const response = await coreApi.put(`/recipes/${selectedRecipe.id}`, payload);
      setSelectedRecipe(response.data);
      showToast(success, TOAST.recipes.updated);
      setIsEditOpen(false);
      fetchRecipes();
    } catch (error: any) {
      console.error("Error updating recipe:", error);
      toastError(TOAST.recipes.updateFailed.title, getApiErrorMessage(error, TOAST.common.requestFailed.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDisableRecipe = async (id: number) => {
    try {
      await coreApi.patch(`/recipes/${id}`);
      showToast(warning, TOAST.recipes.archived);
      fetchRecipes();
    } catch (error: any) {
      console.error("Error disabling recipe:", error);
      toastError(TOAST.recipes.archiveFailed.title, getApiErrorMessage(error, TOAST.common.requestFailed.message));
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      productId: "",
      description: "",
      estimatedProductionTime: "",
      items: []
    });
  };

  const addItemToForm = () => {
    setFormData(prev => ({
      ...prev,
      items: [...prev.items, { inventoryId: "", quantity: "" }]
    }));
  };

  const removeItemFromForm = (index: number) => {
    setFormData(prev => ({
      ...prev,
      items: prev.items.filter((_, i) => i !== index)
    }));
  };

  const updateItemInForm = (index: number, field: "inventoryId" | "quantity", value: string) => {
    setFormData(prev => {
      const newItems = [...prev.items];
      newItems[index] = { ...newItems[index], [field]: value };
      return { ...prev, items: newItems };
    });
  };

  const filteredRecipes = recipes.filter(r => 
    r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.productName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const finishedProducts = inventory.filter(i => i.type === "FINISHED");
  const rawMaterials = inventory.filter(i => i.type === "RAW");

  return (
    <MainLayout>
      <div className="px-8 pb-12 space-y-6 pt-4 min-h-screen">
        
        {/* HEADER */}
        <div className="flex items-end justify-between border-l-[6px] border-red-600 pl-5 mb-8">
          <div className="flex flex-col text-left">
            <span className="text-[10px] font-black text-red-500 uppercase tracking-[0.4em] mb-1 drop-shadow-[0_0_8px_rgba(220,38,38,0.5)]">
              Production Intel
            </span>
            <div className="flex items-baseline gap-2">
              <h1 className="text-4xl font-black text-white tracking-tighter leading-none drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                RECIPES
              </h1>
              <span className="text-4xl font-black text-red-600 tracking-tighter uppercase leading-none drop-shadow-[0_4px_14px_rgba(220,38,38,0.4)]">
                & FORMULAS
              </span>
            </div>
          </div>

          {/* MODAL: NEW RECIPE */}
          <Dialog open={isCreateOpen} onOpenChange={(open) => {
            setIsCreateOpen(open);
            if (open) resetForm();
          }}>
            <DialogTrigger asChild>
              <Button className="bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest gap-2 py-6 px-6 shadow-[0_0_20px_rgba(220,38,38,0.3)] border border-red-500/50 transition-all hover:scale-105">
                <Plus size={18} strokeWidth={3} /> New Recipe
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl border-t-4 border-red-600 bg-black/95 backdrop-blur-xl border-white/10 shadow-[0_0_50px_rgba(220,38,38,0.2)] overflow-y-auto max-h-[90vh]">
              <DialogHeader>
                <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic text-white flex items-center gap-2">
                  <Plus className="text-red-500" /> Create Production Formula
                </DialogTitle>
                <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Register NEW manufacturing process specs
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid grid-cols-2 gap-8 py-6 font-mono">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">Formula Name</label>
                    <Input 
                      placeholder="E.g. GEAR_ASSEMBLY_B" 
                      className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-red-600 focus:border-red-600 transition-colors"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">Final Product</label>
                    <Select value={formData.productId} onValueChange={(val) => setFormData({...formData, productId: val})}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-[11px] font-bold h-11 focus:ring-red-600">
                        <SelectValue placeholder="Select Finished Product..." />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-white/10">
                        {finishedProducts.map(item => (
                          <SelectItem key={item.id} value={item.id.toString()}>{item.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">Cycle Time (min)</label>
                    <div className="flex items-center gap-1">
                      <Button 
                        type="button"
                        variant="outline" 
                        size="icon" 
                        className="h-12 w-12 bg-white/5 border-white/10 hover:bg-red-500/20 text-slate-400 group shrink-0"
                        onClick={() => {
                          const val = parseInt(formData.estimatedProductionTime) || 0;
                          if (val > 1) setFormData({...formData, estimatedProductionTime: (val - 1).toString()});
                        }}
                      >
                        <Minus size={16} className="group-hover:text-red-500" />
                      </Button>
                      <Input 
                        type="number" 
                        min="1"
                        placeholder="60" 
                        className="bg-white/5 border-white/10 text-white text-center font-black placeholder:text-slate-600 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-24 h-12 text-lg focus-visible:ring-1 focus-visible:ring-red-600 focus:border-red-600 transition-colors"
                        value={formData.estimatedProductionTime}
                        onChange={(e) => setFormData({...formData, estimatedProductionTime: e.target.value})}
                      />
                      <Button 
                        type="button"
                        variant="outline" 
                        size="icon" 
                        className="h-12 w-12 bg-white/5 border-white/10 hover:bg-red-500/20 text-slate-400 group shrink-0"
                        onClick={() => {
                          const val = parseInt(formData.estimatedProductionTime) || 0;
                          setFormData({...formData, estimatedProductionTime: (val + 1).toString()});
                        }}
                      >
                        <Plus size={16} className="group-hover:text-red-500" />
                      </Button>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">Specs Description</label>
                    <Textarea 
                      className="w-full bg-white/5 border-white/10 rounded-md p-3 text-sm text-slate-300 focus:outline-none focus:ring-1 focus-visible:ring-red-600 focus:border-red-600 transition-colors placeholder:text-slate-600 min-h-[100px]"
                      placeholder="Enter manufacturing details..."
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                    />
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black text-red-500 uppercase tracking-widest ml-1">Raw Materials</label>
                    <Button onClick={addItemToForm} variant="outline" size="sm" className="h-7 text-[9px] font-black uppercase border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-[0_0_10px_rgba(220,38,38,0.3)]">
                      Add Item
                    </Button>
                  </div>
                  
                  <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                    {formData.items.map((item, index) => (
                      <div key={index} className="flex flex-col gap-3 bg-white/[0.03] hover:bg-white/[0.05] transition-colors p-3 rounded-lg border border-white/5 relative">
                        <div className="w-full space-y-1">
                          <label className="text-[8px] font-bold text-slate-500 uppercase ml-1 block truncate">Material Selection</label>
                          <Select value={item.inventoryId} onValueChange={(val) => updateItemInForm(index, "inventoryId", val)}>
                            <SelectTrigger className="bg-black/30 border-white/10 text-[10px] h-9 focus:ring-1 focus:ring-red-600 focus:border-red-600 transition-colors w-full">
                              <SelectValue placeholder="Select..." />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-white/10">
                              {rawMaterials.map(m => (
                                <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="flex gap-2 items-end w-full">
                          <div className="space-y-1 flex-1">
                            <label className="text-[8px] font-bold text-slate-500 uppercase ml-1 text-center block">Quantity</label>
                            <div className="flex items-center bg-black/50 border border-white/10 rounded-md p-0.5 h-9 w-full justify-between">
                              <button 
                                type="button"
                                className="h-full w-8 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded overflow-hidden transition-colors shrink-0"
                                onClick={() => {
                                  const val = parseFloat(item.quantity) || 0;
                                  if (val > 0.01) updateItemInForm(index, "quantity", (Math.max(0, val - 0.1)).toFixed(2));
                                }}
                              >
                                <Minus size={12} strokeWidth={3} />
                              </button>
                              <input 
                                type="number" 
                                min="0.01" step="0.01" placeholder="0.0"
                                className="bg-transparent border-none text-[11px] font-black text-center text-red-500 outline-none w-full min-w-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                value={item.quantity}
                                onChange={(e) => updateItemInForm(index, "quantity", e.target.value)}
                              />
                              <button 
                                type="button"
                                className="h-full w-8 flex items-center justify-center text-slate-500 hover:text-red-500 hover:bg-red-500/10 rounded overflow-hidden transition-colors shrink-0"
                                onClick={() => {
                                  const val = parseFloat(item.quantity) || 0;
                                  updateItemInForm(index, "quantity", (val + 0.1).toFixed(2));
                                }}
                              >
                                <Plus size={12} strokeWidth={3} />
                              </button>
                            </div>
                          </div>
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            className="h-9 w-9 shrink-0 text-slate-600 hover:text-red-500 hover:bg-red-500/10"
                            onClick={() => removeItemFromForm(index)}
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </div>
                    ))}
                    {formData.items.length === 0 && (
                      <div className="text-center py-8 border border-dashed border-white/10 rounded-lg">
                        <p className="text-[10px] font-bold text-slate-600 uppercase italic">No materials assigned</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <DialogFooter className="border-t border-white/10 pt-6">
                <Button variant="ghost" onClick={() => setIsCreateOpen(false)} className="text-slate-400 hover:text-white hover:bg-white/5 uppercase font-black tracking-widest text-[10px]">Cancel</Button>
                <Button 
                  className="bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-widest px-8 shadow-lg shadow-red-900/40"
                  onClick={handleCreateRecipe}
                  disabled={submitting}
                >
                  {submitting && <Loader2 className="animate-spin mr-2" size={14} />}
                  Transmit Data
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LISTA DE RECEITAS (ESQUERDA) */}
          <div className="lg:col-span-4 space-y-4">
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <Input 
                placeholder="SEARCH FORMULAS..." 
                className="bg-white/[0.02] border-white/10 pl-10 h-12 font-black text-[10px] uppercase tracking-widest focus:border-red-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="space-y-3 max-h-[70vh] overflow-y-auto pr-2 custom-scrollbar">
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20 gap-4 opacity-50">
                  <Loader2 className="animate-spin text-red-500" size={32} />
                  <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Decoding Formula Blocks...</span>
                </div>
              ) : filteredRecipes.map((recipe) => (
                <div 
                  key={recipe.id}
                  onClick={() => setSelectedRecipe(recipe)}
                  className={`
                    p-4 rounded-xl border transition-all duration-300 cursor-pointer group
                    ${selectedRecipe?.id === recipe.id 
                      ? "bg-red-950/20 border-red-500/50 shadow-[0_0_15px_rgba(220,38,38,0.15)]" 
                      : "bg-white/[0.02] border-white/5 hover:border-white/20 hover:bg-white/[0.04]"}
                  `}
                >
                  <div className="flex justify-between items-start mb-2">
                    <h3 className={`font-black text-sm uppercase tracking-tight transition-colors ${selectedRecipe?.id === recipe.id ? "text-white" : "text-slate-300"}`}>
                      {recipe.name}
                    </h3>
                    <ChevronRight size={16} className={`transition-all ${selectedRecipe?.id === recipe.id ? "text-red-500 translate-x-1" : "text-slate-600 opacity-0 group-hover:opacity-100"}`} />
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant="outline" className="text-[8px] font-black uppercase text-slate-500 border-white/10 group-hover:border-white/20">
                      ID: #{recipe.id}
                    </Badge>
                    <span className="text-[10px] font-bold text-slate-500 truncate italic">{recipe.productName}</span>
                  </div>
                </div>
              ))}
              {!loading && filteredRecipes.length === 0 && (
                <div className="text-center py-20 opacity-30 italic">
                  <p className="text-xs uppercase font-black tracking-widest">No formulas matching criteria</p>
                </div>
              )}
            </div>
          </div>

          {/* DETALHE DA RECEITA (DIREITA) */}
          <div className="lg:col-span-8">
            {selectedRecipe ? (
              <Card className="p-8 min-h-[75vh] relative overflow-hidden border-white/10 bg-transparent/40 backdrop-blur-md">
                {/* Overlay Decal */}
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] select-none text-red-500">
                  <FlaskConical size={200} />
                </div>

                <div className="relative z-10 space-y-8">
                  {/* Header do Detalhe */}
                  <div className="flex justify-between items-start border-b border-white/10 pb-6">
                    <div>
                      <span className="text-[10px] font-black text-red-500 uppercase tracking-widest mb-2 block">Formula Specification</span>
                      <h2 className="text-3xl font-black text-white italic tracking-tighter uppercase">{selectedRecipe.name}</h2>
                      <p className="text-slate-400 text-sm mt-1 font-medium">{selectedRecipe.productName}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <div className="flex items-center gap-2 text-slate-300 font-black">
                        <Timer size={18} className="text-red-500" />
                        <span className="text-2xl tracking-tighter">{selectedRecipe.estimatedProductTime}m</span>
                      </div>
                      <span className="text-[9px] font-black text-slate-500 uppercase tracking-widest">Est. Cycle Time</span>
                    </div>
                  </div>

                  {/* Descrição */}
                  <div className="bg-white/[0.03] p-5 rounded-xl border border-white/5">
                    <div className="flex items-center gap-2 mb-3">
                      <Info size={14} className="text-blue-500" />
                      <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Description & Usage</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed font-medium">
                      {selectedRecipe.description}
                    </p>
                  </div>

                  {/* Ingredientes / Itens */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Settings2 size={16} className="text-red-500" />
                        <h3 className="text-sm font-black text-white uppercase tracking-widest">Required Components</h3>
                      </div>
                      <Badge className="bg-blue-950/20 text-blue-500 border-blue-900/50 text-[10px] font-black uppercase">
                        {selectedRecipe.items?.length || 0} Insumos
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {selectedRecipe.items?.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-4 bg-[#0a0a0a] border border-white/5 rounded-xl group/item hover:border-red-500/30 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover/item:bg-red-500/10 transition-colors">
                              <Box size={18} className="text-slate-500 group-hover/item:text-red-500" />
                            </div>
                            <div>
                              <p className="text-xs font-black text-white uppercase tracking-tight">{item.inventoryName}</p>
                              <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">ID: #{item.inventoryId}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <span className="text-lg font-mono font-black text-red-500 drop-shadow-[0_0_8px_rgba(220,38,38,0.4)]">
                              {item.quantity}
                            </span>
                            <span className="text-[9px] font-black text-slate-500 uppercase ml-1">units</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Ações de Gestão */}
                  <div className="pt-8 border-t border-white/10 flex gap-4">
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setRecipeToArchive(selectedRecipe.id);
                        setIsArchiveConfirmOpen(true);
                      }}
                      className="flex-1 bg-red-950/10 border-red-500/20 hover:bg-red-500/10 text-red-500 font-black uppercase text-[10px] tracking-widest py-6"
                    >
                      Archive Formula
                    </Button>
                    
                    {/* MODAL: EDIT RECIPE */}
                    <Dialog open={isEditOpen} onOpenChange={(open) => {
                      setIsEditOpen(open);
                      if (open && selectedRecipe) {
                        const matchingProduct = inventory.find(i => i.name === selectedRecipe.productName);
                        setFormData({
                          name: selectedRecipe.name,
                          description: selectedRecipe.description,
                          estimatedProductionTime: selectedRecipe.estimatedProductTime.toString(),
                          productId: matchingProduct ? matchingProduct.id.toString() : "",
                          items: selectedRecipe.items.map(item => ({
                            inventoryId: item.inventoryId.toString(),
                            quantity: item.quantity.toString()
                          }))
                        });
                      }
                    }}>
                      <DialogTrigger asChild>
                        <Button variant="outline" className="flex-1 bg-white/[0.02] border-white/10 hover:bg-white/[0.05] text-slate-300 font-black uppercase text-[10px] tracking-widest py-6">
                          Sync Formula
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl border-t-4 border-blue-600 bg-black/95 backdrop-blur-xl border-white/10 shadow-[0_0_50px_rgba(37,99,235,0.2)]">
                        <DialogHeader>
                          <DialogTitle className="text-2xl font-black tracking-tighter uppercase italic text-white flex items-center gap-2">
                            <Settings2 className="text-blue-600" /> Re-Configure Formula
                          </DialogTitle>
                          <DialogDescription className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none">
                            Modify existing parameters for <span className="text-blue-500 underline underline-offset-2 tracking-tighter">{selectedRecipe.name}</span>
                          </DialogDescription>
                        </DialogHeader>
                        
                        <div className="grid grid-cols-2 gap-8 py-6 font-mono">
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Update Internal Name</label>
                              <Input 
                                value={formData.name} 
                                className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus-visible:ring-1 focus-visible:ring-blue-600 focus:border-blue-600 transition-colors" 
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Adjust Cycle Time (min)</label>
                              <div className="flex items-center gap-1">
                                <Button 
                                  type="button"
                                  variant="outline" 
                                  size="icon" 
                                  className="h-12 w-12 bg-white/5 border-white/10 hover:bg-blue-500/20 text-slate-400 group shrink-0"
                                  onClick={() => {
                                    const val = parseInt(formData.estimatedProductionTime) || 0;
                                    if (val > 1) setFormData({...formData, estimatedProductionTime: (val - 1).toString()});
                                  }}
                                >
                                  <Minus size={16} className="group-hover:text-blue-500" />
                                </Button>
                                <Input 
                                  type="number" 
                                  min="1"
                                  value={formData.estimatedProductionTime} 
                                  className="bg-white/5 border-white/10 text-white text-center font-black [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none w-24 h-12 text-lg focus-visible:ring-1 focus-visible:ring-blue-600 focus:border-blue-600 transition-colors" 
                                  onChange={(e) => setFormData({...formData, estimatedProductionTime: e.target.value})}
                                />
                                <Button 
                                  type="button"
                                  variant="outline" 
                                  size="icon" 
                                  className="h-12 w-12 bg-white/5 border-white/10 hover:bg-blue-500/20 text-slate-400 group shrink-0"
                                  onClick={() => {
                                    const val = parseInt(formData.estimatedProductionTime) || 0;
                                    setFormData({...formData, estimatedProductionTime: (val + 1).toString()});
                                  }}
                                >
                                  <Plus size={16} className="group-hover:text-blue-500" />
                                </Button>
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Revised Description</label>
                              <Textarea 
                                className="w-full bg-white/5 border-white/10 rounded-md p-3 text-xs text-slate-400 focus:outline-none focus:ring-1 focus-visible:ring-blue-600 focus:border-blue-600 transition-colors placeholder:text-slate-600 min-h-[100px]"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                              />
                            </div>
                          </div>
                          
                          <div className="space-y-4">
                            <div className="flex items-center justify-between">
                              <label className="text-[10px] font-black text-blue-500 uppercase tracking-widest ml-1">Component Mix</label>
                              <Button onClick={addItemToForm} variant="outline" size="sm" className="h-7 text-[9px] font-black uppercase border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white transition-all shadow-[0_0_10px_rgba(37,99,235,0.3)]">
                                Add Item
                              </Button>
                            </div>
                            
                            <div className="space-y-3 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                              {formData.items.map((item, index) => (
                                <div key={index} className="flex flex-col gap-3 bg-white/[0.03] hover:bg-white/[0.05] transition-colors p-3 rounded-lg border border-white/5 relative">
                                  <div className="w-full space-y-1">
                                    <label className="text-[8px] font-bold text-slate-500 uppercase ml-1 block truncate">Material Selection</label>
                                    <Select value={item.inventoryId} onValueChange={(val) => updateItemInForm(index, "inventoryId", val)}>
                                      <SelectTrigger className="bg-black/30 border-white/10 text-[10px] h-9 focus:ring-1 focus:ring-blue-600 focus:border-blue-600 transition-colors w-full">
                                        <SelectValue placeholder="Select..." />
                                      </SelectTrigger>
                                      <SelectContent className="bg-slate-900 border-white/10">
                                        {rawMaterials.map(m => (
                                          <SelectItem key={m.id} value={m.id.toString()}>{m.name}</SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                  </div>
                                  <div className="flex gap-2 items-end w-full">
                                    <div className="space-y-1 flex-1">
                                      <label className="text-[8px] font-bold text-slate-500 uppercase ml-1 text-center block">Quantity</label>
                                      <div className="flex items-center bg-black/50 border border-white/10 rounded-md p-0.5 h-9 w-full justify-between">
                                        <button 
                                          type="button"
                                          className="h-full w-8 flex items-center justify-center text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded overflow-hidden transition-colors shrink-0"
                                          onClick={() => {
                                            const val = parseFloat(item.quantity) || 0;
                                            if (val > 0.01) updateItemInForm(index, "quantity", (Math.max(0, val - 0.1)).toFixed(2));
                                          }}
                                        >
                                          <Minus size={12} strokeWidth={3} />
                                        </button>
                                        <input 
                                          type="number" 
                                          min="0.01" step="0.01" placeholder="0.0"
                                          className="bg-transparent border-none text-[11px] font-black text-center text-blue-500 outline-none w-full min-w-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                          value={item.quantity}
                                          onChange={(e) => updateItemInForm(index, "quantity", e.target.value)}
                                        />
                                        <button 
                                          type="button"
                                          className="h-full w-8 flex items-center justify-center text-slate-500 hover:text-blue-500 hover:bg-blue-500/10 rounded overflow-hidden transition-colors shrink-0"
                                          onClick={() => {
                                            const val = parseFloat(item.quantity) || 0;
                                            updateItemInForm(index, "quantity", (val + 0.1).toFixed(2));
                                          }}
                                        >
                                          <Plus size={12} strokeWidth={3} />
                                        </button>
                                      </div>
                                    </div>
                                    <Button 
                                      variant="ghost" 
                                      size="icon" 
                                      className="h-9 w-9 shrink-0 text-slate-600 hover:text-red-500 hover:bg-red-500/10"
                                      onClick={() => removeItemFromForm(index)}
                                    >
                                      <Trash2 size={16} />
                                    </Button>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        <DialogFooter className="border-t border-white/10 pt-6">
                          <Button variant="ghost" onClick={() => setIsEditOpen(false)} className="text-slate-500 hover:text-white hover:bg-white/5 uppercase font-black tracking-widest text-[10px]">Abort Changes</Button>
                          <Button 
                            className="bg-blue-600 hover:bg-blue-500 text-white font-black uppercase tracking-widest px-8"
                            onClick={handleUpdateRecipe}
                            disabled={submitting}
                          >
                            {submitting && <Loader2 className="animate-spin mr-2" size={14} />}
                            Sync Formula
                          </Button>
                        </DialogFooter>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </Card>
            ) : (
              <div className="flex items-center justify-center min-h-[75vh] border-2 border-dashed border-white/5 rounded-2xl">
                <p className="text-slate-600 uppercase font-black tracking-[0.3em] italic">No active frequency sector selected</p>
              </div>
            )}
          </div>

        </div>
        
        <ConfirmModal
          isOpen={isArchiveConfirmOpen}
          onClose={() => setIsArchiveConfirmOpen(false)}
          onConfirm={() => {
            if (recipeToArchive) handleDisableRecipe(recipeToArchive);
            setIsArchiveConfirmOpen(false);
          }}
          title="Archive Formula"
          description={`Are you sure you want to de-list this recipe from active production? This action requires authorization.`}
          variant="danger"
          requirePassword={true}
          confirmLabel="Authorize Archival"
          loading={loading}
        />
      </div>
    </MainLayout>
  );
}
