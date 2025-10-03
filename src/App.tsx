import { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { supabase, Item } from './lib/supabase';
import { Sidebar } from './components/Sidebar';
import { ItemDetail } from './components/ItemDetail';
import { AddItemModal } from './components/AddItemModal';

const BACKGROUND_IMAGES = [
  'https://images.pexels.com/photos/1103970/pexels-photo-1103970.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/1287145/pexels-photo-1287145.jpeg?auto=compress&cs=tinysrgb&w=1920',
  'https://images.pexels.com/photos/1939485/pexels-photo-1939485.jpeg?auto=compress&cs=tinysrgb&w=1920',
];

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
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
  };

  const handleAddItem = async (newItem: {
    title: string;
    description: string;
    test_title: string;
    color: string;
    test_options: string[] | null;
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
          <div className="absolute inset-0" />

          <div className="relative z-10 flex w-full">
              <Sidebar
                  items={items}
                  selectedItemId={selectedItemId}
                  onSelectItem={handleSelectItem}
              />

              <div className="flex-1">
                  {selectedItem ? (
                      <ItemDetail
                          item={selectedItem}
                      />
                  ) : (
                      <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                              <h2 className="text-7xl font-extrabold bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 bg-clip-text text-transparent leading-none pb-2 mb-4 drop-shadow-sm">
                                  Ranglar jilosi
                              </h2>

                              <p className="text-xl bg-gradient-to-r from-pink-400 to-purple-400 bg-clip-text text-transparent italic">
                                  Chap tomondan ma'lumotni tanlang
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
