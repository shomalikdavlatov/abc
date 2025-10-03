import { Item } from '../lib/supabase';

interface SidebarProps {
  items: Item[];
  selectedItemId: number | null;
  onSelectItem: (id: number) => void;
}

export function Sidebar({ items, selectedItemId, onSelectItem }: SidebarProps) {
  return (
      <div className="w-80 bg-purple-700/50 backdrop-blur-sm border-r border-purple-500/30 h-screen overflow-y-auto">
          <div className="p-6">
              <h2 className="text-2xl font-bold text-white mb-6">Items</h2>
              <div className="space-y-3">
                  {items.map((item) => (
                      <button
                          key={item.id}
                          onClick={() => onSelectItem(item.id)}
                          className={`w-full text-left p-4 rounded-lg transition-all duration-200 ${
                              selectedItemId === item.id
                                  ? "bg-[#9112BC] shadow-lg shadow-purple-500/50"
                                  : "bg-purple-600 hover:bg-purple-700"
                          }`}
                      >
                          <h3 className="text-white font-semibold mb-1 truncate">
                              {item.title}
                          </h3>
                          <p className="text-purple-200 text-sm line-clamp-2">
                              {item.description}
                          </p>
                      </button>
                  ))}
              </div>
          </div>
      </div>
  );
}
