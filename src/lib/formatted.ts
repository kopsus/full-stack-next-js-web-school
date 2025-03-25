const formatDate = (date: Date) => {
  const dateObj = new Date(date);
  const formattedDate = new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(dateObj);

  return formattedDate;
};

export { formatDate };
