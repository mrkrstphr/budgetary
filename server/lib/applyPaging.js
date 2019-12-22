module.exports = async function applyPaging(
  query,
  { perPage = 2555, page = 1 },
) {
  const currentPage = Math.max(1, parseInt(page, 10));
  const limit = Math.max(1, parseInt(perPage, 10));

  const countQuery = query.clone();

  // eslint-disable-next-line no-underscore-dangle
  countQuery
    .clearSelect()
    .count('* AS total')
    ._clearGrouping('order');

  query.limit(limit).offset((currentPage - 1) * limit);
  const [count, items] = await Promise.all([countQuery, query]);

  const total = parseInt(count[0].total, 10);
  const paging = {
    page,
    totalRecords: total,
    perPage: limit,
    totalPages: Math.ceil(total / limit),
  };

  return { paging, items };
};
