'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { ConcoursCard } from '@/components/ConcoursCard';
import { SearchBar } from '@/components/SearchBar';
import { FilterBar } from '@/components/MinistryFilter';
import { Concours } from '@/lib/scraper';
import { Loader2, AlertCircle } from 'lucide-react';

export default function Home() {
  const [concours, setConcours] = useState<Concours[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedMinistry, setSelectedMinistry] = useState('');
  const [selectedSource, setSelectedSource] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/concours');
        if (!res.ok) throw new Error('Failed to fetch data');
        const data = await res.json();
        setConcours(data);
      } catch (err) {
        setError('Impossible de charger les concours. Veuillez réessayer plus tard.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const ministries = useMemo(() => {
    const uniqueMinistries = new Set(concours.map((c) => c.ministry));
    return Array.from(uniqueMinistries).sort();
  }, [concours]);

  const filteredConcours = useMemo(() => {
    return concours.filter((c) => {
      const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.ministry.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.reference.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMinistry = selectedMinistry ? c.ministry === selectedMinistry : true;
      const matchesSource = selectedSource ? c.source === selectedSource : true;
      return matchesSearch && matchesMinistry && matchesSource;
    });
  }, [concours, searchTerm, selectedMinistry, selectedSource]);

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-blue-100">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200 pb-12 pt-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 mb-4">
            Concours Publics <span className="text-blue-600">Tunisie</span>
          </h1>
          <p className="mt-4 max-w-2xl mx-auto text-xl text-slate-500">
            Trouvez facilement les derniers concours de la fonction publique tunisienne, centralisés en un seul endroit.
          </p>

          <div className="mt-10 max-w-4xl mx-auto flex flex-col gap-4 justify-center items-center">
            <SearchBar value={searchTerm} onChange={setSearchTerm} />
            <FilterBar
              ministries={ministries}
              selectedMinistry={selectedMinistry}
              onMinistryChange={setSelectedMinistry}
              selectedSource={selectedSource}
              onSourceChange={setSelectedSource}
            />
          </div>

          {/* Stats */}
          {!loading && !error && (
            <div className="mt-6 text-sm text-slate-500 font-medium">
              {filteredConcours.length} concours trouvé{filteredConcours.length > 1 ? 's' : ''}
            </div>
          )}

        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-10 h-10 text-blue-600 animate-spin mb-4" />
            <p className="text-slate-500 font-medium">Chargement des concours...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 mb-2">Oups !</h3>
            <p className="text-slate-500">{error}</p>
          </div>
        ) : filteredConcours.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-slate-100">
            <p className="text-slate-500 text-lg">Aucun concours ne correspond à votre recherche.</p>
            <button
              onClick={() => { setSearchTerm(''); setSelectedMinistry(''); setSelectedSource(''); }}
              className="mt-4 text-blue-600 font-medium hover:underline"
            >
              Effacer les filtres
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConcours.map((item) => (
              <ConcoursCard key={item.id} {...item} />
            ))}
          </div>
        )}
      </div>

      <footer className="bg-white border-t border-slate-200 py-8 mt-auto">
        <div className="max-w-7xl mx-auto px-4 text-center text-slate-400 text-sm">
          <p>© {new Date().getFullYear()} Concours Tunisie Search. Données provenant de concours.gov.tn</p>
        </div>
      </footer>
    </main>
  );
}
