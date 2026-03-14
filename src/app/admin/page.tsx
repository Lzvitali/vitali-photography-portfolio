"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Plus,
  Pencil,
  Trash2,
  Save,
  GripVertical,
  Settings,
  Upload,
  Loader2,
  X,
} from "lucide-react";
import type { PortfolioData, Category, SiteData, CardLayout, CardStyle, FocalPoint } from "@/lib/types";
import { CARD_LAYOUT_OPTIONS, CARD_STYLE_OPTIONS } from "@/lib/types";
import { slugify } from "@/lib/utils";
import FocalPointPicker from "@/components/admin/FocalPointPicker";

export default function AdminDashboard() {
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [site, setSite] = useState<SiteData | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [editingCat, setEditingCat] = useState<Category | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [coverUploading, setCoverUploading] = useState(false);
  const [coverUrlInput, setCoverUrlInput] = useState("");
  const [showCoverFocalPicker, setShowCoverFocalPicker] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    const res = await fetch("/api/data");
    const { portfolio, site } = await res.json();
    setPortfolio(portfolio);
    setSite(site);
  }

  async function saveAll(data?: PortfolioData) {
    setSaving(true);
    try {
      await fetch("/api/save-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ portfolio: data || portfolio, site }),
      });
      setMessage("Saved successfully!");
      setTimeout(() => setMessage(""), 3000);
    } catch {
      setMessage("Save failed!");
    }
    setSaving(false);
  }

  async function addCategory() {
    if (!newCatName.trim() || !portfolio) return;
    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newCatName.trim(),
          slug: slugify(newCatName.trim()),
        }),
      });
      const cat = await res.json();
      const updated = {
        ...portfolio,
        categories: [...portfolio.categories, cat],
      };
      setPortfolio(updated);
      setNewCatName("");
      setShowAddModal(false);
    } catch {
      setMessage("Failed to add category");
    }
  }

  async function deleteCategory(id: string) {
    if (!portfolio) return;
    if (!confirm("Delete this category and all its images?")) return;
    try {
      await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      setPortfolio({
        ...portfolio,
        categories: portfolio.categories.filter((c) => c.id !== id),
        images: portfolio.images.filter((img) => img.categoryId !== id),
      });
    } catch {
      setMessage("Failed to delete");
    }
  }

  async function updateCategory(cat: Category) {
    if (!portfolio) return;
    try {
      await fetch("/api/categories", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(cat),
      });
      setPortfolio({
        ...portfolio,
        categories: portfolio.categories.map((c) =>
          c.id === cat.id ? cat : c
        ),
      });
      setEditingCat(null);
    } catch {
      setMessage("Failed to update");
    }
  }

  if (!portfolio || !site) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse text-neutral-400">Loading admin...</div>
      </div>
    );
  }

  const sortedCategories = [...portfolio.categories].sort(
    (a, b) => a.order - b.order
  );

  return (
    <div className="max-w-5xl mx-auto px-5 md:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Portfolio Admin</h1>
          <p className="text-sm text-neutral-500 mt-1">
            Manage categories and images
          </p>
        </div>
        <div className="flex items-center gap-3">
          {message && (
            <span className="text-sm text-green-600 dark:text-green-400">
              {message}
            </span>
          )}
          <button
            onClick={() => saveAll()}
            disabled={saving}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            <Save size={14} />
            {saving ? "Saving..." : "Save All"}
          </button>
        </div>
      </div>

      {/* Site Settings Quick Access */}
      <div className="mb-8 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800 bg-neutral-50 dark:bg-neutral-900/50">
        <div className="flex items-center gap-2 mb-3">
          <Settings size={16} className="text-neutral-400" />
          <h2 className="text-sm font-medium">Site Settings</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div>
            <label className="text-xs text-neutral-500 block mb-1">Name</label>
            <input
              type="text"
              value={site.name}
              onChange={(e) => setSite({ ...site, name: e.target.value })}
              className="w-full px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-500 block mb-1">
              Tagline
            </label>
            <input
              type="text"
              value={site.tagline}
              onChange={(e) => setSite({ ...site, tagline: e.target.value })}
              className="w-full px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800"
            />
          </div>
          <div className="md:col-span-2">
            <label className="text-xs text-neutral-500 block mb-1">About</label>
            <textarea
              value={site.about}
              onChange={(e) => setSite({ ...site, about: e.target.value })}
              rows={3}
              className="w-full px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800 resize-none"
            />
          </div>
          <div>
            <label className="text-xs text-neutral-500 block mb-1">Card Style</label>
            <select
              value={site.cardStyle || "default"}
              onChange={(e) => setSite({ ...site, cardStyle: e.target.value as CardStyle })}
              className="w-full px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-700 rounded bg-white dark:bg-neutral-800"
            >
              {CARD_STYLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Categories</h2>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-700 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
        >
          <Plus size={14} />
          Add Category
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {sortedCategories.map((cat) => {
          const imageCount = portfolio.images.filter(
            (img) => img.categoryId === cat.id
          ).length;
          const coverImage = portfolio.images.find(
            (img) => img.id === cat.coverImageId
          );
          const displayCoverUrl = cat.coverUrl
            ? cat.coverUrl.replace(
                "/upload/",
                "/upload/c_fill,w_600,h_340,f_auto,q_auto/"
              )
            : coverImage
              ? coverImage.url.replace(
                  "/upload/",
                  "/upload/c_fill,w_600,h_340,f_auto,q_auto/"
                )
              : null;

          return (
            <div
              key={cat.id}
              className="group relative border border-neutral-200 dark:border-neutral-800 rounded-lg overflow-hidden hover:border-neutral-400 dark:hover:border-neutral-600 transition-colors"
            >
              <Link href={`/admin/${cat.slug}`} className="block">
                <div className="aspect-video bg-neutral-100 dark:bg-neutral-800 relative">
                  {displayCoverUrl ? (
                    <img
                      src={displayCoverUrl}
                      alt={cat.name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-neutral-400 text-xs gap-1">
                      <span>No cover image</span>
                      <span className="text-[10px] text-neutral-300 dark:text-neutral-600">
                        Click edit to set one
                      </span>
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <div className="flex items-center gap-2">
                    <GripVertical
                      size={14}
                      className="text-neutral-300 dark:text-neutral-600"
                    />
                    <h3 className="font-medium text-sm">{cat.name}</h3>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 ml-6">
                    {imageCount} photos &middot; /{cat.slug}
                  </p>
                </div>
              </Link>
              <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setEditingCat(cat);
                  }}
                  className="w-7 h-7 rounded bg-white/90 dark:bg-neutral-900/90 flex items-center justify-center hover:bg-white dark:hover:bg-neutral-800 shadow-sm"
                  aria-label="Edit"
                >
                  <Pencil size={12} />
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    deleteCategory(cat.id);
                  }}
                  className="w-7 h-7 rounded bg-white/90 dark:bg-neutral-900/90 flex items-center justify-center hover:bg-red-50 dark:hover:bg-red-900/30 text-red-500 shadow-sm"
                  aria-label="Delete"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 w-full max-w-md mx-4 shadow-xl animate-scaleIn">
            <h3 className="text-lg font-semibold mb-4">Add Category</h3>
            <input
              type="text"
              placeholder="Category name"
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && addCategory()}
              className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent text-sm"
              autoFocus
            />
            <p className="text-xs text-neutral-400 mt-1.5">
              Slug: {slugify(newCatName) || "..."}
            </p>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setNewCatName("");
                }}
                className="px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-700 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={addCategory}
                disabled={!newCatName.trim()}
                className="px-3 py-1.5 text-sm bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md disabled:opacity-50"
              >
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cover Focal Point Picker */}
      {showCoverFocalPicker && editingCat && (() => {
        const coverImg = editingCat.coverUrl
          || portfolio.images.find((img) => img.id === editingCat.coverImageId)?.url
          || "";
        if (!coverImg) return null;
        return (
          <FocalPointPicker
            imageUrl={coverImg}
            initialPoint={editingCat.coverFocalPoint || { x: 50, y: 50 }}
            onSave={(point: FocalPoint) => {
              setEditingCat({ ...editingCat, coverFocalPoint: point });
              setShowCoverFocalPicker(false);
            }}
            onClose={() => setShowCoverFocalPicker(false)}
          />
        );
      })()}

      {/* Edit Modal */}
      {editingCat && (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center animate-fadeIn">
          <div className="bg-white dark:bg-neutral-900 rounded-lg p-6 w-full max-w-md mx-4 shadow-xl animate-scaleIn">
            <h3 className="text-lg font-semibold mb-4">Edit Category</h3>
            <div className="space-y-3">
              <div>
                <label className="text-xs text-neutral-500 block mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={editingCat.name}
                  onChange={(e) =>
                    setEditingCat({ ...editingCat, name: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-500 block mb-1">
                  Slug
                </label>
                <input
                  type="text"
                  value={editingCat.slug}
                  onChange={(e) =>
                    setEditingCat({ ...editingCat, slug: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-500 block mb-1">
                  Order
                </label>
                <input
                  type="number"
                  value={editingCat.order}
                  onChange={(e) =>
                    setEditingCat({
                      ...editingCat,
                      order: parseInt(e.target.value) || 0,
                    })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent text-sm"
                />
              </div>
              <div>
                <label className="text-xs text-neutral-500 block mb-1">
                  Card Layout
                </label>
                <select
                  value={editingCat.cardLayout || "landscape"}
                  onChange={(e) =>
                    setEditingCat({
                      ...editingCat,
                      cardLayout: e.target.value as CardLayout,
                    })
                  }
                  className="w-full px-3 py-2 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent text-sm"
                >
                  {CARD_LAYOUT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-xs text-neutral-500 block mb-1">
                  Cover Image
                </label>

                {editingCat.coverUrl && (
                  <div className="mb-2 relative inline-block">
                    <img
                      src={editingCat.coverUrl.replace(
                        "/upload/",
                        "/upload/c_fill,w_200,h_120,f_auto,q_auto/"
                      )}
                      alt="Custom cover"
                      className="rounded border border-blue-500 ring-2 ring-blue-500/30 h-16 object-cover"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setEditingCat({ ...editingCat, coverUrl: null })
                      }
                      className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-red-500 text-white flex items-center justify-center"
                    >
                      <X size={10} />
                    </button>
                    <span className="block text-[10px] text-blue-500 mt-0.5">
                      Custom cover
                    </span>
                  </div>
                )}

                <label
                  className={`flex items-center justify-center gap-1.5 py-2 border border-dashed border-neutral-300 dark:border-neutral-700 rounded-md text-xs text-neutral-500 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors cursor-pointer ${
                    coverUploading ? "opacity-50 pointer-events-none" : ""
                  }`}
                >
                  {coverUploading ? (
                    <Loader2 size={14} className="animate-spin" />
                  ) : (
                    <Upload size={14} />
                  )}
                  {coverUploading
                    ? "Uploading..."
                    : "Upload custom cover image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    disabled={coverUploading}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setCoverUploading(true);
                      try {
                        const formData = new FormData();
                        formData.append("file", file);
                        const res = await fetch("/api/upload", {
                          method: "POST",
                          body: formData,
                        });
                        const result = await res.json();
                        if (result.error) throw new Error(result.error);
                        setEditingCat({
                          ...editingCat,
                          coverUrl: result.url,
                          coverImageId: null,
                        });
                      } catch (err) {
                        setMessage(
                          err instanceof Error
                            ? err.message
                            : "Upload failed"
                        );
                      }
                      setCoverUploading(false);
                      e.target.value = "";
                    }}
                  />
                </label>

                <div className="flex gap-1.5 mt-2">
                  <input
                    type="text"
                    value={coverUrlInput}
                    onChange={(e) => setCoverUrlInput(e.target.value)}
                    placeholder="Or paste image URL"
                    className="flex-1 px-2.5 py-1.5 border border-neutral-300 dark:border-neutral-700 rounded-md bg-transparent text-xs"
                  />
                  <button
                    type="button"
                    disabled={!coverUrlInput.trim().startsWith("http")}
                    onClick={() => {
                      setEditingCat({
                        ...editingCat,
                        coverUrl: coverUrlInput.trim(),
                        coverImageId: null,
                      });
                      setCoverUrlInput("");
                    }}
                    className="px-2.5 py-1.5 text-xs bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md disabled:opacity-40"
                  >
                    Set
                  </button>
                </div>

                {(() => {
                  const hasCover = editingCat.coverUrl || editingCat.coverImageId;
                  if (!hasCover) return null;
                  const fp = editingCat.coverFocalPoint || { x: 50, y: 50 };
                  return (
                    <button
                      type="button"
                      onClick={() => setShowCoverFocalPicker(true)}
                      className="mt-1.5 text-xs text-blue-500 hover:text-blue-600 flex items-center gap-1"
                    >
                      Focal point: {fp.x}%, {fp.y}%
                      <span className="text-[10px] text-neutral-400">(click to change)</span>
                    </button>
                  );
                })()}

                {(() => {
                  const catImages = portfolio.images.filter(
                    (img) => img.categoryId === editingCat.id
                  );
                  if (catImages.length === 0) return null;
                  return (
                    <>
                      <p className="text-[10px] text-neutral-400 mt-2 mb-1">
                        Or pick from gallery:
                      </p>
                      <div className="grid grid-cols-5 gap-1.5 max-h-32 overflow-y-auto">
                        {catImages.map((img) => {
                          const isSelected =
                            !editingCat.coverUrl &&
                            editingCat.coverImageId === img.id;
                          const thumb = img.url.replace(
                            "/upload/",
                            "/upload/c_fill,w_120,h_120,f_auto,q_auto/"
                          );
                          return (
                            <button
                              key={img.id}
                              type="button"
                              onClick={() =>
                                setEditingCat({
                                  ...editingCat,
                                  coverImageId: img.id,
                                  coverUrl: null,
                                })
                              }
                              className={`aspect-square rounded overflow-hidden border-2 transition-all ${
                                isSelected
                                  ? "border-blue-500 ring-2 ring-blue-500/30"
                                  : "border-transparent hover:border-neutral-300 dark:hover:border-neutral-600"
                              }`}
                            >
                              <img
                                src={thumb}
                                alt=""
                                className="w-full h-full object-cover"
                                loading="lazy"
                              />
                            </button>
                          );
                        })}
                      </div>
                    </>
                  );
                })()}
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-5">
              <button
                onClick={() => setEditingCat(null)}
                className="px-3 py-1.5 text-sm border border-neutral-300 dark:border-neutral-700 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"
              >
                Cancel
              </button>
              <button
                onClick={() => updateCategory(editingCat)}
                className="px-3 py-1.5 text-sm bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 rounded-md"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
