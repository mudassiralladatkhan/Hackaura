import React, { useState } from 'react';
import { Search, Book, RefreshCw, ThumbsUp } from 'lucide-react';

// 模拟词汇数据库
const vocabularyData = {
  'happy': {
    synonyms: ['joyful', 'delighted', 'pleased', 'cheerful'],
    definition: '感到或表现出愉快；快乐的',
    example: 'She was happy to see her old friend.',
  },
  'beautiful': {
    synonyms: ['gorgeous', 'stunning', 'attractive', 'lovely'],
    definition: '悦目的；美丽的；令人愉快的',
    example: 'The sunset was beautiful tonight.',
  },
  'smart': {
    synonyms: ['intelligent', 'clever', 'bright', 'brilliant'],
    definition: '聪明的；智慧的；反应快的',
    example: 'He made a smart decision.',
  },
};

function App() {
  const [searchWord, setSearchWord] = useState('');
  const [result, setResult] = useState<typeof vocabularyData[keyof typeof vocabularyData] | null>(null);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [error, setError] = useState('');

  const handleSearch = () => {
    const word = searchWord.toLowerCase().trim();
    if (!word) {
      setError('请输入要查询的单词');
      return;
    }

    if (vocabularyData[word as keyof typeof vocabularyData]) {
      setResult(vocabularyData[word as keyof typeof vocabularyData]);
      setError('');
      if (!recentSearches.includes(word)) {
        setRecentSearches(prev => [word, ...prev].slice(0, 5));
      }
    } else {
      setResult(null);
      setError('未找到该单词，请尝试其他单词');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-indigo-800 mb-2">词汇扩展工具</h1>
          <p className="text-gray-600">探索词义，拓展词汇量</p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={searchWord}
              onChange={(e) => setSearchWord(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="输入英文单词..."
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              onClick={handleSearch}
              className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
            >
              <Search size={20} />
              查询
            </button>
          </div>

          {error && (
            <div className="text-red-500 mb-4">{error}</div>
          )}

          {result && (
            <div className="space-y-4">
              <div className="bg-indigo-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-indigo-800 mb-2 flex items-center gap-2">
                  <Book size={24} />
                  释义
                </h2>
                <p className="text-gray-700">{result.definition}</p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-purple-800 mb-2 flex items-center gap-2">
                  <RefreshCw size={24} />
                  同义词
                </h2>
                <div className="flex flex-wrap gap-2">
                  {result.synonyms.map((synonym) => (
                    <span
                      key={synonym}
                      className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full"
                    >
                      {synonym}
                    </span>
                  ))}
                </div>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <h2 className="text-xl font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <ThumbsUp size={24} />
                  示例
                </h2>
                <p className="text-gray-700 italic">{result.example}</p>
              </div>
            </div>
          )}
        </div>

        {recentSearches.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-3">最近搜索</h2>
            <div className="flex flex-wrap gap-2">
              {recentSearches.map((word) => (
                <button
                  key={word}
                  onClick={() => {
                    setSearchWord(word);
                    handleSearch();
                  }}
                  className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full hover:bg-gray-200"
                >
                  {word}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;