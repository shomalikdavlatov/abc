// app.tsx
import { useEffect, useState } from "react";
import { Plus, ArrowLeft } from "lucide-react";
import { supabase, Item, ColorCategory } from "./lib/supabase";
import { ItemDetail } from "./components/ItemDetail";
import { AddItemModal } from "./components/AddItemModal";

const BACKGROUND_IMAGES = [
    "https://martebe.kz/wp-content/uploads/2021/04/happy-cute-boy-and-girl-lay-on-grass_97632-1402.jpg",
    "https://images.unsplash.com/photo-1513542789411-b6a5d4f31634?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8c2Nob29sJTIwc3VwcGxpZXN8ZW58MHx8MHx8fDA%3D",
];

function App() {
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
    const [selectedColor, setSelectedColor] = useState<ColorCategory | null>(null);
    const [backgroundImage, setBackgroundImage] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const randomBg =
            BACKGROUND_IMAGES[
                Math.floor(Math.random() * BACKGROUND_IMAGES.length)
            ];
        setBackgroundImage(randomBg);
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const { data, error } = await supabase
                .from("items")
                .select("*")
                .order("title");

            if (error) throw error;
            setItems(data || []);
        } catch (error) {
            console.error("Error fetching items:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleColorSelect = (color: ColorCategory) => {
        setSelectedColor(color);
        setSelectedItemId(null);
    };

    const handleSelectItem = (id: number) => {
        setSelectedItemId(id);
    };

    const handleBack = () => {
        if (selectedItemId) {
            setSelectedItemId(null);
        } else if (selectedColor) {
            setSelectedColor(null);
        }
    };

    const handleDeleteItem = (id: number) => {
        setItems((prev) => prev.filter((item) => item.id !== id));
        setSelectedItemId(null);
    };

    const handleAddItem = (newItem: Item) => {
        setItems((prev) => [newItem, ...prev]);
    };

    const selectedItem = items.find((item) => item.id === selectedItemId);
    const filteredItems = selectedColor
        ? items.filter((item) => item.color_category === selectedColor)
        : [];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-screen bg-purple-900">
                <div className="text-white text-2xl font-semibold">
                    Yuklanmoqda...
                </div>
            </div>
        );
    }

    return (
        <div
            className="flex min-h-screen bg-cover bg-center bg-fixed"
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            <div className="absolute inset-0" />

            {/* Back Button */}
            {(selectedColor || selectedItemId) && (
                <button
                    onClick={handleBack}
                    className="absolute top-4 left-4 sm:top-6 sm:left-6 z-50 bg-white/30 hover:bg-white/50 backdrop-blur-md p-2 sm:p-3 rounded-full text-white transition-all shadow-lg"
                >
                    <ArrowLeft size={24} className="sm:hidden" />
                    <ArrowLeft size={32} className="hidden sm:block" />
                </button>
            )}

            <div className="relative z-10 w-full min-h-screen overflow-y-auto">
                {!selectedColor ? (
                    // 1. Color Selection View
                    <div className="flex flex-col items-center justify-center min-h-screen gap-6 sm:gap-8 p-4 py-16">
                        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black text-white drop-shadow-lg text-center mb-4 sm:mb-8">
                            Rangni Tanlang
                        </h1>
                        <div className="flex flex-col sm:flex-row flex-wrap md:flex-nowrap justify-center gap-5 sm:gap-8 w-full max-w-4xl">
                            <button
                                onClick={() => handleColorSelect('RED')}
                                className="group relative w-9/10 sm:w-44 md:w-56 lg:w-80 h-56 sm:h-72 md:h-80 rounded-3xl bg-white shadow-2xl transform transition-all hover:scale-105 hover:rotate-2 flex flex-col items-center justify-center border-8 border-red-500"
                            >
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2">QIZIL-SARIQ</div>
                                <div className="text-gray-700 text-base sm:text-lg opacity-80 group-hover:opacity-100">Elementlar</div>
                            </button>

                            <button
                                onClick={() => handleColorSelect('GREEN')}
                                className="group relative w-9/10 sm:w-44 md:w-56 lg:w-80 h-56 sm:h-72 md:h-80 rounded-3xl bg-white shadow-2xl transform transition-all hover:scale-105 hover:-rotate-2 flex flex-col items-center justify-center border-8 border-yellow-400"
                            >
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2">SARIQ-KO'K</div>
                                <div className="text-gray-700 text-base sm:text-lg opacity-80 group-hover:opacity-100">Elementlar</div>
                            </button>

                            <button
                                onClick={() => handleColorSelect('BLUE')}
                                className="group relative w-9/10 sm:w-44 md:w-56 lg:w-80 h-56 sm:h-72 md:h-80 rounded-3xl bg-white shadow-2xl transform transition-all hover:scale-105 hover:rotate-1 flex flex-col items-center justify-center border-8 border-blue-500"
                            >
                                <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-2">KO'K-QIZIL</div>
                                <div className="text-gray-700 text-base sm:text-lg opacity-80 group-hover:opacity-100">Elementlar</div>
                            </button>
                        </div>
                    </div>
                ) : !selectedItemId ? (
                    // 2. Item List View
                    <div className="container mx-auto px-4 sm:px-6 md:px-8 py-8 pt-20 sm:pt-24 min-h-screen">
                        <div className="text-center mb-8 sm:mb-12">
                            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white drop-shadow-md mb-2">
                                {selectedColor === 'RED' ? "Qizil-sariq" : selectedColor === 'GREEN' ? "Sariq-ko'k" : "Ko'k-qizil"} Elementlar
                            </h2>
                            <p className="text-base sm:text-xl text-white/80">O'rganish uchun birini tanlang</p>
                        </div>

                        {filteredItems.length === 0 ? (
                            <div className="text-center text-white text-lg sm:text-2xl mt-12 sm:mt-20 bg-black/30 p-6 sm:p-8 rounded-xl backdrop-blur-sm max-w-lg mx-auto">
                                Hozircha bu rangda elementlar mavjud emas.
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
                                {filteredItems.map((item) => (
                                    <button
                                        key={item.id}
                                        onClick={() => handleSelectItem(item.id)}
                                        className="bg-white/90 backdrop-blur-sm rounded-2xl p-5 sm:p-6 md:p-8 shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1 text-left group border-4 w-full min-h-[160px] sm:min-h-[200px]"
                                        style={{ borderColor: item.color || '#9333ea' }}
                                    >
                                        <h3 
                                            className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-3 sm:mb-4 transition-colors"
                                            onMouseEnter={(e) => {
                                                if (item.is_colorable) {
                                                    e.currentTarget.style.color = item.color;
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = '#1f2937';
                                            }}
                                        >
                                            {item.title}
                                        </h3>
                                        <p 
                                            className="line-clamp-3 text-gray-600 transition-colors text-base sm:text-lg"
                                            onMouseEnter={(e) => {
                                                if (item.is_colorable) {
                                                    e.currentTarget.style.color = item.color;
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.color = '#4b5563';
                                            }}
                                        >
                                            {item.description}
                                        </p>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ) : (
                    // 3. Item Detail View
                    <div className="pt-14 sm:pt-16">
                        {selectedItem && (
                            <ItemDetail
                                item={selectedItem}
                                onDeleted={() => handleDeleteItem(selectedItem.id)}
                            />
                        )}
                    </div>
                )}
            </div>

            <button
                onClick={() => setIsModalOpen(true)}
                className="fixed bottom-5 right-5 sm:bottom-8 sm:right-8 z-50 bg-purple-600 hover:bg-purple-700 text-white p-3 sm:p-4 rounded-full shadow-2xl transition-all duration-200 hover:scale-110"
            >
                <Plus size={24} className="sm:hidden" />
                <Plus size={32} className="hidden sm:block" />
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
