export const sortList = [
  {
    label: 'Featured',
    value: 'featured',
  },
  {
    label: 'Low Price',
    value: 'price-asc',
  },
  {
    label: 'High Price',
    value: 'price-desc',
  },
];

export const modelsConfig = {
  insvd: {
    name: 'Incremental SVD',
    params: [
      {
        name: 'n_factors',
        label: 'Number of factors',
        type: 'number',
        default: 20,
      },
      {
        name: 'n_epochs',
        label: 'Number of epochs',
        type: 'number',
        default: 100,
      },
      {
        name: 'lr_all',
        label: 'Learning rate',
        type: 'number',
        default: 0.005,
      },
      {
        name: 'reg_all',
        label: 'Reg. Parameter',
        type: 'number',
        default: 0.1,
      },
      {
        name: 'random_state',
        label: 'Random State',
        type: 'number',
        default: 42,
      },
    ],
  },
  iknn: {
    name: 'Item-based KNN',
    params: [
      {
        name: 'k',
        label: 'Number of Neighbors',
        type: 'number',
        default: 50,
      },
      {
        name: 'sim_options',
        label: 'Similarity Metrics',
        type: 'text',
        default: 'cosine',
      },
      {
        name: 'random_state',
        label: 'Random State',
        type: 'number',
        default: 42,
      },
    ],
  },
};

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
