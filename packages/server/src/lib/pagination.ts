/** 分页由后端限定范围；未传或非法时使用默认值。 */
export const DEFAULT_PAGE_SIZE = 20
export const MAX_PAGE_SIZE = 100

export type ParsedPagination = {
  page: number
  pageSize: number
  skip: number
}

export function parsePagination(
  page: number | undefined,
  pageSize: number | undefined
): ParsedPagination {
  const rawPage = Number(page)
  const rawSize = Number(pageSize)
  const pageNum = Number.isFinite(rawPage) && rawPage >= 1 ? Math.floor(rawPage) : 1
  const sizeRaw = Number.isFinite(rawSize) && rawSize >= 1 ? Math.floor(rawSize) : DEFAULT_PAGE_SIZE
  const pageSizeNum = Math.min(MAX_PAGE_SIZE, Math.max(1, sizeRaw))
  return {
    page: pageNum,
    pageSize: pageSizeNum,
    skip: (pageNum - 1) * pageSizeNum,
  }
}

export function buildPageMeta(total: number, page: number, pageSize: number) {
  return {
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  }
}
