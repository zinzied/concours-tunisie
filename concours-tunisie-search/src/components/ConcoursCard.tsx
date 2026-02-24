import React from 'react';
import { Calendar, Building2, Link as LinkIcon } from 'lucide-react';
import clsx from 'clsx';

interface ConcoursCardProps {
    title: string;
    ministry: string;
    dateDeadline: string;
    link: string;
    reference: string;
    source: string;
}

export const ConcoursCard: React.FC<ConcoursCardProps> = ({
    title,
    ministry,
    dateDeadline,
    link,
    reference,
    source,
}) => {
    return (
        <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-slate-100 overflow-hidden flex flex-col h-full">
            <div className="p-5 flex-grow">
                <div className="flex justify-between items-start mb-2 gap-2">
                    <div className="flex gap-2">
                        <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-600 bg-blue-50 rounded-md">
                            Ref: {reference}
                        </span>
                        <span className={clsx("inline-block px-2 py-1 text-xs font-semibold rounded-md",
                            source === 'Concours.gov' ? "text-green-600 bg-green-50" :
                                source === 'STEG' ? "text-cyan-600 bg-cyan-50" :
                                    source === 'SONEDE' ? "text-blue-600 bg-blue-50" : "text-slate-600 bg-slate-50"
                        )}>
                            {source}
                        </span>
                    </div>
                    <span className="text-xs text-slate-400 font-medium whitespace-nowrap">
                        DeadLine
                    </span>
                </div>

                <h3 className="text-lg font-bold text-slate-800 mb-3 line-clamp-2 leading-tight">
                    {title}
                </h3>

                <div className="flex items-center text-slate-600 text-sm mb-4">
                    <Building2 className="w-4 h-4 mr-2 text-slate-400 flex-shrink-0" />
                    <span className="line-clamp-1">{ministry}</span>
                </div>

                <div className="flex items-center text-slate-600 text-sm">
                    <Calendar className="w-4 h-4 mr-2 text-red-400 flex-shrink-0" />
                    <span className="font-medium text-red-600">{dateDeadline}</span>
                </div>
            </div>

            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100">
                <a
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-full py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors duration-200"
                >
                    Voir les détails
                    <LinkIcon className="w-3 h-3 ml-2" />
                </a>
            </div>
        </div>
    );
};
