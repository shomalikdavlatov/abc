import { useState } from "react";
import { X, Plus, Minus } from "lucide-react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { supabase, Item } from "../lib/supabase";

interface AddItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAdd: (item: Item) => void;
}

export function AddItemModal({ isOpen, onClose, onAdd }: AddItemModalProps) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [testTitle, setTestTitle] = useState("");
    const [color, setColor] = useState("");
    const [isColorable, setIsColorable] = useState<boolean>(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [options, setOptions] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);

    const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let raw = e.target.value;
        if (raw.startsWith("#")) raw = raw.slice(1);
        raw = raw.replace(/[^a-fA-F0-9]/g, "").slice(0, 6);
        setColor(raw ? `#${raw.toUpperCase()}` : "");
    };

    const hexOnly = color ? color.replace("#", "") : "";
    const isColorValid =
        hexOnly.length === 0 || hexOnly.length === 3 || hexOnly.length === 6;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!imageFile) {
            alert("Please select an image");
            return;
        }

        try {
            setLoading(true);

            const fileRef = ref(
                storage,
                `images/${Date.now()}-${imageFile.name}`
            );
            await uploadBytes(fileRef, imageFile);
            const imageUrl = await getDownloadURL(fileRef);

            const { data, error } = await supabase
                .from("items")
                .insert([
                    {
                        title,
                        description,
                        test_title: testTitle,
                        color,
                        is_colorable: isColorable,
                        test_options: options.length > 0 ? options : null,
                        image: imageUrl,
                    },
                ])
                .select()
                .single();

            if (error) throw error;

            onAdd(data);

            setTitle("");
            setDescription("");
            setTestTitle("");
            setColor("");
            setImageFile(null);
            setOptions([]);
            setIsColorable(false);
            onClose();
        } catch (err) {
            console.error(err);
            alert("Upload failed");
        } finally {
            setLoading(false);
        }
    };

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index] = value;
        setOptions(newOptions);
    };

    const addOption = () => setOptions([...options, ""]);
    const removeOption = (index: number) => {
        const newOptions = options.filter((_, i) => i !== index);
        setOptions(newOptions);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={onClose}
            />
            <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
                <div className="sticky top-0 bg-purple-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
                    <h2 className="text-2xl font-bold">
                        Yangi element qo'shish
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-purple-700 rounded-lg transition-colors"
                    >
                        <X size={24} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-6">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Sarlavha
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tavsif
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Rang
                        </label>
                        <input
                            type="text"
                            value={color}
                            onChange={handleColorChange}
                            placeholder="9929EA or #9929EA"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />

                        {!isColorValid && (
                            <p className="text-sm text-red-500 mt-2">
                                Noto'g'ri rang, 16 lik sanoq tizimida 3 yoki 6
                                ta son kiriting
                            </p>
                        )}

                        {color && isColorValid && hexOnly.length > 0 && (
                            <div className="mt-2 flex items-center space-x-2">
                                <div
                                    className="w-8 h-8 rounded border border-gray-300"
                                    style={{ backgroundColor: color }}
                                />
                                <span className="text-sm text-gray-600">
                                    {color}
                                </span>
                            </div>
                        )}
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Rang ishlatilinsinmi?
                        </label>
                        <div className="flex space-x-6">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="isColorable"
                                    value="true"
                                    checked={isColorable === true}
                                    onChange={() => setIsColorable(true)}
                                    className="h-4 w-4 text-purple-600"
                                />
                                <span>Ha</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    name="isColorable"
                                    value="false"
                                    checked={isColorable === false}
                                    onChange={() => setIsColorable(false)}
                                    className="h-4 w-4 text-purple-600"
                                />
                                <span>Yo'q</span>
                            </label>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Rasm yuklash
                        </label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) =>
                                setImageFile(
                                    e.target.files ? e.target.files[0] : null
                                )
                            }
                            className="w-full"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Savol
                        </label>
                        <input
                            type="text"
                            value={testTitle}
                            onChange={(e) => setTestTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Test variantlari (ixtiyoriy)
                        </label>
                        <div className="space-y-3">
                            {options.map((option, index) => (
                                <div
                                    key={index}
                                    className="flex items-center space-x-3"
                                >
                                    <input
                                        type="text"
                                        value={option}
                                        onChange={(e) =>
                                            handleOptionChange(
                                                index,
                                                e.target.value
                                            )
                                        }
                                        placeholder={`Option ${index + 1}`}
                                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeOption(index)}
                                        className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                    >
                                        <Minus size={16} />
                                    </button>
                                </div>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={addOption}
                            className="mt-3 flex items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-600"
                        >
                            <Plus size={16} className="mr-2" /> Variant qo'shish
                        </button>
                    </div>

                    <div className="flex justify-between space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-1/2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors font-semibold"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-1/2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold shadow-lg disabled:opacity-50"
                        >
                            {loading ? "Yuklanyapti..." : "Element qo'shish"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
