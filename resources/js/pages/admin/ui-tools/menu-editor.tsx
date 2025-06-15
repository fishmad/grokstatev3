import { useEffect, useState, createElement } from 'react';
import { AdminSidebar } from '@/components/admin/admin-sidebar';
import { AdminSidebarHeader } from '@/components/admin/admin-sidebar-header';
import { AdminContent } from '@/components/admin/admin-content';
import { AdminShell } from '@/components/admin/admin-shell';
import { Head } from '@inertiajs/react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { GripVertical } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import * as LucideIcons from 'lucide-react';

// Menu item type
// Backend expects: title, href, icon

type MenuItem = {
  id: string;
  title: string;
  icon?: string;
  href: string;
  type?: 'normal' | 'divider' | 'section' | 'space';
  is_hidden?: boolean; // NEW
};

// Use form state with backend field names
// Add a new field to MenuForm for the separator flag
type MenuForm = {
  title: string;
  href: string;
  icon: string;
  is_nav?: boolean;
  is_divider?: boolean;
  is_section?: boolean;
  is_space?: boolean;
  is_hidden?: boolean; // NEW
};

export default function MenuEditor() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editing, setEditing] = useState<MenuItem | null>(null);
  const [form, setForm] = useState<MenuForm>({ title: '', icon: '', href: '', is_nav: true });
  const [saving, setSaving] = useState(false);

  // Fetch menu items
  useEffect(() => {
    setLoading(true);
    fetch('/api/admin/menu')
      .then(r => r.json())
      .then(data => {
        setMenu(data);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load menu.');
        setLoading(false);
      });
  }, []);

  // Handle input changes
  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, type, checked, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: type === 'checkbox' ? checked : value,
      // If ticking a box, clear other flags and fields as needed
      ...(name === 'is_divider' && checked ? { is_section: false, is_space: false, title: '', href: '', icon: '' } : {}),
      ...(name === 'is_section' && checked ? { is_divider: false, is_space: false, href: '', icon: '' } : {}),
      ...(name === 'is_space' && checked ? { is_divider: false, is_section: false, title: '', href: '', icon: '' } : {}),
    }));
  }

  // Add or update menu item
  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      let payload: any;
      if (form.is_divider) {
        payload = { type: 'divider', is_hidden: form.is_hidden };
      } else if (form.is_section) {
        payload = { type: 'section', title: form.title, is_hidden: form.is_hidden };
      } else if (form.is_space) {
        payload = { type: 'space', is_hidden: form.is_hidden };
      } else if (form.is_nav) {
        payload = { ...form, type: 'normal', is_hidden: form.is_hidden };
      } else {
        payload = { ...form };
      }
      const isEdit = editing && editing.id;
      const method = isEdit ? 'PUT' : 'POST';
      const url = isEdit ? `/api/admin/menu/${editing.id}` : '/api/admin/menu';
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error('Failed to save');
      const data = await res.json();
      if (isEdit) {
        // Use the returned item (with id) to update the menu
        setMenu(menu.map(m => (m.id === editing.id ? data.item : m)));
      } else {
        setMenu([...menu, data]);
      }
      setEditing(null);
      setForm({ title: '', icon: '', href: '', is_nav: true, is_divider: false, is_section: false, is_space: false });
      setSaving(false);
    } catch {
      setError('Failed to save menu item.');
      setSaving(false);
    }
  }

  // Edit menu item
  function handleEdit(item: MenuItem) {
    setEditing(item);
    setForm({
      title: item.title || '',
      icon: item.icon || '',
      href: item.href || '',
      is_nav: !item.type || item.type === 'normal',
      is_divider: item.type === 'divider',
      is_section: item.type === 'section',
      is_space: item.type === 'space',
      is_hidden: !!item.is_hidden, // NEW
    });
  }

  // Delete menu item
  async function handleDelete(id: string) {
    if (!confirm('Delete this menu item?')) return;
    try {
      const res = await fetch(`/api/admin/menu/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete');
      setMenu(menu.filter(m => m.id !== id));
    } catch {
      setError('Failed to delete menu item.');
    }
  }

  // Move menu item up/down
  async function handleMove(index: number, dir: -1 | 1) {
    const newMenu = [...menu];
    const target = index + dir;
    if (target < 0 || target >= menu.length) return;
    [newMenu[index], newMenu[target]] = [newMenu[target], newMenu[index]];
    setMenu(newMenu);
    try {
      await fetch('/api/admin/menu/reorder', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ order: newMenu.map(m => m.id) }),
      });
    } catch {
      setError('Failed to reorder menu.');
    }
  }

  // Handle drag end
  function handleDragEnd(result: DropResult) {
    if (!result.destination) return;
    const from = result.source.index;
    const to = result.destination.index;
    if (from === to) return;
    const newMenu = Array.from(menu);
    const [moved] = newMenu.splice(from, 1);
    newMenu.splice(to, 0, moved);
    setMenu(newMenu);
    // Persist order
    fetch('/api/admin/menu/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ order: newMenu.map(m => m.id) }),
    }).catch(() => setError('Failed to reorder menu.'));
  }

  // Cancel editing
  function handleCancel() {
    setEditing(null);
    setForm({ title: '', icon: '', href: '', is_nav: true, is_hidden: false });
  }

  return (







    <AdminShell variant="sidebar">
      <AdminSidebar />
      <AdminContent variant="sidebar">
        <AdminSidebarHeader breadcrumbs={[
          { title: 'Admin', href: '/admin' },
          { title: 'Menu Editor', href: '/admin/menu-editor' },
        ]} />
        <Head title="Admin Menu Editor" />
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Admin Menu Editor</h1>
            <div className="flex gap-4 items-center">
              {/* Pink square legend for hidden items */}
              <div className="flex items-center gap-1 text-xs">
                <span className="inline-block w-4 h-4 rounded-sm bg-pink-100 border border-pink-400 mr-1" aria-label="Hidden menu item color key"></span>
                <span className="text-gray-500">Hidden (not shown in sidebar)</span>
              </div>
              <Button 
                onClick={() => setEditing({ id: '', title: '', icon: '', href: '', type: 'normal' })}
                type="button"
              >
                Add Menu Item
              </Button>
            </div>
          </div>
          {error && <div className="text-red-600 mb-2">{error}</div>}
          {loading ? (
            <div>Loading...</div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="min-w-full w-full table-fixed divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="w-12 min-w-[48px]">Drag</th>
                      <th className="px-4 py-2 text-left w-auto whitespace-nowrap">Label</th>
                      <th className="px-4 py-2 text-left w-auto whitespace-nowrap">Link</th>
                      <th className="px-4 py-2 text-left w-auto whitespace-nowrap">Icon</th>
                    </tr>
                  </thead>
                  <DragDropContext onDragEnd={handleDragEnd}>
                    <Droppable droppableId="menu-table-body" direction="vertical">
                      {(provided) => (
                        <tbody ref={provided.innerRef} {...provided.droppableProps}>
                          {menu.length === 0 && (
                            <tr>
                              <td className="text-center py-4 text-gray-500" colSpan={4}>No menu items found.</td>
                            </tr>
                          )}
                          {menu.map((item, i) => (
                            <Draggable key={item.id} draggableId={item.id} index={i}>
                              {(draggableProvided, snapshot) => {
                                const onRowClick = (e: React.MouseEvent) => {
                                  if ((e.target as HTMLElement).closest('.drag-handle')) return;
                                  handleEdit(item);
                                };
                                // Determine if hidden
                                const isHidden = !!item.is_hidden;
                                // Helper to apply bg-pink-100 to all tds if hidden
                                const tdClass = isHidden ? 'bg-pink-100' : '';
                                if (item.type === 'divider') {
                                  return (
                                    <tr ref={draggableProvided.innerRef} {...draggableProvided.draggableProps} className={`border-b hover:bg-blue-50 group`} style={{ background: snapshot.isDragging ? '#e0e7ef' : undefined, ...draggableProvided.draggableProps.style }}>
                                      <td className={`w-12 min-w-[48px] px-2 align-middle ${tdClass}`}>
                                        <span
                                          className="drag-handle cursor-grab text-gray-400 hover:text-gray-700 flex items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                          style={{ minWidth: 36, minHeight: 36, touchAction: 'none' }}
                                          tabIndex={0}
                                          {...draggableProvided.dragHandleProps}
                                          title="Drag to reorder"
                                          aria-label="Drag to reorder"
                                        >
                                          <GripVertical size={24} />
                                        </span>
                                      </td>
                                      <td colSpan={3} className={`py-2 ${tdClass}`} onClick={onRowClick} style={{ cursor: 'pointer', height: '44px', paddingTop: 0, paddingBottom: 0 }}>
                                        <div className="flex items-center min-h-[44px]">
                                          <hr className="border-t border-gray-300 w-full" style={{ marginLeft: 15, marginRight: 0 }} />
                                        </div>
                                      </td>
                                    </tr>
                                  );
                                }
                                if (item.type === 'space') {
                                  return (
                                    <tr ref={draggableProvided.innerRef} {...draggableProvided.draggableProps} className={`border-b hover:bg-blue-50 group`} style={{ background: snapshot.isDragging ? '#e0e7ef' : undefined, ...draggableProvided.draggableProps.style }}>
                                      <td className={`w-12 min-w-[48px] px-2 align-middle ${tdClass}`}>
                                        <span
                                          className="drag-handle cursor-grab text-gray-400 hover:text-gray-700 flex items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                          style={{ minWidth: 36, minHeight: 36, touchAction: 'none' }}
                                          tabIndex={0}
                                          {...draggableProvided.dragHandleProps}
                                          title="Drag to reorder"
                                          aria-label="Drag to reorder"
                                        >
                                          <GripVertical size={24} />
                                        </span>
                                      </td>
                                      <td colSpan={3} className={`py-2 ${tdClass}`} onClick={onRowClick} style={{ cursor: 'pointer', height: '44px', paddingTop: 0, paddingBottom: 0 }}>
                                        <div className="min-h-[44px]" />
                                      </td>
                                    </tr>
                                  );
                                }
                                if (item.type === 'section') {
                                  return (
                                    <tr ref={draggableProvided.innerRef} {...draggableProvided.draggableProps} className={`hover:bg-blue-50 group`} style={{ background: snapshot.isDragging ? '#e0e7ef' : undefined, ...draggableProvided.draggableProps.style }}>
                                      <td className={`w-12 min-w-[48px] px-2 align-middle ${tdClass}`}>
                                        <span
                                          className="drag-handle cursor-grab text-gray-400 hover:text-gray-700 flex items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                          style={{ minWidth: 36, minHeight: 36, touchAction: 'none' }}
                                          tabIndex={0}
                                          {...draggableProvided.dragHandleProps}
                                          title="Drag to reorder"
                                          aria-label="Drag to reorder"
                                        >
                                          <GripVertical size={24} />
                                        </span>
                                      </td>
                                      <td colSpan={3} className={`pl-4 py-2 font-bold text-gray-700 g-gray-50 uppercase tracking-wider ${tdClass}`} onClick={onRowClick} style={{ cursor: 'pointer' }}>{item.title}</td>
                                    </tr>
                                  );
                                }
                                return (
                                  <tr ref={draggableProvided.innerRef} {...draggableProvided.draggableProps} className={`border-b hover:bg-blue-50 group`} style={{ background: snapshot.isDragging ? '#e0e7ef' : undefined, ...draggableProvided.draggableProps.style }}>
                                    <td className={`w-12 min-w-[48px] px-2 align-middle ${tdClass}`}>
                                      <span
                                        className="drag-handle cursor-grab text-gray-400 hover:text-gray-700 flex items-center justify-center rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                                        style={{ minWidth: 36, minHeight: 36, touchAction: 'none' }}
                                        tabIndex={0}
                                        {...draggableProvided.dragHandleProps}
                                        title="Drag to reorder"
                                        aria-label="Drag to reorder"
                                      >
                                        <GripVertical size={24} />
                                      </span>
                                    </td>
                                    <td className={`px-4 py-2 font-medium truncate max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-2xl ${tdClass}`} onClick={onRowClick} style={{ cursor: 'pointer' }}>{item.title}</td>
                                    <td className={`px-4 py-2 text-xs text-gray-500 break-all w-full md:w-1/3 min-w-[120px] ${tdClass}`} onClick={onRowClick} style={{ cursor: 'pointer' }}>{item.href}</td>
                                    <td className={`px-4 py-2 w-16 h-8 ${tdClass}`} onClick={onRowClick} style={{ cursor: 'pointer' }}>
                                      <span className="text-gray-500 shrink-0">
                                        {(() => {
                                          const iconName = item.icon;
                                          const Icon = iconName && LucideIcons[iconName as keyof typeof LucideIcons];
                                          if (
                                            Icon &&
                                            typeof Icon === 'object' &&
                                            '$$typeof' in Icon
                                          ) {
                                            // @ts-expect-error: Icon is a dynamically imported Lucide React component
                                            return <Icon width={20} height={20} className="align-middle" />;
                                          }
                                          return <span className="text-gray-400">—</span>;
                                        })()}
                                      </span>
                                    </td>
                                  </tr>
                                );
                              }}
                            </Draggable>
                          ))}
                          {provided.placeholder}
                        </tbody>
                      )}
                    </Droppable>
                  </DragDropContext>
                </table>
              </div>
              <Sheet open={!!editing} onOpenChange={open => { if (!open) handleCancel(); }}>
                <SheetContent side="right" className="max-w-md w-full z-50 p-6" aria-describedby="menu-editor-description">
                  <span id="menu-editor-description" className="sr-only">
                    Use this form to add or edit admin menu items. Fill in the label, link, and icon as needed. Select the type of menu item using the checkboxes below.
                  </span>
                  <SheetHeader>
                    <SheetTitle>
                      {editing?.type === 'divider'
                        ? (editing && editing.id ? 'Edit Divider' : 'Add Divider')
                        : (editing && editing.id ? 'Edit Menu Item' : 'Add Menu Item')}
                    </SheetTitle>
                  </SheetHeader>
                  <form onSubmit={handleSave} className="flex flex-col gap-4 mt-6">
                    <div>
                      <label className="block text-sm font-medium">Label</label>
                      <Input
                        name="title"
                        value={form.title}
                        onChange={handleChange}
                        required={form.is_section || form.is_nav}
                        disabled={form.is_divider || form.is_space}
                        placeholder={form.is_section ? 'Section Header Title' : form.is_space ? 'Space (no label)' : 'Menu Item Label'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Link</label>
                      <Input
                        name="href"
                        value={form.href}
                        onChange={handleChange}
                        required={form.is_nav}
                        disabled={form.is_divider || form.is_section || form.is_space}
                        placeholder={form.is_section ? 'Section headers have no link' : form.is_space ? 'Space (no link)' : 'Menu Item Link (e.g. /admin/users)'}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium">Icon (Lucide Icon name)</label>
                      <Input
                        name="icon"
                        value={form.icon}
                        onChange={handleChange}
                        disabled={form.is_divider || form.is_space}
                        placeholder={form.is_section ? 'Optional: Section header icon' : form.is_space ? 'Space (no icon)' : 'e.g. Users, Home, Settings'}
                      />
                      <a
                        href="https://lucide.dev/icons/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-blue-600 hover:underline mt-1 inline-block"
                        style={{ fontSize: '12px' }}
                      >
                        Browse Lucide icons
                      </a> <span className="text-xs"> use PascalCase for names.</span>
                    </div>
                    <div className="flex flex-col gap-2 mt-2">
                      <Label
                        htmlFor="is_nav"
                        className={
                          `hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 cursor-pointer has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950` +
                          (form.is_nav ? ' border-blue-600 bg-blue-50 dark:border-blue-900 dark:bg-blue-950' : '')
                        }
                      >
                        <Checkbox
                          id="is_nav"
                          checked={!!form.is_nav}
                          onCheckedChange={checked => setForm(f => ({ ...f, is_nav: !!checked, is_divider: false, is_section: false, is_space: false }))}
                        />
                        <div className="grid gap-1.5 font-normal">
                          <span className="text-sm leading-none font-medium">Menu Nav Item</span>
                          <span className="text-muted-foreground text-xs">Standard menu link (shows label, link, and icon).</span>
                        </div>
                      </Label>
                      <Label
                        htmlFor="is_section"
                        className={
                          `hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 cursor-pointer has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950` +
                          (form.is_section ? ' border-blue-600 bg-blue-50 dark:border-blue-900 dark:bg-blue-950' : '')
                        }
                      >
                        <Checkbox
                          id="is_section"
                          checked={!!form.is_section}
                          onCheckedChange={checked => setForm(f => ({ ...f, is_section: !!checked, is_nav: false, is_divider: false, is_space: false }))}
                        />
                        <div className="grid gap-1.5 font-normal">
                          <span className="text-sm leading-none font-medium">Section Header</span>
                          <span className="text-muted-foreground text-xs">Adds a non-clickable group title above menu items. Optionally, you can add an icon.</span>
                        </div>
                      </Label>
                      <Label
                        htmlFor="is_divider"
                        className={
                          `hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 cursor-pointer has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950` +
                          (form.is_divider ? ' border-blue-600 bg-blue-50 dark:border-blue-900 dark:bg-blue-950' : '')
                        }
                      >
                        <Checkbox
                          id="is_divider"
                          checked={!!form.is_divider}
                          onCheckedChange={checked => setForm(f => ({ ...f, is_divider: !!checked, is_nav: false, is_section: false, is_space: false }))}
                        />
                        <div className="grid gap-1.5 font-normal">
                          <span className="text-sm leading-none font-medium">Divider (horizontal line)</span>
                          <span className="text-muted-foreground text-xs">Adds a horizontal line between menu items.</span>
                        </div>
                      </Label>
                      <Label
                        htmlFor="is_space"
                        className={
                          `hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 cursor-pointer has-[[aria-checked=true]]:border-blue-600 has-[[aria-checked=true]]:bg-blue-50 dark:has-[[aria-checked=true]]:border-blue-900 dark:has-[[aria-checked=true]]:bg-blue-950` +
                          (form.is_space ? ' border-blue-600 bg-blue-50 dark:border-blue-900 dark:bg-blue-950' : '')
                        }
                      >
                        <Checkbox
                          id="is_space"
                          checked={!!form.is_space}
                          onCheckedChange={checked => setForm(f => ({ ...f, is_space: !!checked, is_nav: false, is_divider: false, is_section: false }))}
                        />
                        <div className="grid gap-1.5 font-normal">
                          <span className="text-sm leading-none font-medium">Space (empty row)</span>
                          <span className="text-muted-foreground text-xs">Adds empty vertical space between menu items.</span>
                        </div>
                      </Label>
                      <Label htmlFor="is_hidden" className="hover:bg-accent/50 flex items-start gap-3 rounded-lg border p-3 cursor-pointer">
                        <Checkbox
                          id="is_hidden"
                          checked={!!form.is_hidden}
                          onCheckedChange={checked => setForm(f => ({ ...f, is_hidden: !!checked }))}
                        />
                        <div className="grid gap-1.5 font-normal">
                          <span className="text-sm leading-none font-medium">Hide</span>
                          <span className="text-muted-foreground text-xs">Hide this menu item from the sidebar (does not delete).</span>
                        </div>
                      </Label>
                    </div>
                    <div className="flex gap-2 mt-4 items-center">
                      <Button
                        type="submit"
                        disabled={saving}
                      >
                        {saving ? 'Saving...' : (editing && editing.id ? 'Update' : 'Add')}
                      </Button>
                      {editing && editing.id && (
                        <Button
                          type="button"
                          variant="destructive"
                          className="ml-auto"
                          disabled={saving}
                          onClick={async () => {
                            if (window.confirm('Are you sure you want to delete this menu item?')) {
                              await handleDelete(editing.id);
                              handleCancel();
                            }
                          }}
                        >
                          Delete
                        </Button>
                      )}
                    </div>
                  </form>
                </SheetContent>
              </Sheet>
            </>
          )}
        </div>
      </AdminContent>
    </AdminShell>
  );
}