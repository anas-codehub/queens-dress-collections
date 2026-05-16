"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import {
  Plus,
  Edit,
  Trash2,
  ToggleLeft,
  ToggleRight,
  X,
  Check,
} from "lucide-react";

type Category = {
  id: string;
  name: string;
  slug: string;
  image: string | null;
  isActive: boolean;
  sortOrder: number;
  _count: { products: number };
};

export default function AdminCategoriesClient({
  categories,
}: {
  categories: Category[];
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [form, setForm] = useState({
    name: "",
    slug: "",
    image: "",
    isActive: true,
    sortOrder: 0,
  });

  function resetForm() {
    setForm({ name: "", slug: "", image: "", isActive: true, sortOrder: 0 });
    setEditingId(null);
    setShowForm(false);
  }

  function startEdit(cat: Category) {
    setForm({
      name: cat.name,
      slug: cat.slug,
      image: cat.image ?? "",
      isActive: cat.isActive,
      sortOrder: cat.sortOrder,
    });
    setEditingId(cat.id);
    setShowForm(true);
  }

  function handleNameChange(name: string) {
    setForm((f) => ({
      ...f,
      name,
      slug: name
        .toLowerCase()
        .replace(/\s+/g, "-")
        .replace(/[^a-z0-9-]/g, ""),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!form.name) {
      toast.error("Category name is required");
      return;
    }
    setLoading(true);
    try {
      const url = editingId
        ? `/api/categories/${editingId}`
        : "/api/categories";
      const method = editingId ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error();
      toast.success(editingId ? "Category updated!" : "Category created!");
      resetForm();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  async function handleDelete(id: string, productCount: number) {
    if (productCount > 0) {
      toast.error(`Cannot delete — ${productCount} products use this category`);
      return;
    }
    if (!confirm("Delete this category?")) return;
    try {
      const res = await fetch(`/api/categories/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error();
      toast.success("Category deleted");
      router.refresh();
    } catch {
      toast.error("Failed to delete");
    }
  }

  async function handleToggle(id: string, current: boolean) {
    try {
      const res = await fetch(`/api/categories/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !current }),
      });
      if (!res.ok) throw new Error();
      toast.success(current ? "Category hidden" : "Category active");
      router.refresh();
    } catch {
      toast.error("Failed to update");
    }
  }

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
      {/* Categories List */}
      <div className="xl:col-span-2">
        <div className="bg-white border border-brand-200">
          {/* Table Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-brand-200">
            <p className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium">
              All Categories ({categories.length})
            </p>
            <button
              onClick={() => {
                resetForm();
                setShowForm(true);
              }}
              className="flex items-center gap-1.5 bg-brand-900 text-brand-100 text-[10px] tracking-[0.12em] uppercase px-4 py-2 hover:bg-brand-800 transition-colors"
            >
              <Plus size={12} strokeWidth={1.5} />
              Add Category
            </button>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-brand-100 bg-brand-50">
                  {[
                    "Name",
                    "Slug",
                    "Products",
                    "Order",
                    "Status",
                    "Actions",
                  ].map((h) => (
                    <th
                      key={h}
                      className="text-left px-4 py-3 text-[10px] text-brand-500 tracking-[0.15em] uppercase font-medium"
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {categories.length === 0 ? (
                  <tr>
                    <td
                      colSpan={6}
                      className="text-center py-12 text-xs text-brand-400 tracking-wide"
                    >
                      No categories yet. Add your first one!
                    </td>
                  </tr>
                ) : (
                  categories.map((cat) => (
                    <tr
                      key={cat.id}
                      className="border-b border-brand-100 hover:bg-brand-50 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <p className="text-xs text-brand-800 font-medium tracking-wide">
                          {cat.name}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-[10px] text-brand-400 tracking-wide">
                          {cat.slug}
                        </p>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-brand-600 tracking-wide">
                          {cat._count.products}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-xs text-brand-600 tracking-wide">
                          {cat.sortOrder}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <button
                          onClick={() => handleToggle(cat.id, cat.isActive)}
                        >
                          {cat.isActive ? (
                            <ToggleRight
                              size={18}
                              strokeWidth={1.5}
                              className="text-green-500"
                            />
                          ) : (
                            <ToggleLeft
                              size={18}
                              strokeWidth={1.5}
                              className="text-brand-400"
                            />
                          )}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => startEdit(cat)}
                            className="p-1.5 text-brand-400 hover:text-brand-900 hover:bg-brand-100 transition-colors"
                          >
                            <Edit size={13} strokeWidth={1.5} />
                          </button>
                          <button
                            onClick={() =>
                              handleDelete(cat.id, cat._count.products)
                            }
                            className="p-1.5 text-brand-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                          >
                            <Trash2 size={13} strokeWidth={1.5} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add / Edit Form */}
      {showForm && (
        <div className="xl:col-span-1">
          <div className="bg-white border border-brand-200 p-6 sticky top-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-[11px] text-brand-700 tracking-[0.15em] uppercase font-medium">
                {editingId ? "Edit Category" : "New Category"}
              </h2>
              <button
                onClick={resetForm}
                className="text-brand-400 hover:text-brand-900 transition-colors"
              >
                <X size={16} strokeWidth={1.5} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                  Name *
                </label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                  placeholder="e.g. Maxi Dresses"
                  required
                />
              </div>

              <div>
                <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                  Slug
                </label>
                <input
                  type="text"
                  value={form.slug}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, slug: e.target.value }))
                  }
                  className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-500 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                  placeholder="auto-generated"
                />
              </div>

              <div>
                <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                  Image URL
                </label>
                <input
                  type="url"
                  value={form.image}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, image: e.target.value }))
                  }
                  className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 placeholder:text-brand-400 outline-none focus:border-brand-700 transition-colors tracking-wide"
                  placeholder="https://..."
                />
              </div>

              <div>
                <label className="block text-[10px] text-brand-600 tracking-[0.15em] uppercase mb-1.5">
                  Sort Order
                </label>
                <input
                  type="number"
                  value={form.sortOrder}
                  onChange={(e) =>
                    setForm((f) => ({
                      ...f,
                      sortOrder: parseInt(e.target.value),
                    }))
                  }
                  className="w-full bg-brand-50 border border-brand-300 px-4 py-3 text-xs text-brand-900 outline-none focus:border-brand-700 transition-colors"
                  min={0}
                />
              </div>

              <label className="flex items-center justify-between cursor-pointer">
                <span className="text-xs text-brand-700 tracking-wide">
                  Active
                </span>
                <div
                  onClick={() =>
                    setForm((f) => ({ ...f, isActive: !f.isActive }))
                  }
                  className={`w-10 h-5 rounded-full transition-colors cursor-pointer flex items-center px-0.5 ${
                    form.isActive ? "bg-brand-900" : "bg-brand-300"
                  }`}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      form.isActive ? "translate-x-5" : "translate-x-0"
                    }`}
                  />
                </div>
              </label>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-900 text-brand-100 text-[11px] tracking-[0.18em] uppercase py-3.5 hover:bg-brand-800 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
              >
                <Check size={13} strokeWidth={2} />
                {loading
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Create Category"}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
