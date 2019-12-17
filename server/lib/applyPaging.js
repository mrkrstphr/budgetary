module.exports = async function applyPaging(
  query,
  { perPage = 2555, page = 1 },
) {
  const currentPage = Math.max(1, parseInt(page));
  const limit = Math.max(1, parseInt(perPage));

  const countQuery = query.clone();

  countQuery
    .clearSelect()
    .count('* AS total')
    ._clearGrouping('order');

  query.limit(limit).offset((currentPage - 1) * limit);
  const [count, items] = await Promise.all([countQuery, query]);

  const total = parseInt(count[0].total);
  const paging = {
    page,
    totalRecords: total,
    perPage: limit,
    totalPages: Math.ceil(total / limit),
  };

  return { paging, items };
};
