import React from 'react';
import { Search, X } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (value: string) => void;
}

export const SearchBar: React.FC<SearchBarProps> = ({ value, onChange }) => {
    return (
        <div className="relative w-full max-w-xl">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400" />
            </div>
            <input
                type="text"
                className="block w-full pl-10 pr-10 py-3 border border-slate-200 rounded-xl leading-5 bg-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 shadow-sm"
                placeholder="Rechercher un concours (ex: Ingénieur, Technicien...)"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            {value && (
                <button
                    onClick={() => onChange('')}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                    <X className="h-4 w-4 text-slate-400 hover:text-slate-600 cursor-pointer" />
                </button>
            )}
        </div>
    );
};
