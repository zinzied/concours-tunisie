import React from 'react';
import { Filter, Building2 } from 'lucide-react';

interface FilterProps {
    ministries: string[];
    selectedMinistry: string;
    onMinistryChange: (ministry: string) => void;
    selectedSource: string;
    onSourceChange: (source: string) => void;
}

export const FilterBar: React.FC<FilterProps> = ({
    ministries,
    selectedMinistry,
    onMinistryChange,
    selectedSource,
    onSourceChange,
}) => {
    return (
        <div className="flex flex-col sm:flex-row gap-4 w-full">
            {/* Source Filter */}
            <div className="relative min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Filter className="h-4 w-4 text-slate-500" />
                </div>
                <select
                    value={selectedSource}
                    onChange={(e) => onSourceChange(e.target.value)}
                    className="block w-full pl-10 pr-8 py-3 text-base border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-xl appearance-none bg-white shadow-sm cursor-pointer"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                    }}
                >
                    <option value="">Toutes les sources</option>
                    <option value="Concours.gov">Concours.gov</option>
                    <option value="STEG">STEG</option>
                    <option value="SONEDE">SONEDE</option>
                </select>
            </div>

            {/* Ministry Filter */}
            <div className="relative min-w-[200px]">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Building2 className="h-4 w-4 text-slate-500" />
                </div>
                <select
                    value={selectedMinistry}
                    onChange={(e) => onMinistryChange(e.target.value)}
                    className="block w-full pl-10 pr-8 py-3 text-base border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-xl appearance-none bg-white shadow-sm cursor-pointer"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                        backgroundPosition: 'right 0.5rem center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: '1.5em 1.5em',
                        paddingRight: '2.5rem'
                    }}
                >
                    <option value="">Tous les ministères</option>
                    {ministries.map((ministry) => (
                        <option key={ministry} value={ministry}>
                            {ministry}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
};
