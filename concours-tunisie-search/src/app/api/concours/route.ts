import { NextResponse } from 'next/server';
import { scrapeConcours } from '@/lib/scraper';

// Simple in-memory cache
let cache: {
    data: any;
    timestamp: number;
} | null = null;

const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export async function GET() {
    const now = Date.now();

    if (cache && (now - cache.timestamp < CACHE_DURATION)) {
        return NextResponse.json(cache.data);
    }

    const data = await scrapeConcours();

    if (data.length > 0) {
        cache = {
            data,
            timestamp: now,
        };
    }

    return NextResponse.json(data);
}
