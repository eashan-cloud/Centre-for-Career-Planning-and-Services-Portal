export const exportToCSV = (data) => {
  if (!data || !data.length) return '';

  const headers = Object.keys(data[0]);
  const csvRows = [headers.join(',')];

  data.forEach(item => {
    const values = headers.map(header => {
      let val = item[header] ?? '';
      val = typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val;
      return val;
    });
    csvRows.push(values.join(','));
  });

  return csvRows.join('\n');
};
