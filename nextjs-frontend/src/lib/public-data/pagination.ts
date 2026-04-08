export const PAGE_SIZE = 50;

export function paginateItems<T>(items: T[], page: number) {
  const currentPage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
  const totalCount = items.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const safePage = Math.min(currentPage, totalPages);
  const start = (safePage - 1) * PAGE_SIZE;

  return {
    items: items.slice(start, start + PAGE_SIZE),
    page: safePage,
    totalPages,
    totalCount,
    pageSize: PAGE_SIZE,
  };
}
