export const sortList = [
  {
    label: 'Featured',
    value: 'featured',
  },
  {
    label: 'New Arrivals',
    value: 'newest',
  },
  {
    label: 'Low Price',
    value: 'price-asc',
  },
  {
    label: 'High Price',
    value: 'price-desc',
  },
  {
    label: 'Sale Off',
    value: 'sale',
  },
];

export const mobileCenteredModalStyles = {
  content: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255)',
    inset: '50% 0 0 50%',
    transform: 'translate(-50%, -50%)',
    width: '66.66667%',
    overflowY: 'auto',
    padding: '12px',
    maxHeight: '300px',
  },
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, .7)',
  },
};
