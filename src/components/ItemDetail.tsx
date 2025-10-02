import { Item } from '../lib/supabase';

interface ItemDetailProps {
  item: Item;
  borderColor: string;
}

const borderColorClasses: Record<string, string> = {
  blue: 'border-blue-500',
  yellow: 'border-yellow-500',
  green: 'border-green-500',
  pink: 'border-pink-500',
  purple: 'border-purple-500',
};

export function ItemDetail({ item, borderColor }: ItemDetailProps) {
  const borderClass = borderColorClasses[borderColor] || 'border-purple-500';

  return (
    <div className="p-8 h-screen overflow-y-auto">
      <div
        className={`bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl border-4 ${borderClass} p-8 max-w-4xl mx-auto`}
      >
        {item.image && (
          <div className="mb-6 rounded-xl overflow-hidden">
            <img
              src={item.image}
              alt={item.title}
              className="w-full h-64 object-cover"
            />
          </div>
        )}

        <h1 className="text-4xl font-bold text-gray-800 mb-4">{item.title}</h1>

        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-700 mb-2">
            Description
          </h2>
          <p className="text-gray-600 leading-relaxed">{item.description}</p>
        </div>

        {item.test_options && item.test_options.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-gray-700 mb-4">Test</h2>
            <div className="space-y-3">
              {item.test_options.map((option, index) => (
                <div
                  key={index}
                  className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer border border-gray-200"
                >
                  <div className="flex-shrink-0 w-8 h-8 flex items-center justify-center bg-purple-600 text-white rounded-full font-semibold">
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="text-gray-700">{option}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
