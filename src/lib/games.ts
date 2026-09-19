import { eq, asc, inArray } from 'drizzle-orm';
import type { Database } from './db';
import { games, categories, publishers } from '../../db/schema';
import type { Category, Game, Publisher } from '../types/game';

export interface GameFilters {
    /** Category ids to include; when empty, every category is allowed. */
    categoryIds?: number[];
    /** Publisher ids to include; when empty, every publisher is allowed. */
    publisherIds?: number[];
}

const gameSelection = {
    id: games.id,
    title: games.title,
    description: games.description,
    starRating: games.starRating,
    categoryId: categories.id,
    categoryName: categories.name,
    publisherId: publishers.id,
    publisherName: publishers.name,
};

type GameSelectionRow = {
    id: number;
    title: string;
    description: string;
    starRating: number | null;
    categoryId: number | null;
    categoryName: string | null;
    publisherId: number | null;
    publisherName: string | null;
};

function mapGame(row: GameSelectionRow): Game {
    return {
        id: row.id,
        title: row.title,
        description: row.description,
        starRating: row.starRating,
        category:
            row.categoryId !== null && row.categoryName !== null
                ? { id: row.categoryId, name: row.categoryName }
                : null,
        publisher:
            row.publisherId !== null && row.publisherName !== null
                ? { id: row.publisherId, name: row.publisherName }
                : null,
    };
}

function baseGamesQuery(db: Database) {
    return db
        .select(gameSelection)
        .from(games)
        .leftJoin(categories, eq(games.categoryId, categories.id))
        .leftJoin(publishers, eq(games.publisherId, publishers.id));
}

function applyGameFilters(query: ReturnType<typeof baseGamesQuery>, filters: GameFilters) {
    let filteredQuery = query;
    const categoryIds = filters.categoryIds?.filter((id) => Number.isInteger(id) && id > 0) ?? [];
    const publisherIds = filters.publisherIds?.filter((id) => Number.isInteger(id) && id > 0) ?? [];

    if (categoryIds.length > 0) {
        filteredQuery = filteredQuery.where(inArray(games.categoryId, categoryIds)) as typeof filteredQuery;
    }

    if (publisherIds.length > 0) {
        filteredQuery = filteredQuery.where(inArray(games.publisherId, publisherIds)) as typeof filteredQuery;
    }

    return filteredQuery;
}

/** Return all games ordered by title, optionally filtered by category and publisher ids. */
export async function getAllGames(db: Database, filters: GameFilters = {}): Promise<Game[]> {
    const rows = await applyGameFilters(baseGamesQuery(db), filters).orderBy(asc(games.title));
    return rows.map(mapGame);
}

/** Return all categories in alphabetical order for filter controls. */
export async function getAllCategories(db: Database): Promise<Category[]> {
    const rows = await db
        .select({ id: categories.id, name: categories.name })
        .from(categories)
        .orderBy(asc(categories.name));
    return rows.map((row) => ({ id: row.id, name: row.name }));
}

/** Return all publishers in alphabetical order for filter controls. */
export async function getAllPublishers(db: Database): Promise<Publisher[]> {
    const rows = await db
        .select({ id: publishers.id, name: publishers.name })
        .from(publishers)
        .orderBy(asc(publishers.name));
    return rows.map((row) => ({ id: row.id, name: row.name }));
}

/** All game ids ordered by title. */
export async function getAllGameIds(db: Database): Promise<number[]> {
    const rows = await db.select({ id: games.id }).from(games).orderBy(asc(games.title));
    return rows.map((row) => row.id);
}

/** A single game by id, or null when it does not exist. */
export async function getGameById(db: Database, id: number): Promise<Game | null> {
    const row = await baseGamesQuery(db).where(eq(games.id, id)).get();
    return row ? mapGame(row) : null;
}
