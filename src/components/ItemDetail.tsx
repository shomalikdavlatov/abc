import { useState, useRef, useEffect } from "react";
import { Item, supabase } from "../lib/supabase";
import confetti from "canvas-confetti";

interface Option {
    text: string;
    is_image: boolean;
    is_true: boolean;
}

interface ItemDetailProps {
    item: Item;
    onDeleted?: () => void;
}

export function ItemDetail({ item, onDeleted }: ItemDetailProps) {
    const [selected, setSelected] = useState<number | null>(null);
    const [result, setResult] = useState<"correct" | "wrong" | null>(null);
    const optionsRef = useRef<HTMLDivElement | null>(null);

    const hasOptions =
        Array.isArray(item.test_options) && item.test_options.length > 0;
    const testOptions = hasOptions
        ? item.test_options!.map((opt) => JSON.parse(opt) as Option)
        : [];

    // reset when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                optionsRef.current &&
                !optionsRef.current.contains(event.target as Node)
            ) {
                setSelected(null);
                setResult(null);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const handleDelete = async () => {
        if (!confirm("Haqiqatan ham ushbu elementni o'chirmoqchimisiz?"))
            return;

        const { error } = await supabase
            .from("items")
            .delete()
            .eq("id", item.id);

        if (error) {
            console.error("Delete failed:", error);
            alert("Xatolik yuz berdi!");
        } else {
            alert("Element o'chirildi!");
            if (onDeleted) onDeleted();
        }
    };

    const handleCheck = () => {
        if (selected === null) return;

        const option = testOptions[selected];
        if (option.is_true) {
            setResult("correct");
            confetti({
                particleCount: 120,
                spread: 70,
                origin: { y: 0.6 },
            });
        } else {
            setResult("wrong");
        }
    };

    return (
        <div className="p-8 h-screen overflow-y-auto">
            <div
                className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-8 p-8 max-w-5xl mx-auto flex flex-col md:flex-row gap-8 ${
                    result === "wrong" ? "animate-shake" : ""
                }`}
                style={{
                    borderColor: item.color ? item.color : "#AE75DA",
                }}
            >
                {item.image && (
                    <div className="w-full md:w-1/2 flex justify-center items-center">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-auto max-h-[500px] object-contain rounded-xl"
                        />
                    </div>
                )}

                <div className="w-full md:w-1/2 flex flex-col justify-center">
                    <h1
                        className="text-7xl font-bold mb-4 break-words"
                        style={{
                            color: item.is_colorable ? item.color : "black",
                        }}
                    >
                        {item.title}
                    </h1>

                    <div className="mb-8">
                        <h2 className="text-3xl font-semibold text-gray-700 mb-2">
                            Tavsif
                        </h2>
                        <p
                            className="text-gray-600 leading-relaxed text-xl"
                            style={{
                                color: item.is_colorable ? item.color : "black",
                            }}
                        >
                            {item.description}
                        </p>
                    </div>

                    {item.example && (
                        <div className="mb-8">
                            <h2 className="text-3xl font-semibold text-gray-700 mb-2">
                                Namuna
                            </h2>
                            <p
                                className="text-gray-600 leading-relaxed text-xl"
                                style={{
                                    color: item.is_colorable ? item.color : "black",
                                }}
                            >
                                {item.example}
                            </p>
                        </div>
                    )}

                    {item.test_title && (
                        <div className="mb-6">
                            <h2 className="text-3xl font-semibold text-gray-700 mb-2">
                                {hasOptions ? "Test" : "Savol"}
                            </h2>
                            <p
                                className="text-xl text-gray-800 font-medium mb-4"
                                style={{
                                    color: item.is_colorable
                                        ? item.color
                                        : "black",
                                }}
                            >
                                {item.test_title}
                            </p>
                        </div>
                    )}

                    {hasOptions && (
                        <div ref={optionsRef}>
                            <div className="space-y-3">
                                {testOptions.map(
                                    (option: Option, index: number) => (
                                        <label
                                            key={index}
                                            className={`flex items-center space-x-3 p-4 rounded-lg border transition-colors cursor-pointer ${
                                                selected === index
                                                    ? "bg-purple-50"
                                                    : "bg-gray-50 hover:bg-gray-100"
                                            }`}
                                            style={{
                                                borderColor:
                                                    selected === index
                                                        ? item.color
                                                        : "#e5e7eb",
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="test"
                                                value={index}
                                                checked={selected === index}
                                                onChange={() =>
                                                    setSelected(index)
                                                }
                                                className="hidden"
                                            />
                                            <div
                                                className="flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-semibold"
                                                style={{
                                                    backgroundColor:
                                                        selected === index
                                                            ? item.color
                                                            : "#d1d5db",
                                                    color:
                                                        selected === index
                                                            ? "#fff"
                                                            : "#374151",
                                                }}
                                            >
                                                {String.fromCharCode(
                                                    65 + index
                                                )}
                                            </div>
                                            {option.is_image ? (
                                                <img
                                                    src={option.text}
                                                    alt={`Option ${index}`}
                                                    className="max-w-[150px] max-h-[150px] object-contain rounded"
                                                />
                                            ) : (
                                                <span
                                                    className={
                                                        selected === index
                                                            ? "font-semibold"
                                                            : ""
                                                    }
                                                    style={{
                                                        color:
                                                            selected === index
                                                                ? "#111827"
                                                                : "#374151",
                                                    }}
                                                >
                                                    {option.text}
                                                </span>
                                            )}
                                        </label>
                                    )
                                )}
                            </div>

                            {result === "wrong" && (
                                <p className="text-red-500 font-semibold mt-4">
                                    ❌ Noto'g'ri javob! Qayta urinib ko'ring.
                                </p>
                            )}

                            <div className="flex gap-4 mt-6">
                                {/* <button
                                    type="button"
                                    onClick={handleDelete}
                                    className="w-1/2 px-6 py-2 rounded-lg font-semibold text-white bg-red-500 hover:bg-red-600 transition-colors"
                                >
                                    Elementni o'chirish
                                </button> */}
                                <button
                                    type="button"
                                    onClick={handleCheck}
                                    disabled={selected === null}
                                    className="w-full px-6 py-2 rounded-lg font-semibold text-white bg-purple-500 hover:bg-purple-600 transition-colors disabled:opacity-50"
                                >
                                    Tekshirish
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
