import { useState } from "react";
import { X, Plus, Minus, Image as ImageIcon, CheckSquare } from "lucide-react";
import { storage } from "../firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { supabase, Item } from "../lib/supabase";

interface Option {
    text: string;
    is_image: boolean;
    is_true: boolean;
}

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
    const [options, setOptions] = useState<Option[]>([]);
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

            // upload main image
            const fileRef = ref(
                storage,
                `images/${Date.now()}-${imageFile.name}`
            );
            await uploadBytes(fileRef, imageFile);
            const imageUrl = await getDownloadURL(fileRef);

            // upload option images if needed
            const processedOptions: Option[] = [];
            for (const option of options) {
                if (option.is_image && option.text.startsWith("file_")) {
                    // this means it's a local File ref
                    const file = (option as any).file as File;
                    const optRef = ref(
                        storage,
                        `options/${Date.now()}-${file.name}`
                    );
                    await uploadBytes(optRef, file);
                    const url = await getDownloadURL(optRef);
                    processedOptions.push({
                        text: url,
                        is_image: true,
                        is_true: option.is_true,
                    });
                } else {
                    processedOptions.push(option);
                }
            }

            const { data, error } = await supabase
                .from("items")
                .insert([
                    {
                        title,
                        description,
                        test_title: testTitle,
                        color,
                        is_colorable: isColorable,
                        test_options:
                            processedOptions.length > 0
                                ? processedOptions
                                : null,
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

    const handleOptionTextChange = (index: number, value: string) => {
        const newOptions = [...options];
        newOptions[index].text = value;
        newOptions[index].is_image = false;
        setOptions(newOptions);
    };

    const handleOptionImageChange = (index: number, file: File | null) => {
        if (!file) return;
        const newOptions = [...options];
        newOptions[index] = {
            text: `file_${file.name}`, // temporary marker
            is_image: true,
            is_true: newOptions[index].is_true,
            file, // store file temporarily
        } as any;
        setOptions(newOptions);
    };

    const toggleCorrectAnswer = (index: number) => {
        const newOptions = [...options];
        newOptions[index].is_true = !newOptions[index].is_true;
        setOptions(newOptions);
    };

    const addOption = () =>
        setOptions([...options, { text: "", is_image: false, is_true: false }]);

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
                    {/* title */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Sarlavha
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                            required
                        />
                    </div>

                    {/* description */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Tavsif
                        </label>
                        <textarea
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg resize-none"
                            required
                        />
                    </div>

                    {/* color */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Rang
                        </label>
                        <input
                            type="text"
                            value={color}
                            onChange={handleColorChange}
                            placeholder="9929EA or #9929EA"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
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

                    {/* is colorable */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Rang ishlatilinsinmi?
                        </label>
                        <div className="flex space-x-6">
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    checked={isColorable === true}
                                    onChange={() => setIsColorable(true)}
                                />
                                <span>Ha</span>
                            </label>
                            <label className="flex items-center space-x-2">
                                <input
                                    type="radio"
                                    checked={isColorable === false}
                                    onChange={() => setIsColorable(false)}
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
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                    </div>

                    {/* options */}
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                            Test variantlari
                        </label>
                        <div className="space-y-3">
                            {options.map((option, index) => (
                                <div
                                    key={index}
                                    className="flex flex-col space-y-2 border p-3 rounded-lg"
                                >
                                    <div className="flex items-center justify-between">
                                        <span className="font-semibold">
                                            Variant {index + 1}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => removeOption(index)}
                                            className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                                        >
                                            <Minus size={16} />
                                        </button>
                                    </div>

                                    {!option.is_image ? (
                                        <input
                                            type="text"
                                            value={option.text}
                                            onChange={(e) =>
                                                handleOptionTextChange(
                                                    index,
                                                    e.target.value
                                                )
                                            }
                                            placeholder="Matn varianti"
                                            className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                                        />
                                    ) : (
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) =>
                                                handleOptionImageChange(
                                                    index,
                                                    e.target.files
                                                        ? e.target.files[0]
                                                        : null
                                                )
                                            }
                                        />
                                    )}

                                    <div className="flex items-center space-x-4">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                setOptions((prev) =>
                                                    prev.map((o, i) =>
                                                        i === index
                                                            ? {
                                                                  ...o,
                                                                  is_image:
                                                                      !o.is_image,
                                                                  text: "",
                                                              }
                                                            : o
                                                    )
                                                )
                                            }
                                            className="flex items-center px-3 py-1 bg-gray-200 rounded-lg"
                                        >
                                            <ImageIcon
                                                size={16}
                                                className="mr-1"
                                            />
                                            {option.is_image ? "Rasm" : "Matn"}
                                        </button>

                                        <label className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={option.is_true}
                                                onChange={() =>
                                                    toggleCorrectAnswer(index)
                                                }
                                            />
                                            <span>To'g'ri javob</span>
                                        </label>
                                    </div>
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

                    {/* submit */}
                    <div className="flex justify-between space-x-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="w-1/2 px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                        >
                            Bekor qilish
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-1/2 px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50"
                        >
                            {loading ? "Yuklanyapti..." : "Element qo'shish"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
