//get the fomate date
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default formatDate;
