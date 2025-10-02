import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { supabase, Item } from './lib/supabase';
import { Sidebar } from './components/Sidebar';
import { ItemDetail } from './components/ItemDetail';
import { AddItemModal } from './components/AddItemModal';

const BORDER_COLORS = ['blue', 'yellow', 'green', 'pink', 'purple'];
const BACKGROUND_IMAGES = [
  'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=1920',
];

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [borderColor, setBorderColor] = useState('purple');
  const [backgroundImage, setBackgroundImage] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const randomBg =
      BACKGROUND_IMAGES[Math.floor(Math.random() * BACKGROUND_IMAGES.length)];
    setBackgroundImage(randomBg);
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const { data, error } = await supabase
        .from('items')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setItems(data || []);
    } catch (error) {
      console.error('Error fetching items:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectItem = (id: number) => {
    setSelectedItemId(id);
    const randomColor =
      BORDER_COLORS[Math.floor(Math.random() * BORDER_COLORS.length)];
    setBorderColor(randomColor);
  };

  const handleAddItem = async (newItem: {
    title: string;
    description: string;
    test_options: string[];
    image: string;
  }) => {
    try {
      const { data, error } = await supabase
        .from('items')
        .insert([newItem])
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setItems([data, ...items]);
      }
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const selectedItem = items.find((item) => item.id === selectedItemId);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-purple-900">
        <div className="text-white text-2xl font-semibold">Loading...</div>
      </div>
    );
  }

  return (
    <div
      className="flex h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="absolute inset-0 bg-purple-900/40 backdrop-blur-sm" />

      <div className="relative z-10 flex w-full">
        <Sidebar
          items={items}
          selectedItemId={selectedItemId}
          onSelectItem={handleSelectItem}
        />

        <div className="flex-1">
          {selectedItem ? (
            <ItemDetail item={selectedItem} borderColor={borderColor} />
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h2 className="text-4xl font-bold text-white mb-4">
                  Welcome to Item Explorer
                </h2>
                <p className="text-xl text-purple-200">
                  Select an item from the sidebar to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 z-20 bg-purple-600 hover:bg-purple-700 text-white p-4 rounded-full shadow-2xl transition-all duration-200 hover:scale-110"
      >
        <Plus size={32} />
      </button>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddItem}
      />
    </div>
  );
}

export default App;
