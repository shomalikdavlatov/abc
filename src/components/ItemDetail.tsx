import { useState, useRef, useEffect } from "react";
import { Item } from "../lib/supabase";

interface ItemDetailProps {
    item: Item;
}

export function ItemDetail({ item }: ItemDetailProps) {
    const [selected, setSelected] = useState<number | null>(null);
    const optionsRef = useRef<HTMLDivElement | null>(null);

    const hasOptions = item.test_options && item.test_options.length > 0;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                optionsRef.current &&
                !optionsRef.current.contains(event.target as Node)
            ) {
                setSelected(null); // clear selection if click outside
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    return (
        <div className="p-8 h-screen overflow-y-auto">
            <div
                className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-8 p-8 max-w-4xl mx-auto"
                style={{
                    borderColor: item.is_colorable ? item.color : "#AE75DA",
                }}
            >
                {item.image && (
                    <div className="mb-6 rounded-xl overflow-hidden">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-auto object-contain"
                        />
                    </div>
                )}

                <h1
                    className="text-4xl font-bold mb-4"
                    style={{ color: item.is_colorable ? item.color : "black" }}
                >
                    {item.title}
                </h1>

                <div className="mb-8">
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        Tavsif
                    </h2>
                    <p
                        className="text-gray-600 leading-relaxed"
                        style={{
                            color: item.is_colorable ? item.color : "black",
                        }}
                    >
                        {item.description}
                    </p>
                </div>

                {item.test_title && (
                    <div className="mb-6">
                        <h2 className="text-xl font-semibold text-gray-700 mb-2">
                            {hasOptions ? "Test" : "Savol"}
                        </h2>
                        <p
                            className="text-lg text-gray-800 font-medium mb-4"
                            style={{
                                color: item.is_colorable ? item.color : "black",
                            }}
                        >
                            {item.test_title}
                        </p>
                    </div>
                )}

                {hasOptions && (
                    <div ref={optionsRef} className="space-y-3">
                        {item.test_options!.map((option, index) => (
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
                                    onChange={() => setSelected(index)}
                                    className="hidden"
                                />
                                <div
                                    className={`flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full font-semibold`}
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
                                    {String.fromCharCode(65 + index)}
                                </div>
                                <span
                                    className={`${
                                        selected === index
                                            ? "font-semibold"
                                            : ""
                                    }`}
                                    style={{
                                        color:
                                            selected === index
                                                ? "#111827"
                                                : "#374151",
                                    }}
                                >
                                    {option}
                                </span>
                            </label>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
